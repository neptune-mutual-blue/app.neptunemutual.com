const { i18n } = require('./i18n.config')

module.exports = {
  locales: i18n.locales,
  catalogs: [
    {
      path: '<rootDir>/locales/{locale}/messages',
      include: ['<rootDir>/src', '<rootDir>/lib']
    }
  ],
  sourceLocale: i18n.defaultLocale,
  fallbackLocales: {
    default: i18n.defaultLocale
  },
  format: 'po',
  formatOptions: { origins: true, lineNumbers: true }
}
