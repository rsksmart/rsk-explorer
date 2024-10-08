
import { testSearchedValue } from '../../../lib/js/validate'
import { isHexString, isTxOrBlockHash } from '@rsksmart/rsk-utils/dist/strings'
import { getAddr } from '../../../lib/js/rns'
import { store } from '../../../store/index'

const DEFAULT_TYPE = 'addressByName'

const createSearchKey = (value, type) => {
  return `search--${type}-${value}`
}

export const clearSearchedResults = async ({ commit, dispatch, getters }) => {
  const keys = getters.searchKeysRequested
  commit('CLEAR_SEARCH_REQUEST')
  await dispatch('clearRequests', keys)
  return dispatch('clearResponses', keys)
}

export const updateSearchedValue = async ({ commit, dispatch, state }, value) => {
  if (!value) return
  if (value?.match(/.rsk/)) {
    try {
      const address = await getAddr(value)
      store.commit('SET_DOMAIN', { domain: value, address })

      value = address
    } catch (error) {
      // console.error(error.message, value)
    }
  }
  const lcValue = value?.toLowerCase()
  value = (isHexString(value) && isTxOrBlockHash(lcValue)) ? lcValue : value
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
  const key = createSearchKey(value, type)
  const payload = Object.assign({}, getters.getSearchPayloadByType(type))
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
  const chainId = rootGetters.chainId
  let { number: lastBlock } = rootGetters.lastBlock || {}
  if (lastBlock) lastBlock += 2
  const types = testSearchedValue(value, { chainId, lastBlock })
  commit('SET_SEARCH_TYPES', types)
  return { value, types }
}

export const searchTypes = async ({ dispatch }, { types, value }) => {
  for (const type of types) {
    await dispatch('fetchSearch', { value, type })
  }
}

export const searchExpand = ({ commit }, { value }) => {
  commit('SET_SEARCH_EXPAND', value)
}
