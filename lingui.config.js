const nextConfigFactory = require('./next.config')

const nextConfig = nextConfigFactory()

module.exports = {
  locales: nextConfig.i18n.locales,
  catalogs: [
    {
      path: '<rootDir>/locales/{locale}/messages',
      include: ['<rootDir>/src', '<rootDir>/lib']
    }
  ],
  sourceLocale: nextConfig.i18n.defaultLocale,
  fallbackLocales: {
    default: nextConfig.i18n.defaultLocale
  },
  format: 'po',
  formatOptions: { origins: true, lineNumbers: true }
}
