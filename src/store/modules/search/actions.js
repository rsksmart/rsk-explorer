
const createSearchKey = (value, type) => {
  return `search--${type}-${value}`
}

export const clearSearchedResults = ({ commit, dispatch, getters }) => {
  let keys = getters.searchKeysRequested
  commit('SET_SEARCH_RESULTS')
  commit('CLEAR_SEARCH_REQUEST')
  return dispatch('clearResponses', keys)
}

export const fetchSearch = async ({ state, commit, dispatch, getters }, { value, type }) => {
  commit('SET_SEARCH_VALUE', value)
  let key = createSearchKey(value, type)
  let payload = Object.assign({}, getters.getSearchPayloadByType(type))
  if (!payload) return
  let { params, searchField } = payload
  params = params || {}
  params[searchField] = value
  payload.params = params
  payload.key = key
  await dispatch('fetchData', payload)
  commit('ADD_SEARCH_REQUEST', [key, { payload, type }])
}
