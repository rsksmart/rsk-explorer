export default function (socket) {
  return store => {
    const channels = [
      ['summary', 'setMiningSummary'],
      ['lastRskBlocks', 'setMiningLastRskBlocks'],
      ['lastBtcBlocks', 'setMiningLastBtcBlocks'],
      ['hashrateDistribution', 'setMiningHashrateDistribution'],
      ['hashrateOverTime', 'setMiningHashrateOverTime'],
      ['difficultyOverTime', 'setMiningDifficultyOverTime'],
      ['btcVsRskHROverTime', 'setMiningBtcVsRskHROverTime']
    ]

    channels.forEach(([channel, action]) => {
      socket.on(channel, data => store.dispatch(action, data))
    })
  }
}
