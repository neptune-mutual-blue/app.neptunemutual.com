module.exports = {
  locales: ["zh", "en", "fr", "id", "ja", "ko", "ru", "es", "tr"],
  catalogs: [
    {
      path: "<rootDir>/locales/{locale}/messages",
      include: [
        "<rootDir>/src/components",
        "<rootDir>/src/pages",
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
