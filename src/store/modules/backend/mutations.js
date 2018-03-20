import Vue from 'vue'
// catch socket emit
export const SOCKET_EMIT = payload => {}

export const SET_SERVER_TIME = (state, time) => {
  state.serverTime = time
}

export const SET_SYSTEM_SETTINGS = (state, payload) => {
  state.systemSettings = payload
}

export const SET_CLIENT_TIME = (state, time) => {
  state.clientTime = time
}

export const LAST_BLOCKS = (state, blocks) => {
  state.lastBlocks = blocks
}

export const SET_BLOCKS = (state, blocks) => {
  state.blocks = blocks
}

export const LAST_TRANSACTIONS = (state, transactions) => {
  state.lastTransactions = transactions
}

export const SET_TRANSACTIONS = (state, transactions) => {
  state.transactions = transactions
}
export const SET_TOKENS = (state, tokens) => {
  state.tokens = tokens
}

export const SET_PAGE_REQUEST = (state, requesting) => {
  Vue.set(state.page, 'requesting', requesting)
}

export const SET_PAGE_DATA = (state, data) => {
  Vue.set(state.page, 'data', data)
}

export const SET_PAGE_PREV = (state, data) => {
  Vue.set(state.page, 'prev', data)
}

export const SET_PAGE_NEXT = (state, data) => {
  Vue.set(state.page, 'next', data)
}

export const SET_PAGE_PAGES = (state, pages) => {
  Vue.set(state.page, 'pages', pages)
}

export const SET_PAGE_ERROR = (state, error) => {
  Vue.set(state.page, 'error', error)
}

export const SET_PAGE_REQ = (state, req) => {
  Vue.set(state.page, 'req', req)
}

export const SET_PAGE_PARENTDATA = (state, data) => {
  Vue.set(state.page, 'parentData', data)
}
