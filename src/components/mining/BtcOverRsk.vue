<template lang="pug">
  .box
    h3.title BTC vs RSK Hashrate Over Time
    .tabs
      .tabs-titles
        template(v-for="tab in tabs")
          button.btn.tab-title(@click='setActiveTab(tab, $event)'
            :class="{active: activeTab.name === tab.name}")
            span.title {{ tab.name }}
        button.btn.tab-title(v-if="false" @click='toggleUnit')
          span.title {{ isPercentage ? 'Unit' : '%' }}
        select.btn.tab-title.select(@change="setDataset($event)")
          option(v-for="index in maxDataset.btcVsRskHROverTime" :value="index") {{ index }}
        span.tab-title Dataset
    .chart-container
      line-chart.chart(v-if="chartData.datasets.length !== 0" :styles="styles" :chart-data="chartData" :options="options")
      div(v-else) No data
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import * as moment from 'moment'

import LineChart from './LineChart'
import BlockBox from '../BlockBox'

export default {
  components: { LineChart, BlockBox },
  data () {
    return {
      tabs: [
        {
          name: 'Hour',
          range: 'oneHour',
          isActive: true
        },
        {
          name: 'Day',
          range: 'oneDay',
          isActive: false
        },
        {
          name: 'Week',
          range: 'oneWeek',
          isActive: false
        }
      ],
      isPercentage: true,
      showLegend: false,
      options: {
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {
              fontColor: '#9fdfd1',
              fontFamily: 'Titillium Web'
            },
            scaleLabel: {
              display: true,
              labelString: 'Eh/s',
              fontFamily: 'Titillium Web',
              fontColor: '#9fdfd1'
            }
          }],
          xAxes: [{
            ticks: {
              fontColor: '#9fdfd1',
              fontFamily: 'Titillium Web'
            }
          }]
        },
        maintainAspectRatio: false,
        legend: {
          position: 'bottom',
          labels: {
            fontFamily: 'Titillium Web',
            boxWidth: 14,
            fontColor: '#9fdfd1'
          }
        },
        tooltips: {
          position: 'nearest',
          intersect: false,
          bodyFontFamily: 'Titillium Web'
        },
        layout: {
          padding: {
            top: 20
          }
        },
        plugins: {
          datalabels: false
        }
      }
    }
  },
  mounted () {},
  computed: {
    ...mapGetters({
      colors: 'getColors'
    }),

    ...mapState({
      btcVsRskHROverTime: state => state.mining.btcVsRskHROverTime,
      dataset: state => state.mining.dataset,
      range: state => state.mining.dataRange,
      maxDataset: state => state.mining.maxDataset
    }),

    styles () {
      return {
        height: '300px',
        position: 'relative'
      }
    },

    chartData: function () {
      if (!this.btcVsRskHROverTime) {
        return { labels: [], datasets: [] }
      }

      const btcVsRskHROverTimeDataInRange = this.btcVsRskHROverTime[this.range.btcVsRskHROverTime]

      const btcVsRskHROverTimeDatesets = btcVsRskHROverTimeDataInRange.reduce((acc, { time, data }) => {
        const { btcHashrate, rskHashrate, rskObjectiveHashrate } = data

        const btcData = { borderColor: this.colors.orange, label: 'BTC Hashrate', data: [btcHashrate.value] }
        const rskData = { borderColor: this.colors.green, label: 'RSK Hashrate', data: [rskHashrate.value] }
        const rskObjectiveData = { borderColor: this.colors.orange, borderDash: [1, 2], label: '51% BTC', data: [rskObjectiveHashrate.value] }

        const existingBtcData = acc.find(item => item.label === 'BTC Hashrate')
        const existingRskData = acc.find(item => item.label === 'RSK Hashrate')
        const existingRskObjectiveData = acc.find(item => item.label === '51% BTC')

        if (existingBtcData) {
          existingBtcData.data.push(...btcData.data)
        } else {
          acc.push(btcData)
        }

        if (existingRskData) {
          existingRskData.data.push(...rskData.data)
        } else {
          acc.push(rskData)
        }

        if (existingRskObjectiveData) {
          existingRskObjectiveData.data.push(...rskObjectiveData.data)
        } else {
          acc.push(rskObjectiveData)
        }

        return acc
      }, [])

      const btcVsRskHROverTimeLabels =
        btcVsRskHROverTimeDataInRange.map(({ time }) => {
          const format = this.activeTab.name === 'Week' ? 'MMMM D' : 'h:mm a'
          return moment(time).format(format)
        })

      return {
        labels: btcVsRskHROverTimeLabels,
        datasets: btcVsRskHROverTimeDatesets
      }
    },

    percentage: function () {
      return this.isPercentage
    },

    activeTab: function () {
      return this.tabs.find(tab => tab.isActive)
    }
  },
  methods: {
    ...mapActions(['triggerRandomDataset', 'setDataRange']),
    setActiveTab (tab, e) {
      this.setDataRange({ btcVsRskHROverTime: tab.range })
      this.tabs = this.tabs.map(t => ({ ...t, isActive: tab.name === t.name }))
    },

    toggleUnit () {
      this.isPercentage = !this.isPercentage
    },

    setDataset (e) {
      this.triggerRandomDataset({ dataset: 'btcVsRskHROverTime', value: Number(e.target.value) })
    }
  }
}
</script>

<style lang="stylus">
  .chart-container
    position relative
    width 100%

  .chart
    width 100%
</style>
