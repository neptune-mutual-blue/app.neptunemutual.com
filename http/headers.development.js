const production = require("./headers.production");
const development = JSON.parse(JSON.stringify(production));

// script-src
development[0].values[0] = `${development[0].values[0]} 'unsafe-eval' 'unsafe-inline'`;
development[0].values[2] = `${development[0].values[2]} 'unsafe-inline'`;

module.exports = development;
