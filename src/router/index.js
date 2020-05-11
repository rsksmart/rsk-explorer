import Vue from 'vue'
import store from '../store/'
import Router from 'vue-router'
import routes from './routes'
import { normalizeSearch } from '../lib/js/utils'
import { isValidAddress } from 'rsk-utils/dist/addresses'
import { ROUTES as r } from '../config/types'

Vue.use(Router)
const router = new Router({
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    let x = 0
    let y = 0
    if (savedPosition) {
      return savedPosition
    } else {
      let hash = to.hash
      if (hash) {
        hash = hash.split(':')
        x = hash[0]
        y = hash[1]
      }
      return { x, y }
    }
  },
  routes
})

router.beforeEach((to, from, next) => {
  const configLoaded = store.getters.isConfigLoaded

  // avoid double slash paths
  const { fullPath } = to
  if (/\/\//.test(fullPath)) next(fullPath.replace('//', '/'))

  // Checks if backend configuration is loaded
  if (!configLoaded) {
    const unwatch = store.watch((state, getters) => getters.isConfigLoaded,
      (newValue, oldValue) => {
        if (newValue === true) {
          unwatch()
          checkBeforeEnter(to, from, next)
        }
      })
  } else {
    checkBeforeEnter(to, from, next)
  }
})

router.afterEach((to, from) => {
  const r = Object.assign({}, to)
  r.hash = ''
  router.replace(r).catch(() => { })
})

/**
 *  Navigation guard for all routes
 */
function checkBeforeEnter (to, from, next) {
  const chainId = store.getters.chainId
  const { params } = Object.assign({}, to)
  const { address, hash } = params
  if (hash) params.hash = normalizeSearch(hash)
  if (isAddressPath(to, address)) {
    // checksum error
    let error
    if (!isValidAddress(address, chainId)) {
      error = address
    }
    if (!store.getters.getChecksumError(address)) {
      store.commit('CHECKSUM_ERROR', error)
    }
    to.params.address = normalizeSearch(address)
    next()
  } else {
    next()
  }
}

/* function isCheckAddressPath ({ path }) {
  return new RegExp(`^/${r.checkAddress}`).test(path)
} */

function isAddressPath ({ path }, address) {
  return `/${r.address}/${address}` === path
}

export default router
