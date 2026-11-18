'use strict';

/**
 * Brand-wide settings. Edit contact details here — every page reads from this file.
 * SITE_URL should be set in .env once the domain is live (used for SEO tags and sitemap).
 */
const site = {
  name: 'TUAN FASHION',
  url: (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
  email: process.env.PUBLIC_EMAIL || 'tuantran261083@gmail.com',
  phone: '0364 573 441',
  phoneIntl: '+84364573441',
  zalo: 'https://zalo.me/0364573441',
  whatsapp: 'https://wa.me/84364573441',
  address: {
    vi: 'Số 18 Đồng Khởi, Phường Sài Gòn, TP. Hồ Chí Minh',
    en: '18 Dong Khoi Street, Saigon Ward, Ho Chi Minh City',
  },
  hours: {
    vi: 'Thứ Hai – Chủ Nhật · 10:00 – 20:00 · Ưu tiên theo lịch hẹn',
    en: 'Monday – Sunday · 10:00 – 20:00 · By appointment preferred',
  },
  mapQuery: 'Dong Khoi Street, Ho Chi Minh City',
  instagram: 'https://instagram.com/',
  facebook: 'https://facebook.com/',
};

module.exports = { site };
