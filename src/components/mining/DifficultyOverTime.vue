<template lang="pug">
  .box
    h3.title Difficulty Over Time
    .tabs
      .tabs-titles
        template(v-for="tab in tabs")
          button.btn.tab-title(@click='setActiveTab(tab, $event)'
            :class="{active: activeTab.name === tab.name}")
            span.title {{ tab.name }}
        button.btn.tab-title(v-if="false" @click='toggleUnit')
          span.title {{ isPercentage ? 'Unit' : '%' }}
        select.btn.tab-title.select(@change="setDataset($event)")
          option(v-for="index in maxDataset.difficultyOverTime" :value="index") {{ index }}
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
          display: false
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
      difficultyOverTime: state => state.mining.difficultyOverTime,
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
      if (!this.difficultyOverTime) {
        return { labels: [], datasets: [] }
      }

      const difficultyOverTimeDataInRange = this.difficultyOverTime[this.range.difficultyOverTime]

      const difficultyOverTimeDatesets = difficultyOverTimeDataInRange.map(difficulty => difficulty.data.value)

      const difficultyOverTimeLabels =
        difficultyOverTimeDataInRange.map(({ time }) => {
          const format = this.activeTab.name === 'Week' ? 'MMMM D' : 'h:mm a'
          return moment(time).format(format)
        })

      return {
        labels: difficultyOverTimeLabels,
        datasets: [{
          data: difficultyOverTimeDatesets,
          borderColor: this.colors.cyan,
          pointRadius: 0,
          tension: 0,
          borderWidth: 2
        }]
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
      this.setDataRange({ difficultyOverTime: tab.range })
      this.tabs = this.tabs.map(t => ({ ...t, isActive: tab.name === t.name }))
    },

    toggleUnit () {
      this.isPercentage = !this.isPercentage
    },

    setDataset (e) {
      this.triggerRandomDataset({ dataset: 'difficultyOverTime', value: Number(e.target.value) })
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
