'use strict';

require('dotenv').config();

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const { site } = require('./src/config');
const { createI18n, LANGS } = require('./src/i18n');
const products = require('./src/data/products');
const looks = require('./src/data/lookbook');
const { validateInquiry, sendInquiry } = require('./src/mailer');

const app = express();
const PORT = process.env.PORT || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https://images.unsplash.com'],
        styleSrc: ["'self'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'"],
        frameSrc: ['https://www.google.com'],
        formAction: ["'self'"],
        upgradeInsecureRequests: IS_PROD ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);
app.use(compression());
app.use(express.urlencoded({ extended: false, limit: '20kb' }));
app.use(express.json({ limit: '20kb' }));
app.use(
  express.static(path.join(__dirname, 'public'), {
    maxAge: IS_PROD ? '30d' : 0,
    etag: true,
  })
);

/* ------------------------------------------------------------------ *
 *  View helpers available in every template
 * ------------------------------------------------------------------ */
// `id` is an Unsplash photo id, or a local path such as "/img/products/x.jpg".
function img(id, w = 1200, h, extra = '') {
  if (id.startsWith('/')) return id;
  const size = h ? `&h=${h}&fit=crop` : '';
  return `https://images.unsplash.com/photo-${id}?auto=format&q=75&w=${w}${size}${extra}`;
}
function srcset(id, ratio, extra = '') {
  if (id.startsWith('/')) return `${id} 1200w`;
  return [480, 800, 1200, 1800]
    .map((w) => `${img(id, w, ratio ? Math.round(w * ratio) : undefined, extra)} ${w}w`)
    .join(', ');
}

/* ------------------------------------------------------------------ *
 *  Bilingual router — Vietnamese at "/", English at "/en"
 * ------------------------------------------------------------------ */
function buildRouter(lang) {
  const router = express.Router();
  const i18n = createI18n(lang);
  const prefix = lang === 'vi' ? '' : `/${lang}`;

  router.use((req, res, next) => {
    const pathWithoutPrefix = req.path === '/' ? '' : req.path;
    res.locals = Object.assign(res.locals, {
      site,
      lang,
      t: i18n.t,
      L: i18n.pick,
      price: i18n.price,
      url: (p = '') => `${prefix}${p}` || '/',
      img,
      srcset,
      currentPath: req.path,
      alternates: LANGS.reduce((acc, l) => {
        acc[l] = `${l === 'vi' ? '' : `/${l}`}${pathWithoutPrefix}` || '/';
        return acc;
      }, {}),
      year: new Date().getFullYear(),
    });
    next();
  });

  router.get('/', (req, res) => {
    res.render('pages/home', {
      page: 'home',
      featured: products.filter((p) => p.featured),
      looks: looks.slice(0, 6),
    });
  });

  router.get('/collections', (req, res) => {
    const category = products.categories.includes(req.query.category) ? req.query.category : 'all';
    const list = category === 'all' ? products : products.filter((p) => p.category === category);
    res.render('pages/collections', {
      page: 'collections',
      list,
      category,
      categories: products.categories,
    });
  });

  router.get('/collections/:slug', (req, res, next) => {
    const product = products.find((p) => p.slug === req.params.slug);
    if (!product) return next();
    const related = products
      .filter((p) => p.slug !== product.slug && p.category === product.category)
      .concat(products.filter((p) => p.category !== product.category))
      .slice(0, 3);
    res.render('pages/product', { page: 'collections', product, related });
  });

  router.get('/lookbook', (req, res) => res.render('pages/lookbook', { page: 'lookbook', looks }));
  router.get('/atelier', (req, res) => res.render('pages/atelier', { page: 'atelier' }));

  router.get('/appointment', (req, res) => {
    const product = products.find((p) => p.slug === req.query.piece);
    res.render('pages/appointment', {
      page: 'appointment',
      values: { piece: product ? i18n.pick(product.name) : '' },
      errors: {},
      status: req.query.sent ? 'sent' : null,
    });
  });

  router.get('/contact', (req, res) =>
    res.render('pages/contact', { page: 'contact', values: {}, errors: {}, status: req.query.sent ? 'sent' : null })
  );

  return router;
}

/* ------------------------------------------------------------------ *
 *  Inquiry endpoint (appointment + contact) — JSON or classic POST
 * ------------------------------------------------------------------ */
const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { ok: false, message: 'Too many requests. Please try again later. / Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau.' },
});

app.post('/api/inquiry', inquiryLimiter, async (req, res) => {
  const lang = LANGS.includes(req.body.lang) ? req.body.lang : 'vi';
  const i18n = createI18n(lang);
  const wantsJson = req.is('application/json') || req.accepts(['html', 'json']) === 'json';

  // Honeypot: bots fill hidden "company" field — pretend success, send nothing.
  if (req.body.company) {
    return wantsJson ? res.json({ ok: true }) : res.redirect(303, req.get('referer') || '/');
  }

  const { data, errors } = validateInquiry(req.body, i18n);
  if (Object.keys(errors).length) {
    if (wantsJson) return res.status(422).json({ ok: false, errors });
    return res.status(422).send(i18n.t('form.errorGeneric'));
  }

  try {
    await sendInquiry(data);
    if (wantsJson) return res.json({ ok: true, message: i18n.t('form.success') });
    const back = data.type === 'appointment' ? 'appointment' : 'contact';
    return res.redirect(303, `${lang === 'vi' ? '' : '/' + lang}/${back}?sent=1`);
  } catch (err) {
    console.error('[inquiry] mail failed:', err.message);
    const message = i18n.t('form.errorSend');
    return wantsJson ? res.status(502).json({ ok: false, message }) : res.status(502).send(message);
  }
});

/* ------------------------------------------------------------------ *
 *  SEO files
 * ------------------------------------------------------------------ */
app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
});

app.get('/sitemap.xml', (req, res) => {
  const paths = ['', '/collections', '/lookbook', '/atelier', '/appointment', '/contact'].concat(
    products.map((p) => `/collections/${p.slug}`)
  );
  const urls = paths
    .map((p) => {
      const vi = `${site.url}${p || '/'}`;
      const en = `${site.url}/en${p}`;
      return `  <url><loc>${vi}</loc>
    <xhtml:link rel="alternate" hreflang="vi" href="${vi}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>
  </url>`;
    })
    .join('\n');
  res
    .type('application/xml')
    .send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>`
    );
});

app.use('/en', buildRouter('en'));
app.use('/', buildRouter('vi'));

/* ------------------------------------------------------------------ *
 *  404 + error handlers
 * ------------------------------------------------------------------ */
app.use((req, res) => {
  const lang = req.path.startsWith('/en') ? 'en' : 'vi';
  const i18n = createI18n(lang);
  const prefix = lang === 'vi' ? '' : '/en';
  res.status(404).render('pages/404', {
    page: '404',
    site,
    lang,
    t: i18n.t,
    L: i18n.pick,
    price: i18n.price,
    url: (p = '') => `${prefix}${p}` || '/',
    img,
    srcset,
    currentPath: req.path,
    alternates: { vi: '/', en: '/en' },
    year: new Date().getFullYear(),
  });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => {
  console.log(`TUAN FASHION running on http://localhost:${PORT}`);
});
