module.exports = {
  locales: [
    "en",
    "fr",
    "ja",
    "zh",
  ],
  catalogs: [
    {
      path: "<rootDir>/locales/{locale}/messages",
      include: [
        "<rootDir>/src",
        "<rootDir>/lib",
      ],
    },
  ],
  fallbackLocales: {
    default: "en",
  },
  sourceLocale: "en",
  format: "po",
};
