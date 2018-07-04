'use strict'
var pkg = require('../package.json')
var cfg = require('./cfg')('prod')
module.exports = {
  NODE_ENV: '"production"',
  WS_URL: `"${cfg.WS_URL}"`,
  STATS_URL: `"${cfg.STATS_URL}"`,
  APP: {
    name: JSON.stringify(pkg.name),
    version: JSON.stringify(pkg.version)
  }
}
