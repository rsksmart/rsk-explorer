import Vue from 'vue'

export const SET_SEARCH_VALUE = (state, value) => {
  Vue.set(state, 'value', value)
}

export const SET_SEARCH_RESULTS = (state, results) => {
  results = results || []
  Vue.set(state, 'results', results)
}

export const ADD_SEARCH_RESULT = (state, data) => {
  state.results.push(data)
}

export const ADD_SEARCH_REQUEST = (state, [key, payload]) => {
  Vue.set(state.requested, key, payload)
}

export const CLEAR_SEARCH_REQUEST = state => {
  Vue.set(state, 'requested', {})
}
