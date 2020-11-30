
export const autoUpdate = state => {
  return state.autoUpdateBlocks
}

export const getConfig = (state, getters) => (module, action, key) => {
  if (module && action) {
    const stype = (state[key]) ? state[key][module] : null
    return (stype && stype[action]) ? stype[action] : {}
  }
}

export const getSavedSort = (state, getters) => (module, action) => {
  return getters.getConfig(module, action, 'sort')
}

export const getSavedQ = (state, getters) => (module, action) => {
  return getters.getConfig(module, action, 'q')
}

export const getTableConfig = (state) => (tableId) => {
  return state.tables[tableId] || {}
}

export const isCsvExport = state => state.exportFormat === 'CSV'

export const getDecimalPlaces = state => state.decimalPlaces
