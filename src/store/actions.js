export const socketError = ({ commit, dispatch }, error) => {
  commit('SOCKET_ERROR', error)
  dispatch('socketPageData', error)
}

export const init = ({ dispatch, commit }) => {
  dispatch('setDateInterval')
}

export const setSize = ({ commit }, size) => {
  commit('SET_SIZE', size)
}
export const setDateInterval = ({ state, commit }) => {
  // update date every second
  if (!state.dateInterval) {
    let interval = setInterval(() => {
      commit('SET_DATE')
    }, 1000)
    commit('SET_DATE_INTERVAL', interval)
  }
}

export const updateBlocks = ({ state, commit }) => {
  let blocks = state.backend.lastBlocks
  let transactions = state.backend.lastTransactions
  commit('LAST_BLOCKS_TIME')
  commit('SET_BLOCKS', blocks)
  commit('SET_TRANSACTIONS', transactions)
}
