export const getBrowserLocale = () => {
  const fallback = 'en'

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
