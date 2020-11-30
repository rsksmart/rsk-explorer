<template lang="pug">
  .box
    h3.title Hashrate Over Time
    .tabs
      .tabs-titles
        template(v-for="tab in tabs")
          button.btn.tab-title(@click='setActiveTab(tab, $event)'
            :class="{active: activeTab.name === tab.name}")
            span.title {{ tab.name }}
        button.btn.tab-title(@click='toggleUnit')
          span.title {{ isPercentage ? 'Unit' : '%' }}
        select.btn.tab-title.select(@change="setDataset($event)")
          option(v-for="index in maxDataset.hashrateDistributionOverTime" :value="index") {{ index }}
        span.tab-title Dataset
    .chart-container
      line-chart.chart(v-if="chartData.datasets.length !== 0" :styles="styles" :chart-data="chartData" :options="options")
      div(v-else) No data
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import * as moment from 'moment'
import chroma from 'chroma-js'

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
      showLegend: false
    }
  },
  mounted () {},
  computed: {
    ...mapGetters({
      colors: 'getColors'
    }),

    ...mapState({
      hashrateOverTime: state => state.mining.hashrateOverTime,
      dataset: state => state.mining.dataset,
      maxDataset: state => state.mining.maxDataset,
      range: state => state.mining.dataRange
    }),

    styles () {
      return {
        height: '300px',
        position: 'relative'
      }
    },

    options () {
      return {
        responsive: true,
        scales: {
          y: {
            display: true,
            scaleLabel: {
              display: true,
              labelString: this.isPercentage ? '%' : 'Eh/s'
            }
          },
          x: {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'SSS'
            }
          },
          yAxes: [{
            ticks: {
              fontColor: '#9fdfd1',
              fontFamily: 'Titillium Web',
              callback: (value, index, values) => this.isPercentage ? value + ' %' : value + ' Eh/s'
            },
            stacked: true
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
    },

    chartData () {
      const chartColors = [
        this.colors.orange,
        this.colors.violet,
        this.colors.red,
        this.colors.green,
        this.colors.blue,
        this.colors.yellow,
        this.colors.brand1,
        this.colors.brand2,
        this.colors.brand3,
        this.colors.gray,
        this.colors.color1,
        this.colors.color2
      ]

      if (!this.hashrateOverTime) {
        return { labels: [], datasets: [] }
      }

      const hashrateOverTimeDataInRange = this.hashrateOverTime[this.range.hashrateOverTime]

      const hashrateOverTimeDatesets = hashrateOverTimeDataInRange.reduce((acc, { time, data: miners }) => {
        miners.forEach((miner, index) => {
          const hashrateData = miner.hashrateInRskNetwork
          const hashratePercentage = miner.hashratePercentageInRskNetwork
          const minerData = {
            label: miner.minerName,
            backgroundColor: chartColors[index],
            borderColor: chroma(chartColors[index]).darken(0.5),
            data: [this.isPercentage ? hashratePercentage : hashrateData],
            fill: true
          }

          const existingMinerData = acc.find(item => item.label === minerData.label)

          if (existingMinerData) {
            existingMinerData.data.push(...minerData.data)
          } else {
            acc.push(minerData)
          }
        })

        return acc
      }, [])

      const hashrateOverTimeLabels =
        hashrateOverTimeDataInRange.map(({ time }) => {
          const format = this.activeTab.name === 'Week' ? 'MMMM D' : 'h:mm a'
          return moment(time).format(format)
        })

      return {
        labels: hashrateOverTimeLabels,
        datasets: hashrateOverTimeDatesets
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
      this.setDataRange({ hashrateOverTime: tab.range })
      this.tabs = this.tabs.map(t => ({ ...t, isActive: tab.name === t.name }))
    },

    toggleUnit () {
      this.isPercentage = !this.isPercentage
    },

    setDataset (e) {
      this.triggerRandomDataset({ dataset: 'hashrateDistributionOverTime', value: Number(e.target.value) })
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
