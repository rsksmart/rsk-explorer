import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import { normalizeSearch } from '../lib/js/utils'

Vue.use(Router)
const router = new Router({
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes
})

router.beforeEach((to, from, next) => {
  let { params } = to || {}
  if (params.address) to.params.address = normalizeSearch(params.address)
  next()
})

export default router
