
import router from '../../../router'

export const fetchRouteData = ({ commit, getters, dispatch }, req) => {
  let routerQuery = getters.getRouterQuery
  let { module, action, key } = req
  let query = routerQuery.q || getters.getSavedQ(module, action) || null
  req.sort = routerQuery.sort || getters.getSavedSort(module, action) || null
  req.next = (key) ? routerQuery[getters.nextKey(key)] : null
  req.prev = (key) ? routerQuery[getters.prevKey(key)] : null
  req.page = (key) ? routerQuery[getters.pageKey(key)] : null
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
    let value = update[p]
    if (value === null) delete query[p]
    else query[p] = value
  }
  return query
}
