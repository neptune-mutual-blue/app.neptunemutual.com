const production = require('./headers.production')
const development = JSON.parse(JSON.stringify(production))

module.exports = development
