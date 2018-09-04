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

export const getVersion = state => version => {
  if (undefined === version) version = state.APP.version
  version = String(version).split('.')
  return (version.length === 3) ? version : [0, 0, 0]
}

export const checkVersion = (state, getters) => test => {
  const version = getters.getVersion()
  const testVersion = getters.getVersion(test)
  return version[1] === testVersion[1]
}
