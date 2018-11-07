import Vue from 'vue'
// catch socket emit
export const SOCKET_EMIT = payload => { }

export const SET_TIME = (state, payload) => {
  let date = Date.now()
  let server = payload.server || date
  let client = payload.client || date
  state.serverTime = server
  state.clientTime = client
}

export const SET_SYSTEM_SETTINGS = (state, payload) => {
  state.systemSettings = payload
}

export const LAST_BLOCKS = (state, blocks) => {
  blocks = blocks || []
  state.lastBlocks = blocks
}

export const LAST_BLOCKS_TIME = (state, time) => {
  if (undefined === time) time = Date.now()
  state.lastBlocksTime = time
}
export const SET_BLOCKS = (state, blocks) => {
  state.blocks = blocks
}

export const LAST_TRANSACTIONS = (state, transactions) => {
  transactions = transactions || []
  state.lastTransactions = transactions
}

export const SET_TRANSACTIONS = (state, transactions) => {
  state.transactions = transactions
}

export const SET_REQUESTING = (state, payload) => {
  let key = payload[0]
  let value = payload[1]
  if (key) {
    Vue.set(state.requesting, key, value)
  }
}

export const SET_RESPONSE = (state, payload) => {
  let key = payload[0]
  let data = payload[1] || {}
  data.sort = data.sort || {}
  if (!state.responses[key]) Vue.set(state.responses, key, {})
  for (let p in data) {
    Vue.set(state.responses[key], p, data[p])
  }
}

export const SET_DB_STATUS = (state, data) => {
  Vue.set(state, 'dbStatus', data)
  let missing = state.missingBlocks
  if (!missing.blocks) missing.time = Date.now()
  missing.blocks = data.dbMissingBlocks
  Vue.set(state, 'missingBlocks', missing)
}

export const SET_PENDING_BLOCKS = (state, blocks) => {
  let list = state.blocks.slice()
  if (list.length) {
    blocks.map(block => {
      if (!list.find(b => b.number === block.number)) {
        Vue.set(state.pendingBlocks, block.number, true)
      }
    })
  }
}

export const CLEAR_PENDING_BLOCKS = (state) => {
  state.pendingBlocks = {}
}

export const SET_TX_POOL = (state, data) => {
  Vue.set(state, 'txPool', data)
}

export const SET_TX_POOL_CHART = (state, data) => {
  Vue.set(state, 'txPoolChart', data)
}
