export const getDate = (state, getters) => {
  let date = state.date
  date += getters.timeDifference
  return date
}

export const timeDifference = state => {
  return state.backend.serverTime - state.backend.clientTime
}

export const getTokenData = state => address => {
  let tokens = state.backend.tokens
  if (tokens.length) {
    return tokens.find(token => {
      return token.address === address
    })
  }
}

export const getColors = state => {
  return state.colors
}

export const getBlockColor = state => blockNumber => {
  let colors = state.blocksColors
  let c = blockNumber % 10
  return colors[c]
}
