import {
  en,
  es,
  fr,
  ja,
  zh,
  de,
  id,
  it,
  ko,
  ru,
  el,
  tr,
  vi
} from 'make-plural/plurals'

export const DEFAULT_LOCALE = 'en'

export const languageKey = {
  zh: 'Chinese - 中文',
  en: 'English',
  // fr: "French - français",
  // de: "German - Deutsch",
  // id: "Indonesian - Bahasa Indonesia",
  // it: "Italian - italiano",
  ja: 'Japanese - 日本語'
  // ko: "Korean - 한국어",
  // ru: "Russian - русский",
  // es: "Spanish - Español",
  // el: "Greek - Ελληνικά",
  // tr: "Turkish - Türkçe",
  // vi: "Vietnamese - Tiếng Việt",
}

export const localesKey = {
  'Chinese - 中文': 'zh',
  English: 'en',
  // "French - français": "fr",
  // "Indonesian - Bahasa Indonesia": "id",
  // "Italian - italiano": "it",
  'Japanese - 日本語': 'ja'
  // "Korean - 한국어": "ko",
  // "Russian - русский": "ru",
  // "Spanish - Español": "es",
  // "German - Deutsch": "de",
  // "Turkish - Türkçe": "tr",
  // "Greek - Ελληνικά": "el",
  // "Vietnamese - Tiếng Việt": "vi",
}

export const plurals = {
  en: en,
  es: es,
  fr: fr,
  ja: ja,
  zh: zh,
  de: de,
  id: id,
  it: it,
  ko: ko,
  ru: ru,
  el: el,
  tr: tr,
  vi: vi
}

export const SUPPORTED_LOCALES = Object.keys(languageKey)
