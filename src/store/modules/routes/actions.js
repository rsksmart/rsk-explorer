
import router from '../../../router'

export const fetchRouteData = ({ commit, getters, dispatch }, req) => {
  let routerQuery = getters.getRouterQuery
  let query = routerQuery.q || getters.getSavedQ(req.type, req.action) || null
  req.sort = routerQuery.sort || null
  req.page = routerQuery.page || 1
  if (query) query = getters.parseQuery(query, true)
  req.query = query
  if (!req.params) req.params = getters.getRouterParams
  dispatch('fetchPageData', req)
}

export const updateRouterQuery = ({ state, getters, dispatch }, update) => {
  update = update || {}
  // update = getters.parseQuery(update)
  let query = getters.getRouterQuery
  for (let p in update) {
    query[p] = update[p]
  }
  dispatch('pushRouterQuery', query)
}

export const pushRouterQuery = ({ state, commit, getters }, query) => {
  query = getters.parseQuery(query)
  router.push({ query })
}
