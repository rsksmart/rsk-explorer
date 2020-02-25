
import { testSearchedValue } from '../../../lib/js/validate'
const DEFAULT_TYPE = 'addressByName'

const createSearchKey = (value, type) => {
  return `search--${type}-${value}`
}

export const clearSearchedResults = async ({ commit, dispatch, getters }) => {
  let keys = getters.searchKeysRequested
  commit('CLEAR_SEARCH_REQUEST')
  await dispatch('clearRequests', keys)
  return dispatch('clearResponses', keys)
}

export const updateSearchedValue = async ({ commit, dispatch, state }, value) => {
  value = String(value).replace(/[\W_]+/g, '')
  if (state.value !== value) {
    commit('SET_SEARCH_VALUE', value)
    await dispatch('clearSearchedResults')
  }
  return value
}

export const fetchSearch = async ({ commit, dispatch, getters }, { value, type }) => {
  value = await dispatch('updateSearchedValue', value)
  if (!value) return
  type = type || DEFAULT_TYPE
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

export const prepareSearch = async ({ commit, dispatch, rootGetters }, { value }) => {
  value = await dispatch('updateSearchedValue', value)
  if (!value) return
  let chainId = rootGetters.chainId
  let { number: lastBlock } = rootGetters.lastBlock || {}
  if (lastBlock) lastBlock += 2
  let types = testSearchedValue(value, { chainId, lastBlock })
  commit('SET_SEARCH_TYPES', types)
  return { value, types }
}

export const searchTypes = async ({ dispatch }, { types, value }) => {
  for (let type of types) {
    await dispatch('fetchSearch', { value, type })
  }
}
