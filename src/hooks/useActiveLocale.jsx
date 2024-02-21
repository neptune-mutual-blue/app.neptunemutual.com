import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES
} from '../config/locales'

export const parseLocale = (maybeSupportedLocale) => {
  const lowerMaybeSupportedLocale = maybeSupportedLocale.toLowerCase()

  return SUPPORTED_LOCALES.find(
    (locale) => {
      return locale.toLowerCase() === lowerMaybeSupportedLocale ||
      locale.split('-')[0] === lowerMaybeSupportedLocale
    }
  )
}

export const navigatorLocale = () => {
  if (typeof window === 'undefined' || !window || !navigator || !navigator.language) { return undefined }

  const [language, region] = navigator.language.split('-')

  if (region) {
    return (
      parseLocale(`${language}-${region.toUpperCase()}`) ??
      parseLocale(language)
    )
  }

  return parseLocale(language)
}

export const useActiveLocale = () => {
  return DEFAULT_LOCALE
}
