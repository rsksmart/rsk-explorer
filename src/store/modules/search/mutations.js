import Vue from 'vue'

export const SET_SEARCH_VALUE = (state, value) => {
  Vue.set(state, 'value', value)
}

export const ADD_SEARCH_REQUEST = (state, [key, payload]) => {
  Vue.set(state.requested, key, payload)
}

export const CLEAR_SEARCH_REQUEST = state => {
  Vue.set(state, 'requested', {})
}

export const SET_SEARCH_TYPES = (state, types) => {
  Vue.set(state, 'types', types)
}

export const SET_SEARCH_EXPAND = (state, value) => {
  Vue.set(state, 'expanded', value)
}

export const SET_SEARCH_LINK = (state, value) => {
  Vue.set(state, 'searchLink', value)
}
