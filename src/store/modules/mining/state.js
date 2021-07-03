export default function () {
  return {
    rskOverBtcHashrate: {},
    difficultyOverTime: null,
    hashrateDistribution: null,
    hashrateDistributionOverTime: null,
    lastBtcBlocks: null,
    lastRskBlocks: null,
    miningSummary: null,
    dataRange: {
      rskOverBtcHashrate: 'oneDay',
      difficultyOverTime: 'oneHour',
      hashrateDistribution: 'oneHour',
      hashrateDistributionOverTime: 'oneHour',
      lastRskBlocks: 'oneHour',
      lastBtcBlocks: 'oneHour',
      miningSummary: 'oneHour'
    }
  }
}
