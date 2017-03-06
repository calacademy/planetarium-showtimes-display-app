var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

require('dotenv').config()

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  EVENTS_API_URL: JSON.stringify(process.env.EVENTS_API_URL_DEV)
})
