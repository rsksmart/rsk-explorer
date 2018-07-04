'use strict'
const merge = require('webpack-merge')
var prodEnv = require('./prod.env')
var cfg = require('./cfg')('dev')
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  WS_URL: `"${cfg.WS_URL}"`,
  STATS_URL: `"${cfg.STATS_URL}"`
})
