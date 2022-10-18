/* istanbul ignore file */
import { plurals } from '@/src/config/locales'
import { i18n } from '@lingui/core'

/**
 * Load messages for requested locale and activate it.
 * This function isn't part of the LinguiJS library because there're
 * many ways how to load messages — from REST API, from file, from cache, etc.
 */
export const dynamicActivate = async (locale) => {
  const isProduction = process.env.NODE_ENV === 'production'

  const messages = isProduction
    ? await import(`../../locales/${locale}/messages`)
    : await import(`@lingui/loader!../../locales/${locale}/messages.po`)

  i18n.loadLocaleData(locale, { plurals: () => plurals[locale] })
  i18n.load(locale, messages.messages)
  i18n.activate(locale)
}
