export const mapHashrateDistributionToChartData = (colors, data, isPercentage) => {
  const chartColors = [
    colors.orange,
    colors.red,
    colors.green,
    colors.violet,
    colors.blue,
    colors.gray,
    colors.brand1,
    colors.brand2,
    colors.brand3,
    colors.color1,
    colors.color2
  ]

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

  const datasets = [
    {
      data: distributionData,
      backgroundColor: chartColors,
      borderColor: colors.darkness
    }
  ]

  const labels = Object.keys(dataRange)

  return {
    labels,
    datasets
  }
}
