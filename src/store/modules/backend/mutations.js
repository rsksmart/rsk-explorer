// catch socket emit
export const SOCKET_EMIT = payload => {}

export const SET_SERVER_TIME = (state, time) => {
  state.serverTime = time
}

export const SET_CLIENT_TIME = (state, time) => {
  state.clientTime = time
}

export const LAST_BLOCKS = (state, blocks) => {
  state.lastBlocks = blocks
}

export const SET_BLOCKS = (state, blocks) => {
  state.blocks = blocks
}
