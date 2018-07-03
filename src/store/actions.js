export const socketError = ({ commit, dispatch }, error) => {
  commit('SOCKET_ERROR', error)
  dispatch('socketData', error)
}

export const init = ({ dispatch, commit }) => {
  dispatch('setDateInterval')
  commit('CONFIG_LOAD')
}

export const setSize = ({ commit }, size) => {
  commit('SET_SIZE', size)
}
export const setDateInterval = ({ state, commit }) => {
  // update date every second
  let interval = state.dateInterval
  if (interval) clearInterval(interval)
  interval = setInterval(() => {
    commit('SET_DATE')
  }, 1000)
  commit('SET_DATE_INTERVAL', interval)
}

export const updateBlocks = ({ state, commit }) => {
  let blocks = state.backend.lastBlocks
  let transactions = state.backend.lastTransactions
  commit('LAST_BLOCKS_TIME')
  commit('CLEAR_PENDING_BLOCKS')
  commit('SET_BLOCKS', blocks.slice())
  commit('SET_TRANSACTIONS', transactions.slice())
}
