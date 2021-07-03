import moment from 'moment'

export const mapDifficultyToChartData = (
  colors,
  data,
  activeTab
) => {
  const datasets = data.map(difficulty => difficulty.data.value)

  const labels = data.map(
    ({ time }) => {
      const format = activeTab.name === 'Week' ? 'MMMM D' : 'h:mm a'
      return moment(time).format(format)
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
