export const connectionUpdate = ({ commit }, connected) => {
  commit('SOCKET_CONNECTION', connected === true)
}

export const socketNewBlocks = ({ state, commit }, data) => {
  commit('LAST_BLOCKS', data)
  if (!state.blocks.length) {
    commit('SET_BLOCKS', data.slice())
  }
}

export const socketBlocks = ({ commit }, data) => {
  commit('SET_BLOCKS', data)
}

export const socketTokens = ({ commit }, data) => {
  commit('SET_TOKENS', data)
}
