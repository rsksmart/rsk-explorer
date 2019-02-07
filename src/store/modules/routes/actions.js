
import router from '../../../router'

export const fetchRouteData = ({ commit, getters, dispatch }, req) => {
  let routerQuery = getters.getRouterQuery
  let module = req.module
  let action = req.action
  let query = routerQuery.q || getters.getSavedQ(module, action) || null
  req.sort = routerQuery.sort || getters.getSavedSort(module, action) || null
  let key = req.key
  req.page = (key) ? routerQuery[`page__${key}`] || 1 : 1
  if (query) query = getters.parseQuery(query, true)
  req.query = query
  req.params = req.params || {}
  req.params = Object.assign(req.params, getters.getRouterParams)
  return dispatch('fetchData', req)
}

export const updateRouterQuery = ({ state, getters, dispatch }, { query, hash }) => {
  query = query || {}
  // update = getters.parseQuery(update)
  let oldQuery = getters.getRouterQuery
  query = updateQuery(oldQuery, query)
  dispatch('routerPush', { query, hash })
}

export const routerPush = ({ state, commit, getters }, payload) => {
  let { query, hash } = payload
  query = getters.parseQuery(query)
  router.push({ query, hash })
}

export const updateQuery = (query, update) => {
  for (let p in update) {
    query[p] = update[p]
  }
  return query
}
