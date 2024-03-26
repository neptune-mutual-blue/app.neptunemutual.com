// import { useRouter } from 'next/router'

import React from 'react'

import {
  localStorageLocale,
  navigatorLocale
} from '@/src/i18n/utils'

import { DEFAULT_LOCALE } from '../config/locales'
import { useRouter } from 'next/router'

export const useActiveLocale = () => {
  const router = useRouter()
  const [locale, setLocale] = React.useState(DEFAULT_LOCALE)

  React.useEffect(() => {
    const initialLocale = localStorageLocale() || navigatorLocale() || DEFAULT_LOCALE
    setLocale(initialLocale)
  }, [])

  React.useEffect(() => {
    if (locale !== router.locale) {
      router.replace(router.asPath, router.asPath, { locale })
    }
  }, [locale, router])

  return {
    locale,
    setLocale: (newLocale) => {
      localStorage.setItem('locale', newLocale)
      setLocale(newLocale)
    }
  }
}
