import moment from 'moment'

export const hashrateOverTimeToChartData = (
  colors,
  data,
  activeTab,
  isPercentage
) => {
  const labels = data.map(
    ({ time }) => {
      const format = activeTab.name === 'Week' ? 'MMMM D' : 'h:mm a'
      return moment(time).utc(true).format(format)
    }
  )

  const datasets = data.reduce(
    (acc, dataRange) => {
      const miners = dataRange.data.map(miner => ({
        ...miner,
        minername: miner.minerName.match(/0x*/) ? 'Unknown' : miner.name
      }))

      miners.forEach((miner) => {
        const label = miner.minerName
        const data = isPercentage
          ? miner.hashratePercentageInRskNetwork
          : miner.hashrateInRskNetwork

        const minerData = {
          label,
          backgroundColor: colors[miner.minerName],
          borderColor: colors.darkness,
          borderWidth: 1,
          data: [data],
          fill: true
        }

        const existingMinerData = acc.find(
          item => item.label === minerData.label
        )

        if (existingMinerData) {
          existingMinerData.data.push(...minerData.data)
        } else {
          acc.push(minerData)
        }
      })

      return acc
    },
    []
  )

  return {
    labels,
    datasets: datasets || []
  }
}
