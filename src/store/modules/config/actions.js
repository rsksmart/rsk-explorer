export const setAutoUpdate = ({ state, commit }, update) => {
  commit('SET_CONFIG', ['autoUpdateBlocks', update])
}
export const updateConfig = ({ state, commit }, config) => {
  for (let c in config) {
    commit('SET_CONFIG', [c, config[c]])
  }
  commit('CONFIG_LOAD_DONE')
}
