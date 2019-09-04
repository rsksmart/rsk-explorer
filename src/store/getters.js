export const getDate = (state, getters) => {
  let date = state.date
  let diff = getters.timeDifference
  date += diff
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

export const getBlockColor = state => (blockNumber, cKey = 'blocksColors') => {
  let colors = state[cKey]
  let c = blockNumber % 10
  return colors[c]
}

export const getBlockColor2 = (state, getters) => blockNumber => {
  return getters.getBlockColor(blockNumber, 'blocksColors2')
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
  let missing = state.backend.missingBlocks
  let now = Date.now()
  let time = missing.time
  return (missing.blocks > 1) && (now - time > 5000)
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

export const connectionEnd = state => {
  return (!state.socketConnected) ? state.socketConnectionEnd : 0
}

export const connectionStart = state => {
  return (state.socketConnected) ? state.socketConnectionStart : 0
}
