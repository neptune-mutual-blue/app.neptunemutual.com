import { SUPPORTED_LOCALES } from '../config/locales'

export const getBrowserLocale = () => {
  const fallback = null

  try {
    return (
      navigator.userLanguage ||
      (navigator.languages &&
        navigator.languages.length &&
        navigator.languages[0]) ||
      navigator.language ||
      navigator.browserLanguage ||
      navigator.systemLanguage ||
      fallback
    )
  } catch {
    // `navigator` is not available
  }

  return fallback
}

export const parseLocale = (maybeSupportedLocale) => {
  if (!maybeSupportedLocale) {
    return
  }

  const lowerMaybeSupportedLocale = maybeSupportedLocale.toLowerCase()

  return SUPPORTED_LOCALES.find(
    (locale) => {
      return locale.toLowerCase() === lowerMaybeSupportedLocale ||
      locale.split('-')[0] === lowerMaybeSupportedLocale
    }
  )
}

export const navigatorLocale = () => {
  if (typeof window === 'undefined' || !window) { return undefined }

  const [language, region] = getBrowserLocale().split('-')

  if (region) {
    return (
      parseLocale(`${language}-${region.toUpperCase()}`) ??
      parseLocale(language)
    )
  }

  return parseLocale(language)
}

export const localStorageLocale = () => {
  if (typeof window === 'undefined' || !window || !localStorage) { return undefined }

  return parseLocale(localStorage.getItem('locale'))
}
