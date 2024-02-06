import {
  useCallback,
  useEffect,
  useState
} from 'react'

import { dynamicActivate } from '@/src/i18n/dynamic-activate'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'

import { useActiveLocale } from '../hooks/useActiveLocale'

const DefaultI18n = ({ children }) => {
  return <span>{children}</span>
}

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

  useEffect(() => {
    console.log('Locale %s loaded.', i18n.locale)
  }, [])

  if (!i18n.locale) {
    // only log in browser
    if (typeof window !== 'undefined') {
      console.log('Could not fetch locale')
    }

    return null
  }

  if (!loaded) {
    // prevent the app from rendering with placeholder text before the locale is loaded
    return null
  }

  return <I18nProvider i18n={i18n} defaultComponent={DefaultI18n}>{children}</I18nProvider>
}
