import { NEXT, PREV, PAGE } from '../../../config/types'

export const encodedProps = (state) => {
  return ['sort', 'q']
}

export const encodeQueryProp = state => prop => {
  return btoa(JSON.stringify(prop))
}

export const decodeQueryProp = state => encoded => {
  let value = null
  let json = null
  try {
    json = atob(encoded)
    if (json) {
      try {
        value = JSON.parse(json)
      } catch (error) {
        return null
      }
    }
  } catch (error) {
    return null
  }

  return value
}

export const parseQuery = (state, getters) => (query, decode) => {
  if (!query) return
  let encodeProps = getters.encodedProps
  let fn = (decode) ? 'decodeQueryProp' : 'encodeQueryProp'
  encodeProps.forEach((prop) => {
    if (query[prop]) query[prop] = getters[fn](query[prop])
  })
  return query
}

export const getQuery = (state, getters) => {
  let query = getters.getRouterQuery
  let q = query.q || {}
  // if (!q && type) q = getters.
  return q
}

export const getRouterQuery = (state, getters, rootState) => {
  let query = Object.assign({}, rootState.route.query)
  return getters.parseQuery(query, true)
}

export const getRouterParams = (state, getters, rootState) => {
  return rootState.route.params
}

export const getActiveTab = (state, getters, rootState) => {
  return rootState.route.query.__tab
}

export const getActiveContentTab = (state, getters, rootState) => {
  return rootState.route.query.__ctab
}

export const nextKey = () => key => `${NEXT}__${key}`
export const prevKey = () => key => `${PREV}__${key}`
export const pageKey = () => key => `${PAGE}__${key}`

export const removePaginationFromRoute = (state, getters) => (key, query) => {
  const prev = getters.prevKey(key)
  const next = getters.nextKey(key)
  const page = getters.pageKey(key)
  query = Object.assign(query, { [prev]: null, [next]: null, [page]: null })
  return query
}

export const getNewRoute = (state, getters, rootState) => (key, dest) => {
  let { params, name, query, hash } = rootState.route
  if (params) {
    params = Object.assign({}, params)
    params[key] = dest[key]
    return { name, params, query, hash }
  }
}
