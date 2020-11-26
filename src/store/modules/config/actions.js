export const setAutoUpdate = ({ state, commit }, update) => {
  commit('SET_CONFIG', ['autoUpdateBlocks', update])
}
export const updateConfig = ({ state, commit }, config) => {
  for (const c in config) {
    commit('SET_CONFIG', [c, config[c]])
  }
  commit('CONFIG_LOAD_DONE')
}

export const updateTableConfig = ({ state, commit, rootState }, payload) => {
  const id = payload[0]
  const config = payload[1]
  if (id && config) {
    config.w = rootState.size.w
    commit('SET_TABLE', [id, config])
  }
}

export const updateExportFormat = ({ commit }, value) => {
  commit('SET_CONFIG_EXPORT_FORMAT', value)
}

export const updateDecimalPlaces = ({ commit }, value) => {
  commit('SET_CONFIG_DECIMAL_PLACES', value)
}
