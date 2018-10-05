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

export const socketData = ({ state, commit, dispatch }, res) => {
  let req, pages, error, next, prev, delayed
  ({ req, pages, error, next, prev, delayed } = res)
  let key = req.key
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
      commit('SET_RESPONSE', [key, data])
      commit('SET_CONFIG_Q', { module, action, value: q })
      commit('SET_CONFIG_SORT', { module, action, value: sort })
      commit('SET_SERVER_TIME', res.data.time)
    }
  }
}

export const socketDbStatus = ({ state, commit }, data) => {
  commit('SET_DB_STATUS', data)
}

export const fetchData = ({ commit, getters }, req) => {
  req.params = req.params || {}
  let page, query, sort, action
  ({ page, query, sort, action } = req)
  let module = req.module || null

  const key = (req.key || 'data')
  const time = Date.now()
  let params = Object.assign(req.params, { page, query, sort })
  const data = { module, action, params, key, time, getDelayed: true }
  commit('SET_REQUESTING', [key, time])
  // Fix next 2 lines
  commit('SET_RESPONSE', ['data', { data: null }])
  commit('SET_RESPONSE', ['parentData', { data: null }])
  commit('SET_RESPONSE', [key, responseObject()])
  commit('SOCKET_EMIT', { event: 'data', data })
}

const delayedObject = (payload = {}) => {
  let fields = payload.fields || []
  let registry = payload.registry || false
  return { registry, fields }
}

const responseObject = (res = {}) => {
  let ret = {}
  let keys = ['data', 'parentData', 'error', 'req', 'sort', 'delayed', 'updateError']
  keys.forEach(v => { ret[v] = null })
  return Object.assign(ret, res)
}
