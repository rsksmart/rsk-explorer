import moment from 'moment'
import chroma from 'chroma-js'

export const hashrateOverTimeToChartData = (
  colors,
  data,
  activeTab,
  isPercentage
) => {
  const chartColors = [
    colors.orange,
    colors.violet,
    colors.red,
    colors.green,
    colors.blue,
    colors.yellow,
    colors.brand1,
    colors.brand2,
    colors.brand3,
    colors.gray,
    colors.color1,
    colors.color2
  ]

  const datasets = data.reduce(
    (acc, dataRange) => {
      const miners = dataRange.data.map(miner => ({
        ...miner,
        minername: miner.minerName.match(/0x*/) ? 'Unknown' : miner.name
      }))

      miners.forEach((miner, index) => {
        const label = miner.minerName
        const data = isPercentage
          ? miner.hashratePercentageInRskNetwork
          : miner.hashrateInRskNetwork

        const minerData = {
          label,
          backgroundColor: chartColors[index],
          borderColor: chroma(chartColors[index]).darken(0.5),
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

  const labels = data.map(
    ({ time }) => {
      const format = activeTab.name === 'Week' ? 'MMMM D' : 'h:mm a'
      return moment(time).format(format)
    }
  )

  return {
    labels,
    datasets: datasets || []
  }
}
