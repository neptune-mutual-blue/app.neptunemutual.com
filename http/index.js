const redirects = require("./redirects");
const development = require("./headers.development");
const production = require("./headers.production");

const get = (config) => {
  return [
    {
      source: "/:path*",
      headers: config.map((x) => {
        return {
          key: x.key,
          value: x.values.join("; "),
        };
      }),
    },
  ];
};

module.exports = {
  headers: {
    development: get(development),
    production: get(production),
  },
  redirects,
};
