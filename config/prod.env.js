require('dotenv').config()

module.exports = {
  NODE_ENV: '"production"',
  EVENTS_API_URL: JSON.stringify(process.env.EVENTS_API_URL_PROD)
}
