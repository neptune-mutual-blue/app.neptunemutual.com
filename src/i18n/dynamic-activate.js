/* istanbul ignore file */
import { DEFAULT_LOCALE } from '@/src/config/locales'
import { i18n } from '@lingui/core'

import { messages as DEFAULT_MESSAGES } from '../../locales/en/messages'

// Initialize the locale immediately to DEFAULT_LOCALE/DEFAULT_MESSAGES,
// so that messages are shown while the appropriate translation load.
// This is necessary for initial macro translations (t``) to work in the DEFAULT_LOCALE.
i18n.load(DEFAULT_LOCALE, DEFAULT_MESSAGES)
i18n.activate(DEFAULT_LOCALE)

/**
 * Load messages for requested locale and activate it.
 * This function isn't part of the LinguiJS library because there're
 * many ways how to load messages — from REST API, from file, from cache, etc.
 */
export const dynamicActivate = async (locale) => {
  if (i18n.locale === locale) { return }

  try {
    const catalog = await import(`../../locales/${locale}/messages`)
    // Bundlers will either export it as default or as a named export named default.
    i18n.load(locale, catalog.messages || catalog.default.messages)
  } catch (error) {
    console.error(new Error(`Unable to load locale (${locale}): ${error}`))
  }
  i18n.activate(locale)
}
