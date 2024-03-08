export const init = ({ commit, dispatch }, data) => {
  if (data) {
    commit('SET_TIME', { server: data.time })
    commit('SET_SYSTEM_SETTINGS', data.settings)
  }
  dispatch('subscribe', 'blocks')
  dispatch('subscribe', 'transactions')
  dispatch('subscribe', 'status')
  dispatch('subscribe', 'txpool')
  dispatch('subscribe', 'stats')
  dispatch('subscribe', 'balances')
}

export const connectionUpdate = ({ commit }, connected) => {
  commit('SOCKET_CONNECTION', connected === true)
}

export const subscribe = ({ commit }, to) => {
  const event = 'subscribe'
  commit('SOCKET_EMIT', { event, data: { to } })
}

// handle newTransactions from transactions channel
export const socketNewTransactions = ({ state, commit, getters }, result) => {
  const transactions = result.data || []
  const autoUpdate = getters.autoUpdate
  commit('LAST_TRANSACTIONS', transactions)
  if (!state.transactions.length || autoUpdate) {
    commit('SET_TRANSACTIONS', transactions.slice())
  }
}
// handle newBlocks from blocks channel
export const socketNewBlocks = ({ state, commit, getters }, result) => {
  const blocks = result.data || []
  const autoUpdate = getters.autoUpdate
  commit('LAST_BLOCKS', blocks)
  if (!state.lastBlocksTime) commit('LAST_BLOCKS_TIME')
  if (!state.blocks.length || autoUpdate) {
    commit('SET_BLOCKS', blocks.slice())
  }
  if (!autoUpdate) commit('SET_PENDING_BLOCKS', blocks)
}

export const socketData = ({ state, commit, getters, dispatch }, res) => {
  const { req, pages, error, next, prev, delayed } = res
  const key = req.key
  const total = (pages) ? pages.total : null
  const sort = (pages) ? pages.sort : null
  const q = (req.params && req.params.query) ? req.params.query : null
  const requested = state.requesting[key]
  const module = req.module || null
  const action = req.action || null

  if (!key || !requested || requested !== req.time) return

  const isExport = getters.isExportKey(key)
  if (isExport) return dispatch('exportPages', res)
  const response = Object.assign({}, state.responses[key])
  const updating = Object.assign(delayedObject(), response.delayed)
  const isUpdating = Boolean(!updating.registry && updating.fields.length)
  if (!delayed) {
    commit('SET_REQUESTING', [key, null])
    commit('SET_RESPONSE', [key, { delayed: delayedObject() }])
  } else {
    commit('SET_RESPONSE', [key, { delayed }])
  }

  const data = { req, pages, prev, next, sort, data: res.data }
  if (error) {
    if (!response.data) {
      // Switch error Not Found to Updating Registry
      commit('SET_RESPONSE', [key, { error }])
    } else {
      commit('SET_RESPONSE', [key, { updateError: error }])
    }
  } else {
    commit('SET_RESPONSE', [key, { error: null }])
    commit('SET_TOTAL', { key, total })
    if (isUpdating) {
      const dFields = Object.keys(data.data)
      const fields = updating.fields.filter(f => dFields.indexOf(f) < 0)
      if (!delayed) commit('SET_RESPONSE', [key, { delayed: delayedObject({ fields }) }])
      const sData = response.data || {}
      for (const f in res.data) {
        sData[f] = res.data[f]
      }
      data.data = sData
    }
    data.time = Date.now()
    commit('SET_RESPONSE', [key, data])
    commit('SET_CONFIG_Q', { module, action, value: q })
    commit('SET_CONFIG_SORT', { module, action, value: sort })
    commit('SET_TIME', { server: res.data.time })
  }
}

// handle status from status channel
export const socketDbStatus = ({ state, commit }, data) => {
  commit('SET_DB_STATUS', data)
}

export const fetchData = ({ state, commit, getters }, req) => {
  req.params = req.params || {}
  const { next, prev, query, sort, action, count, page, fields } = req
  const module = req.module || null
  const limit = req.limit || req.params.limit
  const getPages = (undefined === req.getPages) ? true : req.getPages

  const key = (req.key || 'data')
  const time = Date.now()
  // count = (undefined === count)
  const params = Object.assign(req.params, { next, prev, query, sort, count, limit, page, getPages, fields })
  const getDelayed = (undefined === req.getDelayed) ? true : req.getDelayed
  const data = { module, action, params, key, time, getDelayed }
  commit('SET_REQUESTING', [key, time])
  // Fix next 2 lines
  commit('SET_RESPONSE', [key, { data: null }])
  if (key === 'data') commit('SET_RESPONSE', ['parentData', { data: null }])
  commit('SET_RESPONSE', [key, responseObject()])
  commit('SOCKET_EMIT', { event: 'data', data })
  return req
}

// handle txPool from txPool channel
export const socketTxPool = ({ commit }, data) => {
  commit('SET_TX_POOL', data)
}

// handle txPoolChart from txPool channell
export const socketTxPoolChart = ({ commit }, data) => {
  commit('SET_TX_POOL_CHART', data)
}

export const setKeyData = ({ state, commit }, [key, data]) => {
  commit('SET_RESPONSE', [key, data])
}

const delayedObject = (payload = {}) => {
  const fields = payload.fields || []
  const registry = payload.registry || false
  return { registry, fields }
}

const responseObject = (res = {}) => {
  const keys = ['data', 'parentData', 'error', 'req', 'sort', 'delayed', 'updateError']
  return keys.reduce((v, a) => {
    v[a] = null
    return v
  }, {})
}

// handle newStats from stats channell
export const socketStats = ({ commit }, msg) => {
  commit('SET_STATS', msg)
}

export const clearResponses = ({ commit }, keys) => {
  keys = (!Array.isArray(keys)) ? [keys] : keys
  for (const key of keys) {
    commit('CLEAR_RESPONSE', key)
  }
}

export const clearRequests = ({ commit }, keys) => {
  keys = (!Array.isArray(keys)) ? [keys] : keys
  for (const key of keys) {
    commit('CLEAR_REQUEST', key)
  }
}

// calls fethData with parameters to export
export const fetchExportData = ({ dispatch }, data) => {
  const count = (undefined === data.count) ? false : data.count
  const { query, sort } = data.params
  data = Object.assign(data, { limit: 500, getDelayed: false, getPages: false, count, query, sort })
  dispatch('fetchData', data)
}

// Handles export data events
export const exportPages = ({ commit, dispatch, getters }, res) => {
  const { pages, error, req, data } = res
  const { key } = req
  const { total } = pages

  if (error) return
  const timestamp = Date.now()
  if (total) commit('SET_EXPORT_METADATA', [key, { total, started: timestamp }])
  if (data) {
    let { received } = getters.getExportMetadata(key)
    received += data.length
    commit('SET_EXPORT_METADATA', [key, { received, timestamp }])
  }
}
// Starts export
export const getPages = ({ commit, dispatch }, data) => {
  const { key } = data
  commit('SET_EXPORT_KEY', key)
  data.count = true
  dispatch('fetchExportData', data)
}
