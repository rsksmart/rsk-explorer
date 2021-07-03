<template lang="pug">
  .box
    h3.title Hashrate Distribution
    .tabs
      .tabs-titles
        template(v-for="tab in tabs")
          button.btn.tab-title(@click='setActiveTab(tab, $event)'
            :class="{active: activeTab.name === tab.name}")
            span.title {{ tab.name }}
        button.btn.tab-title(@click='toggleUnit')
          span.title {{ isPercentage ? 'Unit' : '%' }}
    .chart-container
      doughnut-chart.chart(v-if="chartData.datasets[0] && chartData.datasets[0].data.length !== 0" :chart-data="chartData" :styles="styles" :options="options")
      div(v-else) No data
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import 'chartjs-plugin-datalabels'

import DoughnutChart from './DoughnutChart'
import BlockBox from '../BlockBox'

import { mapHashrateDistributionToChartData } from '../../lib/js/mining/mapHashrateDistributionToChartData'

export default {
  components: { DoughnutChart, BlockBox },
  props: {
    data: {}
  },
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
        responseive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            display: false
          }]
        },
        legend: {
          position: 'right',
          labels: {
            fontFamily: 'Titillium Web',
            boxWidth: 14,
            fontColor: '#9fdfd1'
          }
        },
        tooltips: {
          mode: 'point',
          bodyFontFamily: 'Titillium Web'
        },
        layout: {
          padding: {
            top: 20
          }
        },
        plugins: {
          datalabels: {
            formatter: (data) => this.isPercentage ? data.toFixed(2) + '%' : data.toFixed(2) + ' Ehs',
            color: 'white',
            font: { size: 14, weight: 'bold', family: 'Titillium Web' }
          }
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

      return mapHashrateDistributionToChartData(this.colors, this.data, this.isPercentage)
    },

    activeTab: function () {
      return this.tabs.find(tab => tab.isActive)
    }
  },
  methods: {
    ...mapActions(['setDataRange']),
    setActiveTab (tab, e) {
      this.setDataRange({ hashrateDistribution: tab.range })
      this.tabs = this.tabs.map(t => ({ ...t, isActive: tab.name === t.name }))
    },

    toggleUnit () {
      this.isPercentage = !this.isPercentage
    }
  }
}
</script>
