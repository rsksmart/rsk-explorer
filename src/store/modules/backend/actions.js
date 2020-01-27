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
  let transactions = result.data || []
  let autoUpdate = getters.autoUpdate
  commit('LAST_TRANSACTIONS', transactions)
  if (!state.transactions.length || autoUpdate) {
    commit('SET_TRANSACTIONS', transactions.slice())
  }
}
// handle newBlocks from blocks channel
export const socketNewBlocks = ({ state, commit, getters }, result) => {
  let blocks = result.data || []
  let autoUpdate = getters.autoUpdate
  commit('LAST_BLOCKS', blocks)
  if (!state.lastBlocksTime) commit('LAST_BLOCKS_TIME')
  if (!state.blocks.length || autoUpdate) {
    commit('SET_BLOCKS', blocks.slice())
  }
  if (!autoUpdate) commit('SET_PENDING_BLOCKS', blocks)
}

export const socketData = ({ state, commit, dispatch }, res) => {
  let { req, pages, error, next, prev, delayed } = res
  let key = req.key
  const total = (pages) ? pages.total : null
  let sort = (pages) ? pages.sort : null
  let q = (req.params && req.params.query) ? req.params.query : null
  let requested = state.requesting[key]
  let module = req.module || null
  let action = req.action || null
  if (key && requested && requested === req.time) {
    const response = Object.assign({}, state.responses[key])
    let updating = Object.assign(delayedObject(), state.responses[key].delayed)
    let isUpdating = Boolean(!updating.registry && updating.fields.length)
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
        let dFields = Object.keys(data.data)
        let fields = updating.fields.filter(f => dFields.indexOf(f) < 0)
        if (!delayed) commit('SET_RESPONSE', [key, { delayed: delayedObject({ fields }) }])
        const sData = response.data || {}
        for (let f in res.data) {
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
}

// handle status from status channel
export const socketDbStatus = ({ state, commit }, data) => {
  commit('SET_DB_STATUS', data)
}

export const fetchData = ({ state, commit, getters }, req) => {
  req.params = req.params || {}
  let { next, prev, query, sort, action, count, page, fields } = req
  let module = req.module || null

  let limit = req.limit
  let getPages = true

  const key = (req.key || 'data')
  const time = Date.now()
  // count = (undefined === count)

  let params = Object.assign(req.params, { next, prev, query, sort, count, limit, page, getPages, fields })
  const data = { module, action, params, key, time, getDelayed: true }
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
  let fields = payload.fields || []
  let registry = payload.registry || false
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
  for (let key of keys) {
    commit('CLEAR_RESPONSE', key)
  }
}
