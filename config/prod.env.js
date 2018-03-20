'use strict'
var pkg = require('../package.json')
var cfg = require('../src/config/config.json')
cfg = cfg.prod
module.exports = {
  NODE_ENV: '"production"',
  WS_URL: '"' + cfg.WS_URL + '"',
  APP: {
    name: JSON.stringify(pkg.name),
    version: JSON.stringify(pkg.version)
  }
}
