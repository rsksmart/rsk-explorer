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
          span.title {{ isPercentage ? 'EH/s' : '%' }}
        //- select.btn.tab-title.select(@change="setDataset($event)")
        //-   option(v-for="index in maxDataset.hashrateDistributionOverTime" :value="index") {{ index }}
        //- span.tab-title Dataset
    .chart-container
      line-chart.chart(v-if="chartData.datasets.length !== 0" :styles="styles" :chart-data="chartData" :options="options")
      div(v-else) No data
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import LineChart from './LineChart'
import BlockBox from '../BlockBox'

import { mapHashrateOverTimeToChartData } from '../../lib/js/mining/mapHashrateOverTimeToChartData'

export default {
  components: { LineChart, BlockBox },
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
      isPercentage: false,
      showLegend: false
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
      if (!this.data) return { labels: [], datasets: [] }

      return mapHashrateOverTimeToChartData(this.colors, this.data, this.activeTab, this.isPercentage)
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
      this.setDataRange({ hashrateDistributionOverTime: tab.range })
      this.tabs = this.tabs.map(t => ({ ...t, isActive: tab.name === t.name }))
    },

    toggleUnit () {
      this.isPercentage = !this.isPercentage
    }
  }
}
</script>
