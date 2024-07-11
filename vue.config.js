
const pkg = require('./package.json')
module.exports = {
  parallel: 0, // e2e test fails on circle-ci with parallel != 0
  configureWebpack: {
    performance: { hints: false }
  },
  css: {
    sourceMap: true
  },
  chainWebpack: config => {
    // remove console in production mode
    /*     config
          .optimization.minimizer('terser').tap((args) => {
            args[0].terserOptions.compress.drop_console = process.env.NODE_ENV === 'production'
            return args
          }) */

    config
      .plugin('define')
      .tap(args => {
        const env = args[0]['process.env']
        const props = ['WS_URL', 'NETWORK', 'STATS_URL', 'GA_TAG', 'HOTJAR_ID', 'STREAM_MITM_URL']
        props.forEach((v) => {
          env[v] = (process.env[v]) ? JSON.stringify(process.env[v]) : env['VUE_APP_' + v] || '""'
        })
        args[0]['process.env'] = Object.assign(env, {
          APP: {
            name: JSON.stringify(pkg.name),
            version: JSON.stringify(pkg.version)
          }
        })
        return args
      })

    const svgRule = config.module.rule('svg')

    svgRule.uses.clear()

    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .end()
      .resourceQuery(/raw/)
      .use('vue-svg-loader')
      .loader('raw-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })

    config.module
      .rule('ethers')
      .test(/\.js$/)
      .include.add(/node_modules\/ethers/)
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .options({
        presets: ['@babel/preset-env']
      })

    config.module
      .rule('noble-curves')
      .test(/\.js$/)
      .include.add(/node_modules\/@noble\/curves/)
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .options({
        presets: ['@babel/preset-env']
      })
  }
}
