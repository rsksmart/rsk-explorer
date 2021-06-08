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
import { mapActions, mapGetters, mapState } from 'vuex'
import 'chartjs-plugin-datalabels'

import DoughnutChart from './DoughnutChart'
import BlockBox from '../BlockBox'

export default {
  components: { DoughnutChart, BlockBox },
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

    ...mapState({
      hashrateDistribution: state => state.mining.hashrateDistribution,
      range: state => state.mining.dataRange
    }),

    styles () {
      return {
        height: '300px',
        position: 'relative'
      }
    },

    chartData: function () {
      const chartColors = [
        this.colors.orange,
        this.colors.red,
        this.colors.green,
        this.colors.violet,
        this.colors.blue,
        this.colors.gray,
        this.colors.brand1,
        this.colors.brand2,
        this.colors.brand3,
        this.colors.color1,
        this.colors.color2
      ]

      if (!this.hashrateDistribution) {
        return {
          labels: [],
          datasets: []
        }
      }

      const hashrateDistributionDataInRange = { ...this.hashrateDistribution }[this.range.hashrateDistribution]
        .reduce((acc, dist) => {
          const minerName = dist.minerName.match(/0x*/) ? 'Unknown' : dist.minerName
          if (Number(dist.hashratePercentageInRskNetwork) < 5) {
            if (acc.others) {
              acc.others.percentage = acc.others.percentage + dist.hashratePercentageInRskNetwork
              acc.others.value = acc.others.value + dist.hashrateInRskNetwork
            } else {
              acc.others = {
                percentage: dist.hashratePercentageInRskNetwork,
                value: dist.hashrateInRskNetwork
              }
            }
          } else {
            acc[minerName] = {
              value: dist.hashrateInRskNetwork,
              percentage: dist.hashratePercentageInRskNetwork
            }
          }
          return acc
        }, {})

      const hashrateDistributionValues =
        Object.values(hashrateDistributionDataInRange).sort((a, b) => b.value - a.value).map(value => {
          return this.isPercentage ? value.percentage : value.value
        })

      return {
        labels: Object.keys(hashrateDistributionDataInRange),
        datasets: [
          {
            data: hashrateDistributionValues,
            backgroundColor: chartColors,
            borderColor: this.colors.darkness
          }
        ]
      }
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

<style lang="stylus">
.chart-container
  position relative
  width 100%
  display flex
  justify-content center
  align-items center
  min-height 300px

.chart
  width 100%
</style>
