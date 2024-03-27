import React, {
  useCallback,
  useEffect,
  useState
} from 'react'

import { DEFAULT_LOCALE } from '@/src/config/locales'
import { dynamicActivate } from '@/src/i18n/dynamic-activate'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'

import { useActiveLocale } from '../hooks/useActiveLocale'

const DefaultI18n = ({ children }) => {
  return <span>{children}</span>
}

/**
 * @type {React.Context<{ locale: string, setLocale: React.Dispatch<React.SetStateAction<string>> }>} LanguageContext
 */
const LanguageContext = React.createContext({
  locale: DEFAULT_LOCALE,
  setLocale: () => {}
})

export const useLanguageContext = () => {
  const context = React.useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider')
  }

  return context
}

export function LanguageProvider ({ children }) {
  const { locale, setLocale } = useActiveLocale()
  // const [loaded, setLoaded] = useState(false)
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    let ignore = false
    dynamicActivate(locale)
      .then(() => {
        /* istanbul ignore next */
        if (ignore) { return }
        console.log('Activated locale %s', locale)
        // setLoaded(true)
      })
      .catch((error) => { return console.error('Failed to activate locale', locale, error) })

    return () => {
      ignore = true
    }
  }, [locale])

  const updateRefresh = useCallback(() => { return setRefresh(r => { return !r }) }, [])

  useEffect(() => {
    // Detect network change and manually refresh
    if (window && window.addEventListener) {
      window.addEventListener('languagechange', updateRefresh)
    }

    return () => { return window.removeEventListener('languagechange', updateRefresh) }
  }, [updateRefresh])

  useEffect(() => { console.log('refreshing...') }, [refresh])

  useEffect(() => { console.log('Locale %s loaded.', i18n.locale) }, [])

  const memoizedValue = React.useMemo(() => {
    return { locale, setLocale }
  }, [locale, setLocale])

  if (!i18n.locale) {
    // only log in browser
    if (typeof window !== 'undefined') {
      console.log('Could not fetch locale')
    }

    return null
  }

  // console.log('Loaded: %s', loaded)
  // if (!loaded) {
  //   // prevent the app from rendering with placeholder text before the locale is loaded
  //   return null
  // }

  return (
    <LanguageContext.Provider value={memoizedValue}>
      <I18nProvider i18n={i18n} defaultComponent={DefaultI18n}>{children}</I18nProvider>
    </LanguageContext.Provider>
  )
}
