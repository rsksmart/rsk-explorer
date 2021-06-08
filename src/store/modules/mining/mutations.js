export const SET_MINING_SUMMARY = (state, payload) => {
  state.miningSummary = payload
}

export const SET_MINING_LAST_RSK_BLOCKS = (state, payload) => {
  state.lastRskBlocks = payload
}

export const SET_MINING_LAST_BTC_BLOCKS = (state, payload) => {
  state.lastBtcBlocks = payload
}

export const SET_MINING_HASHRATE_DISTRIBUTION = (state, payload) => {
  state.hashrateDistribution = payload
}

export const SET_MINING_OVER_TIME = (state, payload) => {
  state.hashrateDistributionOverTime = payload
}

export const SET_MINING_HASHRATE_OVER_TIME = (state, payload) => {
  state.hashrateDistributionOverTime = payload
}

export const SET_MINING_DIFFICULTY_OVER_TIME = (state, payload) => {
  state.difficultyOverTime = payload
}

export const SET_MINING_BTC_VS_RSK_HR_OVER_TIME = (state, payload) => {
  state.btcVsRskHROverTime = payload
}

export const SET_DATA_RANGE = (state, payload) => {
  state.dataRange = { ...state.dataRange, ...payload }
}
