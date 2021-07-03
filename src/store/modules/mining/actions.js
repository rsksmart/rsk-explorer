export const setMiningSummary = (context, res) => {
  context.commit('SET_MINING_SUMMARY', res)
}

export const setMiningLastRskBlocks = (context, res) => {
  context.commit('SET_MINING_LAST_RSK_BLOCKS', res)
}

export const setMiningLastBtcBlocks = (context, res) => {
  context.commit('SET_MINING_LAST_BTC_BLOCKS', res)
}

export const setMiningHashrateDistribution = (context, res) => {
  context.commit('SET_MINING_HASHRATE_DISTRIBUTION', res)
}

export const setMiningHashrateOverTime = (context, res) => {
  context.commit('SET_MINING_HASHRATE_OVER_TIME', res)
}

export const setMiningDifficultyOverTime = (context, res) => {
  context.commit('SET_MINING_DIFFICULTY_OVER_TIME', res)
}

export const setMiningRskOverBtcHashrate = (context, res) => {
  context.commit('SET_MINING_RSK_OVER_BTC_HASHRATE', res)
}

export const setDataRange = (context, res) => {
  context.commit('SET_DATA_RANGE', res)
}
