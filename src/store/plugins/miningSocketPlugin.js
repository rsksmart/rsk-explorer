export default function (socket) {
  return store => {
    const channels = [
      ['summary', 'setMiningSummary'],
      ['lastRskBlocks', 'setMiningLastRskBlocks'],
      ['lastBtcBlocks', 'setMiningLastBtcBlocks'],
      ['hashrateDistribution', 'setMiningHashrateDistribution'],
      ['hashrateDistributionOverTime', 'setMiningHashrateOverTime'],
      ['difficultyOverTime', 'setMiningDifficultyOverTime'],
      ['rskOverBtcOverTime', 'setMiningRskOverBtcHashrate']
    ]

    channels.forEach(([channel, action]) => {
      socket.on(channel, data => store.dispatch(action, data))
    })
  }
}
