'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
var cfg = require('../src/config/config.json')
cfg = cfg.dev
const WS_URL = process.env.WS_URL || cfg.WS_URL

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  WS_URL: '"' + WS_URL + '"',
})
