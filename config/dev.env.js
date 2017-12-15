'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
var cfg = require('../src/config/config.json')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  WS_URL: '"ws://192.168.56.103:3003"'
})
