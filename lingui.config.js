module.exports = {
  locales: [
    "en",
    "es",
    "fr",
    "ja",
    "zh",
    "de",
    "id",
    "it",
    "ko",
    "ru",
    "el",
    "tr",
    "vi",
  ],
  catalogs: [
    {
      path: "<rootDir>/locales/{locale}/messages",
      include: ["<rootDir>/src", "<rootDir>/lib"],
    },
  ],
  fallbackLocales: {
    default: "en",
  },
  sourceLocale: "en",
  format: "po",
};
