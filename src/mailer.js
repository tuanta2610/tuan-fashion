'use strict';

const nodemailer = require('nodemailer');
const { site } = require('./config');
const vi = require('./locales/vi');
const en = require('./locales/en');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LIMITS = { name: 120, email: 160, phone: 30, piece: 160, message: 2000 };
const ALLOWED_TIMES = vi.form.timeOptions;
const ALLOWED_SERVICES = [...vi.form.serviceOptions, ...en.form.serviceOptions];

const clean = (v) => (typeof v === 'string' ? v.trim() : '');

/** Validate an appointment or contact submission. Returns { data, errors }. */
function validateInquiry(body, i18n) {
  const { t } = i18n;
  const type = body.type === 'appointment' ? 'appointment' : 'contact';
  const data = {
    type,
    lang: i18n.lang,
    name: clean(body.name),
    email: clean(body.email).toLowerCase(),
    phone: clean(body.phone),
    date: clean(body.date),
    time: clean(body.time),
    service: clean(body.service),
    piece: clean(body.piece),
    message: clean(body.message),
    consent: body.consent === 'on' || body.consent === true || body.consent === 'true',
  };
  const errors = {};

  if (!data.name) errors.name = t('form.required', { field: t('form.name').toLowerCase() });
  if (!data.email) errors.email = t('form.required', { field: 'email' });
  else if (!EMAIL_RE.test(data.email)) errors.email = t('form.invalidEmail');

  const digits = data.phone.replace(/\D/g, '');
  if (type === 'appointment' && !data.phone) {
    errors.phone = t('form.required', { field: t('form.phone').toLowerCase() });
  } else if (data.phone && (digits.length < 9 || digits.length > 15)) {
    errors.phone = t('form.invalidPhone');
  }

  if (type === 'appointment') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const picked = new Date(`${data.date}T00:00:00`);
    if (!data.date || Number.isNaN(picked.getTime()) || picked < today) errors.date = t('form.invalidDate');
    if (!ALLOWED_TIMES.includes(data.time)) data.time = '';
    if (!ALLOWED_SERVICES.includes(data.service)) {
      errors.service = t('form.required', { field: t('form.service').toLowerCase() });
    }
  } else if (!data.message) {
    errors.message = t('form.required', { field: t('form.message').toLowerCase() });
  }

  for (const [field, max] of Object.entries(LIMITS)) {
    if (data[field] && data[field].length > max) errors[field] = t('form.tooLong', { max });
  }
  if (!data.consent) errors.consent = t('form.consentRequired');

  return { data, errors };
}

const escapeHtml = (s) =>
  String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

let transporter;
function getTransporter() {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 465);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

function renderRows(data) {
  const rows = [
    ['Loại yêu cầu', data.type === 'appointment' ? 'Đặt lịch hẹn' : 'Liên hệ'],
    ['Họ tên', data.name],
    ['Email', data.email],
    ['Điện thoại', data.phone],
    ['Dịch vụ', data.service],
    ['Ngày', data.date],
    ['Khung giờ', data.time],
    ['Thiết kế', data.piece],
    ['Ngôn ngữ', data.lang.toUpperCase()],
  ].filter(([, v]) => v);
  return rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#6b625a">${k}</td><td style="padding:6px 0">${escapeHtml(v)}</td></tr>`
    )
    .join('');
}

/** Send the inquiry to the maison (and a short confirmation to the client). */
async function sendInquiry(data) {
  if (!smtpConfigured()) {
    if (process.env.NODE_ENV === 'production') throw new Error('SMTP is not configured');
    console.log('[inquiry] SMTP not configured — would send:', data);
    return;
  }

  const from = process.env.MAIL_FROM || `"${site.name}" <${process.env.SMTP_USER}>`;
  const to = process.env.MAIL_TO || site.email;
  const subject =
    data.type === 'appointment'
      ? `[Lịch hẹn] ${data.name} — ${data.date} ${data.time}`.trim()
      : `[Liên hệ] ${data.name}`;

  await getTransporter().sendMail({
    from,
    to,
    replyTo: data.email,
    subject,
    text: Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n'),
    html: `<div style="font-family:Georgia,serif;color:#1a1714">
      <h2 style="font-weight:400;letter-spacing:.08em">${escapeHtml(subject)}</h2>
      <table style="font-family:Arial,sans-serif;font-size:14px">${renderRows(data)}</table>
      ${data.message ? `<p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap;border-left:2px solid #7a5a34;padding-left:12px">${escapeHtml(data.message)}</p>` : ''}
    </div>`,
  });

  if (process.env.AUTO_REPLY !== 'false') {
    const dict = data.lang === 'en' ? en : vi;
    await getTransporter()
      .sendMail({
        from,
        to: data.email,
        subject: `${site.name} — ${dict.form.successTitle}`,
        text: `${data.name},\n\n${dict.form.success}\n\n${site.name}\n${site.phone} · ${site.email}`,
        html: `<div style="font-family:Georgia,serif;color:#1a1714;max-width:520px">
          <p style="letter-spacing:.3em;font-size:13px">TUAN FASHION</p>
          <p>${escapeHtml(data.name)},</p>
          <p>${escapeHtml(dict.form.success)}</p>
          <p style="font-family:Arial,sans-serif;font-size:13px;color:#6b625a">${site.phone} · ${site.email}</p>
        </div>`,
      })
      .catch((err) => console.warn('[inquiry] auto-reply failed:', err.message));
  }
}

module.exports = { validateInquiry, sendInquiry };
