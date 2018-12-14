import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import { normalizeSearch } from '../lib/js/utils'

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
  let { params } = to || {}
  if (params.address) to.params.address = normalizeSearch(params.address)
  next()
})

router.afterEach((to, from) => {
  let r = Object.assign({}, to)
  r.hash = ''
  router.replace(r)
})

export default router
