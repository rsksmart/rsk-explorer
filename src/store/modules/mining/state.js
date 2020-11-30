export default function () {
  return {
    btcVsRskHROverTime: {},
    difficultyOverTime: {},
    hashrateDistribution: {},
    hashrateOverTime: {},
    lastBtcBlocks: {},
    lastRskBlocks: {},
    miningSummary: {},
    dataRange: {
      btcVsRskHROverTime: 'oneHour',
      difficultyOverTime: 'oneHour',
      hashrateDistribution: 'oneHour',
      hashrateOverTime: 'oneHour',
      lastRskBlocks: 'oneHour',
      lastBtcBlocks: 'oneHour',
      miningSummary: 'oneHour'
    },
    dataset: {
      btcVsRskOverTime: 1,
      difficultyOverTime: 1,
      hashrateDistribution: 1,
      hashrateDistributionOverTime: 1,
      lastBtcBlocks: 1,
      lastRskBlocks: 1,
      summary: 1
    },
    maxDataset: {
      btcVsRskHROverTime: 4,
      difficultyOverTime: 4,
      hashrateDistribution: 8,
      hashrateDistributionOverTime: 7,
      lastBtcBlocks: 6,
      lastRskBlocks: 4,
      summary: 3
    }
  }
}
