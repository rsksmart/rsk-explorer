const pageDataKeyPrefix = 'PageData_'

export const connectionUpdate = ({ commit }, connected) => {
  commit('SOCKET_CONNECTION', connected === true)
}

export const socketNewBlocks = ({ state, commit, getters }, data) => {
  let autoUpdate = getters.autoUpdate
  if (data) {
    let blocks = data.blocks
    let transactions = data.transactions
    commit('LAST_BLOCKS', blocks)
    commit('LAST_TRANSACTIONS', transactions)
    if (!state.blocks.length || autoUpdate) {
      commit('SET_BLOCKS', blocks.slice())
      commit('SET_TRANSACTIONS', transactions.slice())
    }
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
  if (!req) return
  let key = res.req.key
  let data = res.data
  let pages = res.pages
  let error = res.error
  let next = res.next
  let prev = res.prev
  let requesting = state.page.requesting
  if (key && requesting && key === requesting) {
    commit('SET_PAGE_REQUEST', false)
    commit('SET_PAGE_REQ', req)
    if (error) {
      commit('SET_PAGE_ERROR', error)
    } else {
      commit('SET_PAGE_PAGES', pages)
      commit('SET_PAGE_DATA', data)
      commit('SET_PAGE_PREV', prev)
      commit('SET_PAGE_NEXT', next)
    }
  }
}

export const fetchPageData = ({ commit }, data) => {
  let key = pageDataKeyPrefix + Date.now()
  data.key = key
  commit('SET_PAGE_REQUEST', key)
  commit('SET_PAGE_DATA', null)
  commit('SET_PAGE_ERROR', null)
  commit('SET_PAGE_REQ', null)
  commit('SOCKET_EMIT', { event: 'data', data })
}
