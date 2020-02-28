
import router from '../../../router'
import { Q, SORT } from '../../../config/types'

export const fetchRouteData = ({ commit, getters, dispatch }, req) => {
  let { module, action, key } = req
  let routerQuery = getters.getRouterQuery(key, true)
  let query = routerQuery[Q] || getters.getSavedQ(module, action) || null

  req.sort = routerQuery[SORT] || getters.getSavedSort(module, action) || null
  req.next = (key) ? routerQuery[getters.nextKey(key)] : null
  req.prev = (key) ? routerQuery[getters.prevKey(key)] : null
  req.page = (key) ? routerQuery[getters.pageKey(key)] : null
  if (query) query = getters.parseQuery(query, key, true)
  req.query = query
  req.params = req.params || {}
  req.params = Object.assign(req.params, getters.getRouterParams)

  return dispatch('fetchData', req)
}

export const updateRouterQuery = ({ state, getters, dispatch }, { query, hash, key }) => {
  query = query || {}
  // update = getters.parseQuery(update)
  let oldQuery = getters.getRouterQuery(key)
  query = updateQuery(oldQuery, query)
  dispatch('routerPush', { query, hash, key })
}

export const routerPush = ({ state, commit, getters }, { query, hash, key }) => {
  query = getters.parseQuery(query, key)
  router.push({ query, hash }, () => { })
}

export const updateQuery = (query, update) => {
  for (let p in update) {
    let value = update[p]
    if (value === null) delete query[p]
    else query[p] = value
  }
  return query
}
