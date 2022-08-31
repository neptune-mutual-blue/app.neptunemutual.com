const { v4 } = require("uuid");
const crypto = require("crypto");
const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");
const { i18n } = require("./i18n.config");
const http = require("./http");

module.exports = (phase, { _c }) => {
  return {
    nonceGenerator: () => {
      const hash = crypto.createHash("sha256");
      hash.update(v4());
      return hash.digest("base64");
    },
    reactStrictMode: true,
    experimental: {
      outputStandalone: true,
    },
    eslint: {
      dirs: ["http", "lib", "src"],
    },
    headers: async () => {
      console.log("REQUEST AGAIN");
      if (phase === PHASE_DEVELOPMENT_SERVER) {
        return http.headers.development;
      }

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
