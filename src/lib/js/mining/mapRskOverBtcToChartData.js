import moment from 'moment'

export const mapRskOverBtcToChartData = (colors, data, activeTab) => {
  const datasets = data.reduce(
    (acc, { data }) => {
      const { btcHashrate, rskHashrate, rskObjectiveHashrate } = data

      const btcData = {
        borderColor: colors.orange,
        pointBackgroundColor: colors.orange,
        label: 'BTC Hashrate',
        tension: 0,
        data: [btcHashrate.value]
      }

      const rskData = {
        borderColor: colors.green,
        pointBackgroundColor: colors.green,
        label: 'RSK Hashrate',
        tension: 0,
        data: [rskHashrate.value]
      }

      const rskObjectiveData = {
        borderColor: colors.red,
        pointBackgroundColor: colors.red,
        borderDash: [3, 5],
        tension: 0,
        label: '51% BTC',
        data: [rskObjectiveHashrate.value]
      }

      const existingBtcData = acc.find(item => item.label === 'BTC Hashrate')
      const existingRskData = acc.find(item => item.label === 'RSK Hashrate')
      const existingRskObjectiveData = acc.find(
        item => item.label === '51% BTC'
      )

      if (existingBtcData) existingBtcData.data.push(...btcData.data)
      else acc.push(btcData)

      if (existingRskData) existingRskData.data.push(...rskData.data)
      else acc.push(rskData)

      if (existingRskObjectiveData) existingRskObjectiveData.data.push(...rskObjectiveData.data)
      else acc.push(rskObjectiveData)

      return acc
    },
    []
  )

  const labels = data.map(
    ({ time }) => {
      if (activeTab.range === 'oneWeek') {
        return moment(time).format('MMMM D')
      }

      return moment(time + '+00:00').local().format('h:mm a')
    }
  )

  return {
    labels,
    datasets
  }
}
