import moment from 'moment'

export const mapDifficultyToChartData = (
  colors,
  data,
  activeTab
) => {
  const datasets = data.map(difficulty => difficulty.data.value)

  const labels = data.map(
    ({ time }) => {
      if (activeTab.range === 'oneWeek') {
        return moment(time).format('MMM D')
      }

      return moment(time + '+00:00').local().format('h:mm a')
    }
  )

  return {
    labels,
    datasets: [
      {
        data: datasets,
        borderColor: colors.cyan,
        pointRadius: 0,
        tension: 0,
        borderWidth: 2
      }
    ]
  }
}
