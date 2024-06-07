
import { ROUTES as r } from '../../../config/types'

export const getSearchPayloadByType = state => type => {
  const payload = state.payloads[type]
  return (payload) ? Object.assign({}, payload) : {}
}

export const searchKeysRequested = state => Object.keys(state.requested)

export const getSearchLink = (state, getters) => ({ type, value }) => {
  const payload = getters.getSearchPayloadByType(type)
  const path = r[payload.type]
  if (!path || !value) return
  const link = `/${path}/${value}`
  return link
}

export const getSearchedResults = (state, getters) => {
  const { requested } = state
  const results = getters.searchKeysRequested.map(key => {
    const res = getters.getPage(key)
    if (res) {
      let { data } = res
      if (!data) return
      const { type } = requested[key]
      const { searchField, field, getName, getTime } = getters.getSearchPayloadByType(type)
      data = (!Array.isArray(data)) ? [data] : data
      return data.map(d => {
        if (!d) return
        const k = field || searchField
        const value = d[k]
        const link = getters.getSearchLink({ type, value })
        const name = (typeof getName === 'function') ? getName(d) : undefined
        const time = (typeof getTime === 'function') ? getTime(d) : undefined
        return { link, type, value, name, time, data: d }
      })
    }
  })
    .filter(d => d)
  return [].concat.apply([], results)
}

export const requestingSearches = (state, getters) => getters.searchKeysRequested.filter(key => getters.isRequesting(key))

export const searchedValue = state => state.value

export const searchedTypes = state => {
  const types = state.types
  return Object.keys(types).filter(k => types[k])
}

export const isSearchPage = (state, getters) => {
  const re = new RegExp(`^/${r.search}`)
  return re.test(getters.getRouterPath)
}

export const getSearchExpand = (state) => {
  return state.expanded
}
