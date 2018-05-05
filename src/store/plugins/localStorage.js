import { locStorage as storage } from '../../lib/js/io.js'
export default (store) => {
  store.subscribe(mutation => {
    const type = mutation.type
    let loading = store.state.loadingConfig
    if (/^SET_CONFIG/.test(type) && loading === false) {
      storage.set('config', store.state.config)
    }

    // loads config from localStorage
    if (type === 'CONFIG_LOAD') {
      let config = storage.get('config')
      store.dispatch('updateConfig', config)
    }
  })
}
