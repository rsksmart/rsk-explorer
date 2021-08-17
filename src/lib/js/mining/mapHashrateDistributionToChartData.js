export const mapHashrateDistributionToChartData = (colors, data, isPercentage) => {
  const dataRange = data.reduce((acc, dist) => {
    const minerName = dist.minerName.match(/0x*/) ? 'Unknown' : dist.minerName

    // Group the miners under the name 'others' if the miner hashrate percentage under %5
    if (Number(dist.hashratePercentageInRskNetwork) < 5) {
      if (acc.others) {
        acc.others.percentage =
          acc.others.percentage + dist.hashratePercentageInRskNetwork
        acc.others.value = acc.others.value + dist.hashrateInRskNetwork
      } else {
        acc.others = {
          percentage: dist.hashratePercentageInRskNetwork,
          value: dist.hashrateInRskNetwork
        }
      }
    } else {
      acc[minerName] = {
        value: dist.hashrateInRskNetwork,
        percentage: dist.hashratePercentageInRskNetwork
      }
    }

    return acc
  }, {})

  const distributionData = Object.values(dataRange)
    .sort((a, b) => b.value - a.value)
    .map(({ percentage, value }) => isPercentage ? percentage : value)

  const labels = Object.keys(dataRange)
  const backgroundColor = labels.map(label => colors[label])

  const datasets = [
    {
      data: distributionData,
      backgroundColor,
      borderColor: 'rgba(0,0,0,.3)'
    }
  ]

  return {
    labels,
    datasets
  }
}
