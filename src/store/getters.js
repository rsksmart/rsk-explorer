export const getDate = (state, getters) => {
  let date = state.date
  date += getters.timeDifference
  return date
}

export const getSize = state => {
  return state.size
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

export const blockStyle = (state, getters) => blockNumber => {
  let color = getters.getBlockColor(blockNumber)
  return { color, fill: color, 'border-color': color }
}

export const getTableId = (state) => tableName => {
  // if (!tableName) console.warn('missing table name')
  tableName = tableName || 'Table'
  let routeName = state.route.name || 'unNamedRoute'
  return `${routeName}-${tableName}`
}

export const dbIsOutdated = (state) => {
  let status = state.backend.dbStatus
  let missing = status.dbMissingBlocks || 0
  let requesting = status.requestingBlocks
  if (missing > requesting) return true
}
