
import { ROUTES as r } from '../../../config/types'

export const getSearchPayloadByType = state => type => {
  let payload = state.payloads[type]
  return (payload) ? Object.assign({}, payload) : {}
}

export const searchKeysRequested = state => Object.keys(state.requested)

export const getSearchLink = (state, getters) => ({ type, value }) => {
  let payload = getters.getSearchPayloadByType(type)
  let path = r[payload.type]
  if (!path || !value) return
  let link = `/${path}/${value}`
  return link
}

export const getSearchedResults = (state, getters) => {
  let { requested } = state
  let results = getters.searchKeysRequested.map(key => {
    let res = getters.getPage(key)
    if (res) {
      let { data } = res
      if (!data) return
      let { type } = requested[key]
      let { searchField, field, getName } = getters.getSearchPayloadByType(type)
      data = (!Array.isArray(data)) ? [data] : data
      return data.map(d => {
        if (!d) return
        let k = field || searchField
        let value = d[k]
        let link = getters.getSearchLink({ type, value })
        let name = (typeof getName === 'function') ? getName(d) : undefined
        return { link, type, value, name, data: d }
      })
    }
  })
    .filter(d => d)
  return [].concat.apply([], results)
}

export const requestingSearches = (state, getters) => getters.searchKeysRequested.filter(key => getters.isRequesting(key))
