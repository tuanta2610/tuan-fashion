/* TUAN FASHION — progressive enhancement. Every feature works without JS. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header state on scroll ---------- */
  var header = document.querySelector('[data-header]');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (toggle && mobileNav) {
    var setMenu = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? toggle.dataset.labelClose : toggle.dataset.labelOpen);
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) {
        mobileNav.hidden = false;
        requestAnimationFrame(function () { mobileNav.classList.add('is-open'); });
        var first = mobileNav.querySelector('a');
        if (first) first.focus();
      } else {
        mobileNav.classList.remove('is-open');
        setTimeout(function () { mobileNav.hidden = true; }, reduceMotion ? 0 : 320);
      }
    };
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // gentle stagger for siblings revealed together
        var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
          return c.classList.contains('reveal') && !c.classList.contains('is-visible');
        });
        var idx = Math.max(0, siblings.indexOf(el));
        el.style.transitionDelay = Math.min(idx * 80, 400) + 'ms';
        el.classList.add('is-visible');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Chat widget ---------- */
  var chatToggle = document.querySelector('[data-chat-toggle]');
  var chatPanel = document.querySelector('[data-chat-panel]');
  if (chatToggle && chatPanel) {
    var setChat = function (open) {
      chatToggle.setAttribute('aria-expanded', String(open));
      chatPanel.hidden = !open;
    };
    chatToggle.addEventListener('click', function () {
      setChat(chatToggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('[data-chat]')) setChat(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !chatPanel.hidden) { setChat(false); chatToggle.focus(); }
    });
  }

  /* ---------- Date inputs: no past dates ---------- */
  document.querySelectorAll('[data-min-today]').forEach(function (input) {
    var d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    input.min = d.toISOString().slice(0, 10);
  });

  /* ---------- Lookbook lightbox ---------- */
  var lightbox = document.querySelector('[data-lightbox]');
  var lookButtons = Array.prototype.slice.call(document.querySelectorAll('[data-look-index]'));
  if (lightbox && lookButtons.length && typeof lightbox.showModal === 'function') {
    var lbImg = lightbox.querySelector('[data-lightbox-img]');
    var lbCaption = lightbox.querySelector('[data-lightbox-caption]');
    var lbPiece = lightbox.querySelector('[data-lightbox-piece]');
    var current = 0;
    var lastTrigger = null;

    var show = function (i) {
      current = (i + lookButtons.length) % lookButtons.length;
      var b = lookButtons[current];
      lbImg.src = b.dataset.full;
      lbImg.alt = b.dataset.caption;
      lbCaption.textContent = b.dataset.caption;
      if (b.dataset.piece) { lbPiece.href = b.dataset.piece; lbPiece.hidden = false; }
      else { lbPiece.hidden = true; }
    };

    lookButtons.forEach(function (b, i) {
      b.addEventListener('click', function () {
        lastTrigger = b;
        show(i);
        lightbox.showModal();
        document.body.style.overflow = 'hidden';
      });
    });
    lightbox.querySelector('[data-lightbox-close]').addEventListener('click', function () { lightbox.close(); });
    lightbox.querySelector('[data-lightbox-prev]').addEventListener('click', function () { show(current - 1); });
    lightbox.querySelector('[data-lightbox-next]').addEventListener('click', function () { show(current + 1); });
    lightbox.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox || e.target.classList.contains('lightbox-inner')) lightbox.close(); });
    lightbox.addEventListener('close', function () {
      document.body.style.overflow = '';
      if (lastTrigger) lastTrigger.focus();
    });

    // simple swipe
    var startX = null;
    lightbox.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
      startX = null;
    });
  }

  /* ---------- Inquiry forms (appointment + contact) ---------- */
  document.querySelectorAll('[data-inquiry]').forEach(function (form) {
    var status = form.querySelector('[data-form-status]');
    var button = form.querySelector('button[type="submit"]');
    var label = form.querySelector('[data-btn-label]');
    var labelText = label ? label.textContent : '';

    var clearErrors = function () {
      form.querySelectorAll('[aria-invalid]').forEach(function (el) { el.removeAttribute('aria-invalid'); });
      form.querySelectorAll('.field-error').forEach(function (el) { el.textContent = ''; });
      status.textContent = '';
    };

    var showErrors = function (errors) {
      var firstField = null;
      Object.keys(errors).forEach(function (name) {
        var input = form.querySelector('[name="' + name + '"]');
        var errEl = form.querySelector('#' + form.querySelector('[name="type"]').value + '-' + name + '-error');
        if (errEl) errEl.textContent = errors[name];
        if (input) {
          input.setAttribute('aria-invalid', 'true');
          if (!firstField) firstField = input;
        }
      });
      if (firstField) firstField.focus();
    };

    // clear a field's error as soon as the user edits it
    form.addEventListener('input', function (e) {
      if (e.target.getAttribute('aria-invalid')) {
        e.target.removeAttribute('aria-invalid');
        var errEl = document.getElementById(e.target.getAttribute('aria-describedby'));
        if (errEl) errEl.textContent = '';
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrors();

      var data = {};
      new FormData(form).forEach(function (value, key) { data[key] = value; });
      data.consent = form.querySelector('[name="consent"]').checked;

      button.disabled = true;
      if (label) label.textContent = form.dataset.sending;

      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (body) { return { res: res, body: body }; });
        })
        .then(function (r) {
          if (r.res.ok && r.body.ok) {
            var done = document.createElement('div');
            done.className = 'form-success';
            done.setAttribute('role', 'status');
            done.setAttribute('tabindex', '-1');
            done.innerHTML =
              '<svg class="icon icon-lg" aria-hidden="true"><use href="#i-check"/></svg>' +
              '<h2 class="h3"></h2><p></p>';
            done.querySelector('h2').textContent = form.dataset.successTitle;
            done.querySelector('p').textContent = r.body.message || '';
            form.replaceWith(done);
            done.focus();
            return;
          }
          if (r.body.errors) {
            showErrors(r.body.errors);
          } else {
            status.textContent = r.body.message || r.res.statusText || 'Error';
          }
        })
        .catch(function () {
          status.textContent = form.querySelector('[name="lang"]').value === 'en'
            ? 'Network error. Please try again or message us on Zalo.'
            : 'Lỗi kết nối. Vui lòng thử lại hoặc nhắn Zalo cho chúng tôi.';
        })
        .finally(function () {
          button.disabled = false;
          if (label) label.textContent = labelText;
        });
    });
  });
})();
