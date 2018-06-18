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

export const socketPageData = ({ state, commit }, res) => {
  let req = res.req
  if (!req) {
    commit('SET_PAGE_ERROR', (res.error || { error: 'error' }))
    return
  }
  let key = res.req.key
  let data = res.data
  let pages = res.pages
  let error = res.error
  let next = res.next
  let prev = res.prev
  let parentData = res.parentData
  let sort = (res.pages) ? res.pages.sort : null
  let q = (req.params && req.params.query) ? req.params.query : null
  let requesting = state.page.requesting
  let type = req.type || null
  let action = req.action || null
  if (key && requesting && key === requesting) {
    commit('SET_PAGE_REQUEST', false)

    if (error) {
      commit('SET_PAGE_ERROR', error)
    } else {
      commit('SET_PAGE', { req, pages, data, prev, next, sort, parentData })
      commit('SET_CONFIG_Q', { type, action, value: q })
      commit('SET_CONFIG_SORT', { type, action, value: sort })
      commit('SET_SERVER_TIME', data.time)
    }
  }
}

export const socketDbStatus = ({ state, commit }, data) => {
  commit('SET_DB_STATUS', data)
}

export const fetchPageData = ({ commit, getters }, req) => {
  req.params = req.params || {}
  let page = req.page || 1
  let query = req.query || null
  let sort = req.sort || null
  let type = req.type || null
  let action = req.action || null

  const key = (req.key || 'page') + '_' + Date.now()
  let params = Object.assign(req.params, { page, query, sort })
  const sData = { type, action, params, key }
  commit('SET_PAGE_REQUEST', key)
  commit('SET_PAGE', { data: null, error: null, req: null, sort: null })
  commit('SOCKET_EMIT', { event: 'data', data: sData })
}
