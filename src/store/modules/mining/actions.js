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

export const setMiningBtcVsRskHROverTime = (context, res) => {
  context.commit('SET_MINING_BTC_VS_RSK_HR_OVER_TIME', res)
}

export const setDataRange = (context, res) => {
  context.commit('SET_DATA_RANGE', res)
}

export const triggerRandomDataset = async (context, { dataset, value }) => {
  const randomDataset = { ...context.state.dataset, [dataset]: value }

  context.commit('SET_DATASET', randomDataset)

  await fetch(process.env.VUE_APP_M_POST_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(randomDataset)
  })
}
