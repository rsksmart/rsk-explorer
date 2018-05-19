export const setAutoUpdate = ({ state, commit }, update) => {
  commit('SET_CONFIG', ['autoUpdateBlocks', update])
}
export const updateConfig = ({ state, commit }, config) => {
  for (let c in config) {
    commit('SET_CONFIG', [c, config[c]])
  }
  commit('CONFIG_LOAD_DONE')
}

export const updateTableConfig = ({ state, commit, rootState }, payload) => {
  let id = payload[0]
  let config = payload[1]
  if (id && config) {
    config.w = rootState.size.w
    commit('SET_TABLE', [id, config])
  }
}
