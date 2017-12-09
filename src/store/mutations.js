export const SOCKET_CONNECTION = (state, connection) => {
  state.socketConnected = connection
}

export const SOCKET_ERROR = (state, error) => {
  error.clientTime = Date.now()
  state.socketErrors.push(error)
}
