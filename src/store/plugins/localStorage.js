import { locStorage as storage } from '../../lib/js/io.js'
export default (store) => {
  store.subscribe(mutation => {
    const type = mutation.type
    let loading = store.state.loadingConfig
    if (/^SET_CONFIG/.test(type) && loading === false) {
      const config = store.state.config
      config.APP = store.state.APP
      storage.set('config', config)
    }

    // loads config from localStorage
    if (type === 'CONFIG_LOAD') {
      let config = storage.get('config') || {}
      const sAPP = config.APP || {}
      if (store.getters.checkVersion(sAPP.version)) {
        store.dispatch('updateConfig', config)
      } else {
        storage.set('config', {})
      }
    }
  })
}
