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
  return rootState.route.query.tab
}

export const getActiveContentTab = (state, getters, rootState) => {
  return rootState.route.query.cTab
}
