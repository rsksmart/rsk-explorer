
export const autoUpdate = state => {
  return state.autoUpdateBlocks
}

export const getConfig = (state, getters) => (type, action, key) => {
  if (type && action) {
    let stype = (state[key]) ? state[key][type] : null
    return (stype && stype[action]) ? stype[action] : {}
  }
}

export const getSavedSort = (state, getters) => (type, action) => {
  return getters.getConfig(type, action, 'sort')
}

export const getSavedQ = (state, getters) => (type, action) => {
  return getters.getConfig(type, action, 'q')
}

export const getTableConfig = (state) => (tableId) => {
  return state.tables[tableId] || {}
}
