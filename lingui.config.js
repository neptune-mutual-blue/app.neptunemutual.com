module.exports = {
  locales: [
    'en',
    // "es",
    'fr',
    'ja',
    'zh'
    // "de",
    // "id",
    // "it",
    // "ko",
    // "ru",
    // "el",
    // "tr",
    // "vi",
  ],
  catalogs: [
    {
      path: '<rootDir>/locales/{locale}/messages',
      include: ['<rootDir>/src', '<rootDir>/lib']
    }
  ],
  fallbackLocales: {
    default: 'en'
  },
  sourceLocale: 'en',
  // this is crucial to make `lingui extract` work in nextjs with swc compiler
  extractBabelOptions: {
    presets: [
      '@babel/preset-typescript',
      '@babel/preset-react'
    ]
  },
  format: 'po',
  formatOptions: { origins: true, lineNumbers: true }
}
