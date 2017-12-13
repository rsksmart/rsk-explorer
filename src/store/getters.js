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
