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
      if (activeTab.range === 'oneWeek') {
        return moment(time).format('MMMM D')
      }

      return moment(time + '+00:00').local().format('h:mm a')
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
