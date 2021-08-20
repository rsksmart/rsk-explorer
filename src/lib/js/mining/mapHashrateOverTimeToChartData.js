import moment from 'moment'
import chroma from 'chroma-js'

export const mapHashrateOverTimeToChartData = (
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
          pointBackgroundColor: chroma(colors[miner.minerName]).darken(0.4),
          borderColor: chroma(colors[miner.minerName]).darken(0.4),
          hoverBorderWidth: 10,
          pointRadius: 2,
          borderWidth: 3,
          tension: 0,
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
