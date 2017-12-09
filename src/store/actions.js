export const socketError = ({ commit }, error) => {
  console.log(error)
  commit('SOCKET_ERROR', error)
}
