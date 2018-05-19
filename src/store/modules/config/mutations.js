import Vue from 'vue'

export const SET_CONFIG = (state, payload) => {
  let key = payload[0]
  let value = payload[1]
  if (undefined !== state[key]) {
    Vue.set(state, key, value)
  }
}

export const SET_CONFIG_KEY = (state, payload) => {
  let type = payload.type || null
  let action = payload.action || null
  let key = payload.key || null
  let value = payload.value || null

  if (type && action && key && value) {
    if (undefined === state[key]) Vue.set(state, key, {})
    if (undefined === state[key][type]) Vue.set(state[key], type, {})
    Vue.set(state[key][type], action, value)
  }
}

export const SET_CONFIG_SORT = (state, payload) => {
  payload.key = 'sort'
  SET_CONFIG_KEY(state, payload)
}

export const SET_CONFIG_Q = (state, payload) => {
  payload.key = 'q'
  SET_CONFIG_KEY(state, payload)
}

export const SET_CONFIG_TABLES = (state, payload) => {
  payload.key = 'tables'
  SET_CONFIG_KEY(state, payload)
}

export const SET_TABLE = (state, payload) => {
  let tableId = payload[0]
  let config = payload[1]
  Vue.set(state.tables, tableId, config)
}
