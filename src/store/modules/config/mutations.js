import Vue from 'vue'

export const SET_CONFIG = (state, payload) => {
  const key = payload[0]
  const value = payload[1]
  if (undefined !== state[key]) {
    Vue.set(state, key, value)
  }
}

export const SET_CONFIG_KEY = (state, payload) => {
  const module = payload.module || null
  const action = payload.action || null
  const key = payload.key || null
  const value = payload.value || null

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
  const tableId = payload[0]
  const config = payload[1]
  Vue.set(state.tables, tableId, config)
}

export const SET_CONFIG_EXPORT_FORMAT = (state, value) => {
  Vue.set(state, 'exportFormat', value)
}

export const SET_CONFIG_DECIMAL_PLACES = (state, value) => {
  value = parseInt(value)
  value = (!isNaN(value)) ? value : 4
  Vue.set(state, 'decimalPlaces', value)
}
