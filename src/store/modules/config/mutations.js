import Vue from 'vue'

export const SET_CONFIG = (state, payload) => {
  let key = payload[0]
  let value = payload[1]
  if (undefined !== state[key]) {
    Vue.set(state, key, value)
  }
}

export const SET_CONFIG_KEY = (state, payload) => {
  let module = payload.module || null
  let action = payload.action || null
  let key = payload.key || null
  let value = payload.value || null

  if (module && action && key && value) {
    if (undefined === state[key]) Vue.set(state, key, {})
    if (undefined === state[key][module]) Vue.set(state[key], module, {})
    Vue.set(state[key][module], action, value)
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
