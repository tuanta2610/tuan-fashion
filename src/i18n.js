'use strict';

const dictionaries = {
  vi: require('./locales/vi'),
  en: require('./locales/en'),
};

const LANGS = Object.keys(dictionaries);

function lookup(dict, key) {
  return key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), dict);
}

function createI18n(lang) {
  const dict = dictionaries[lang] || dictionaries.vi;

  /** Translate a dotted key, with {placeholder} interpolation. */
  const t = (key, vars) => {
    let value = lookup(dict, key);
    if (value === undefined) value = lookup(dictionaries.vi, key);
    if (value === undefined) return key;
    if (typeof value === 'string' && vars) {
      value = value.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : `{${k}}`));
    }
    return value;
  };

  /** Pick the right language from a { vi, en } object (data files). */
  const pick = (field) => {
    if (field == null || typeof field !== 'object') return field;
    return field[lang] !== undefined ? field[lang] : field.vi;
  };

  const vnd = new Intl.NumberFormat(lang === 'vi' ? 'vi-VN' : 'en-US');
  const price = (amount) => (lang === 'vi' ? `${vnd.format(amount)} ₫` : `VND ${vnd.format(amount)}`);

  return { lang, t, pick, price };
}

module.exports = { createI18n, LANGS };
