var cfg = require('../src/config/config.json')

module.exports = (key) => {
  let config = {}
  let conf = cfg[key]
  for (let p in conf) {
    config[p] = process.env[p] || conf[p]
  }
  return config
}
