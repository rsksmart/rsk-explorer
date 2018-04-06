import Vue from 'vue'

export const SET_CONFIG = (state, payload) => {
  Vue.set(state, payload[0], payload[1])
}

export const SET_CONFIG_KEY = (state, payload) => {
  let type = payload.type || null
  let action = payload.action || null
  let key = payload.key || null
  let value = payload.value || null

  if (type && action && key && value) {
    if (!state[key]) Vue.set(state, key, {})
    if (!state[key][type]) Vue.set(state[key], type, {})
    Vue.set(state[key][type], action, value)
  }
}

export const SET_SORT = (state, payload) => {
  payload.key = 'sort'
  SET_CONFIG_KEY(state, payload)
}

export const SET_Q = (state, payload) => {
  payload.key = 'q'
  SET_CONFIG_KEY(state, payload)
}
