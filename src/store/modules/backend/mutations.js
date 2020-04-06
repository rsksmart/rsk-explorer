import Vue from 'vue'
// catch socket emit
export const SOCKET_EMIT = payload => { }

export const SET_TIME = (state, { server, client }) => {
  const date = Date.now()
  state.serverTime = server || date
  state.clientTime = client || date
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

export const SET_REQUESTING = (state, [key, value]) => {
  if (key) Vue.set(state.requesting, key, value)
}

export const CLEAR_REQUEST = (state, key) => {
  Vue.delete(state.requesting, key)
}

export const SET_RESPONSE = (state, [key, data]) => {
  data.sort = data.sort || {}
  if (!state.responses[key]) Vue.set(state.responses, key, {})
  for (const p in data) {
    Vue.set(state.responses[key], p, data[p])
  }
}

export const CLEAR_RESPONSE = (state, key) => {
  Vue.delete(state.responses, key)
}

export const SET_TOTAL = (state, { key, total }) => {
  if (key) state.totals[key] = total
}

export const SET_DB_STATUS = (state, data) => {
  Vue.set(state, 'dbStatus', data)
  const missing = state.missingBlocks
  if (!missing.blocks) missing.time = Date.now()
  missing.blocks = data.dbMissingBlocks
  Vue.set(state, 'missingBlocks', missing)
}

export const SET_PENDING_BLOCKS = (state, blocks) => {
  const list = state.blocks.slice()
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

export const SET_STATS = (state, data) => {
  Vue.set(state, 'stats', data)
}
