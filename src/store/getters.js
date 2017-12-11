export const getDate = (state, getters) => {
  let date = state.date
  date += getters.timeDifference
  return date
}

export const timeDifference = state => {
  return state.backend.serverTime - state.backend.clientTime
}
