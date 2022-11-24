const production = require('./headers.production')
const development = JSON.parse(JSON.stringify(production))

const amplitudeDevServer = process.env.NEXT_PUBLIC_AMPLITUDE_DEV_SERVER_URL || ''

// script-src
development[0].values[0] = `${development[0].values[0]} 'unsafe-eval' 'unsafe-inline'`

// connect-src
development[0].values[1] = `${development[0].values[1]} http://localhost:3000 ws://localhost:3000 ${amplitudeDevServer}`

// style-src
development[0].values[2] = `${development[0].values[2]} 'unsafe-inline'`

// upgrade-insecure-requests
development[0].values[3] = ''

module.exports = development
