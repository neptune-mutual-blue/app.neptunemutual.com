const { i18n } = require("./i18n.config");
const http = require("./http");

module.exports = () => {
  return {
    env: {
      GTM_ID: "my-value",
    },
    reactStrictMode: true,
    experimental: {
      outputStandalone: true,
    },
    eslint: {
      dirs: ["http", "lib", "src"],
    },
    headers: async () => {
      return http.headers.production;
    },
    redirects: async () => {
      return http.redirects;
    },
    i18n,
    webpack: (config) => {
      config.module.rules.push({
        test: /\.po/,
        use: ["@lingui/loader"],
      });

      return config;
    },
  };
};
