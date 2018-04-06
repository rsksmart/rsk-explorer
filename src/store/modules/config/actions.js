export const setAutoUpdate = ({ state, commit }, update) => {
  commit('SET_CONFIG', ['autoUpdateBlocks', update])
}
