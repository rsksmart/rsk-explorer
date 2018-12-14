
import router from '../../../router'

export const fetchRouteData = ({ commit, getters, dispatch }, req) => {
  let routerQuery = getters.getRouterQuery
  let module = req.module
  let action = req.action
  let query = routerQuery.q || getters.getSavedQ(module, action) || null
  req.sort = routerQuery.sort || getters.getSavedSort(module, action) || null
  req.page = routerQuery.page || 1
  if (query) query = getters.parseQuery(query, true)
  req.query = query
  req.params = req.params || {}
  req.params = Object.assign(req.params, getters.getRouterParams)
  return dispatch('fetchData', req)
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
