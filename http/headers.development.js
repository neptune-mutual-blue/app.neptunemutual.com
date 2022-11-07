const production = require('./headers.production')
const development = JSON.parse(JSON.stringify(production))

// script-src
development[0].values[0] = `${development[0].values[0]} 'unsafe-eval' 'unsafe-inline'`

// connect-src
development[0].values[1] = `${development[0].values[1]} http://localhost:3000 ws://localhost:3000`

// upgrade-insecure-requests
development[0].values[3] = ''

module.exports = development
