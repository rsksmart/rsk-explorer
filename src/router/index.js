import Vue from 'vue'
import store from '../store/'
import Router from 'vue-router'
import routes from './routes'
import { normalizeSearch } from '../lib/js/utils'
import { isValidAddress } from '@rsksmart/rsk-utils/dist/addresses'
import { ROUTES as r } from '../config/types'
import { getAddr } from '../lib/js/rns'

Vue.use(Router)
const router = new Router({
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    const toBasePath = to.path.split('/')[1]
    const fromBasePath = from.path.split('/')[1]
    if (toBasePath === fromBasePath) return false
    if (savedPosition) return savedPosition
    return { x: 0, y: 0 }
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
  store.dispatch('changePageTitle', getPageTitleFromRoute(to))
  const r = Object.assign({}, to)
  r.hash = ''
  router.replace(r).catch(() => { })
})

/**
 *  Navigation guard for all routes
 */
async function checkBeforeEnter (to, from, next) {
  const chainId = store.getters.chainId
  const { params } = Object.assign({}, to)
  const { address, hash } = params
  if (hash) params.hash = normalizeSearch(hash)
  if (isAddressPath(to, address)) {
    // Allow `/address/<domain>`
    if (address.match(/.rsk/)) {
      const domain = address
      try {
        const resolved = await getAddr(domain)
        if (resolved) {
          store.commit('SET_DOMAIN', { domain, address: resolved })
          next(`${r.address}/${resolved}`)
        }
      } catch (error) {
        // console.error(error.message)
        next()
      }
    }
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

function getPageTitleFromRoute (route) {
  const { name, params } = route
  return name + ' - ' + Object.values(params).join(',')
}

export default router
