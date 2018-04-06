import Vue from 'vue'
export const SOCKET_CONNECTION = (state, connection) => {
  state.socketConnected = connection
}

export const SOCKET_ERROR = (state, error) => {
  error.clientTime = Date.now()
  state.socketErrors.push(error)
}

export const SET_DATE_INTERVAL = (state, interval) => {
  state.dateInterval = interval
}

export const SET_DATE = state => {
  state.date = Date.now()
}

export const SET_SIZE = (state, size) => {
  Vue.set(state.size, 'w', size.w)
  Vue.set(state.size, 'h', size.h)
}
