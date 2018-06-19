export const init = ({ commit }, data) => {
  if (data) {
    commit('SET_SERVER_TIME', data.time)
    commit('SET_SYSTEM_SETTINGS', data.settings)
  }
}

export const connectionUpdate = ({ commit }, connected) => {
  commit('SOCKET_CONNECTION', connected === true)
}

export const socketNewBlocks = ({ state, commit, getters }, data) => {
  let autoUpdate = getters.autoUpdate
  if (data) {
    let blocks = data.blocks
    let transactions = data.transactions
    if (!state.lastBlocksTime) commit('LAST_BLOCKS_TIME')
    commit('LAST_BLOCKS', blocks)
    commit('LAST_TRANSACTIONS', transactions)
    if (!state.blocks.length || autoUpdate) {
      commit('SET_BLOCKS', blocks.slice())
      commit('SET_TRANSACTIONS', transactions.slice())
    }
    if (!autoUpdate) commit('SET_PENDING_BLOCKS', blocks)
  }
}

export const socketBlocks = ({ commit }, data) => {
  commit('SET_BLOCKS', data)
}

export const socketTransactions = ({ commit }, data) => {
  commit('SET_TRANSACTIONS', data)
}

export const socketTokens = ({ commit }, data) => {
  commit('SET_TOKENS', data)
}

export const socketData = ({ state, commit }, res) => {
  let req = res.req
  let key = res.req.key
  let pages = res.pages
  let error = res.error
  let next = res.next
  let prev = res.prev
  let sort = (res.pages) ? res.pages.sort : null
  let q = (req.params && req.params.query) ? req.params.query : null
  let requested = state.requesting[key]
  let type = req.type || null
  let action = req.action || null

  if (key && requested && requested === req.time) {
    commit('SET_REQUESTING', [key, null])
    let data = { req, pages, prev, next, sort, data: res.data }
    if (error) {
      commit('SET_RESPONSE', [key, { error }])
    } else {
      commit('SET_RESPONSE', [key, data])
      commit('SET_CONFIG_Q', { type, action, value: q })
      commit('SET_CONFIG_SORT', { type, action, value: sort })
      commit('SET_SERVER_TIME', res.data.time)
    }
  }
}

export const socketDbStatus = ({ state, commit }, data) => {
  commit('SET_DB_STATUS', data)
}

export const fetchData = ({ commit, getters }, req) => {
  req.params = req.params || {}
  let page = req.page || 1
  let query = req.query || null
  let sort = req.sort || null
  let type = req.type || null
  let action = req.action || null

  const key = (req.key || 'data')
  const time = Date.now()
  let params = Object.assign(req.params, { page, query, sort })
  const data = { type, action, params, key, time }
  commit('SET_REQUESTING', [key, time])
  commit('SET_RESPONSE', [key, { data: null, parentData: null, error: null, req: null, sort: null }])
  commit('SOCKET_EMIT', { event: 'data', data })
}
