<template lang="pug">
  .box
    h3.title RSK vs BTC Hashrate Over Time
    .tabs
      .tabs-titles
        template(v-for="tab in tabs")
          button.btn.tab-title(@click='setActiveTab(tab, $event)'
            :class="{active: activeTab.name === tab.name}")
            span.title {{ tab.name }}
    .chart-container
      line-chart.chart(v-if="chartData && chartData.datasets.length !== 0" :styles="styles" :chart-data="chartData" :options="options")
      div(v-else) No data
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import LineChart from './LineChart'
import BlockBox from '../BlockBox'

import { mapRskOverBtcToChartData } from '../../lib/js/mining/mapRskOverBtcToChartData'

export default {
  components: { LineChart, BlockBox },
  props: {
    data: {}
  },
  data () {
    return {
      tabs: [
        {
          name: 'Day',
          range: 'oneDay',
          isActive: true
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

    styles () {
      return {
        height: '300px',
        position: 'relative'
      }
    },

    chartData: function () {
      if (!this.data) return { labels: [], datasets: [] }

      return mapRskOverBtcToChartData(this.colors, this.data, this.activeTab)
    },

    percentage: function () {
      return this.isPercentage
    },

    activeTab: function () {
      return this.tabs.find(tab => tab.isActive)
    }
  },
  methods: {
    ...mapActions(['setDataRange']),
    setActiveTab (tab, e) {
      this.setDataRange({ rskOverBtcHashrate: tab.range })
      this.tabs = this.tabs.map(t => ({ ...t, isActive: tab && tab.name === t.name }))
    },

    toggleUnit () {
      this.isPercentage = !this.isPercentage
    }
  }
}
</script>
