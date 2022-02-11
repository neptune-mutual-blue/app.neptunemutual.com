const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");
const http = require("./http");

module.exports = (phase, { _c }) => {
  return {
    reactStrictMode: true,
    headers: async () => {
      if (phase === PHASE_DEVELOPMENT_SERVER) {
        return http.headers.development;
      }

      return http.headers.production;
    },
    redirects: async () => {
      return http.redirects;
    },
  };
};
