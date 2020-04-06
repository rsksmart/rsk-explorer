import { SEPARATOR, SORT, NEXT, PREV, PAGE, Q } from '../../../config/types'

export const encodedProps = state => key => {
  const props = [SORT, Q]
  if (key) return props.map(p => getKey(key, p))
  return props
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

export const parseQuery = (state, getters) => (query, key, decode, removeKey) => {
  if (!query) return
  const props = getters.encodedProps(key)
  const fn = (decode) ? 'decodeQueryProp' : 'encodeQueryProp'
  props.forEach((p) => {
    let value = query[p]
    let k = p
    if (value) {
      value = getters[fn](value)
      if (removeKey) {
        k = getPrefix(key, p)
        delete query[p]
      }
      query[k] = value
    }
  })
  return query
}

export const getQuery = (state, getters) => key => {
  const query = getters.getRouterQuery(key)
  const q = query.q || {}
  return q
}

export const getRouterQuery = (state, getters, rootState) => (key, removeKey = false) => {
  const query = Object.assign({}, rootState.route.query)
  return getters.parseQuery(query, key, true, removeKey)
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

const getKey = (key, prefix) => `${prefix}${SEPARATOR}${key}`
const getPrefix = (key, value) => value.split(SEPARATOR)[0]

export const nextKey = () => key => getKey(key, NEXT)
export const prevKey = () => key => getKey(key, PREV)
export const pageKey = () => key => getKey(key, PAGE)
export const sortKey = () => key => getKey(key, SORT)
export const qKey = () => key => getKey(key, Q)

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

export const getRouterPath = (state, getters, rootState) => rootState.route.path
