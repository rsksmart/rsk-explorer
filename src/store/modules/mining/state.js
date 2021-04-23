export default function () {
  return {
    btcVsRskHROverTime: {},
    difficultyOverTime: null,
    hashrateDistribution: null,
    hashrateDistributionOverTime: null,
    lastBtcBlocks: null,
    lastRskBlocks: null,
    miningSummary: null,
    dataRange: {
      btcVsRskHROverTime: 'oneDay',
      difficultyOverTime: 'oneHour',
      hashrateDistribution: 'oneHour',
      hashrateDistributionOverTime: 'oneHour',
      lastRskBlocks: 'oneHour',
      lastBtcBlocks: 'oneHour',
      miningSummary: 'oneHour'
    }
  }
}
