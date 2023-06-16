import {
  useEffect,
  useState
} from 'react'

import { dynamicActivate } from '@/src/i18n/dynamic-activate'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'

import { useActiveLocale } from '../hooks/useActiveLocale'

export function LanguageProvider ({ children }) {
  const locale = useActiveLocale()
  const [loaded, setLoaded] = useState(false)
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    let ignore = false

    dynamicActivate(locale)
      .then(() => {
        /* istanbul ignore next */
        if (ignore) { return }
        setLoaded(true)
      })
      .catch((error) => { return console.error('Failed to activate locale', locale, error) }
      )

    return () => {
      ignore = true
    }
  }, [locale])

  useEffect(() => {
    if (refresh === true) { setRefresh(false) }
  }, [refresh])

  useEffect(() => {
    const updateRefresh = () => { return setRefresh(true) }

    // Detect network change and manually refresh
    if (window && window.addEventListener) {
      window.addEventListener('languagechange', updateRefresh)
    }

    return () => { return window.removeEventListener('languagechange', updateRefresh) }
  }, [])

  if (!loaded) {
    // only log in browser
    if (typeof window !== 'undefined') {
      console.log('Could not fetch locale')
    }

    // prevent the app from rendering with placeholder text before the locale is loaded
    return null
  }

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>
}
