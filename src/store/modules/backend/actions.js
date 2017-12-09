export const connectionUpdate = ({ commit }, connected) => {
  commit('SOCKET_CONNECTION', connected === true)
}

export const socketNewBlocks = ({ commit }, data) => {
  commit('LAST_BLOCKS', data)
}

export const socketBlocks = ({ commit }, data) => {
  commit('SET_BLOCKS', data)
}
