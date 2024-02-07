<template>
  <div class="tx-density-chart bg-secondary">
    <div class="text-white-100 title">Transactions density</div>
    <div class="chart-container" v-if="blocks.length">
      <d3-bar-chart :data="chartData" :options="chartOptions" @barClick="barClick"></d3-bar-chart>
    </div>
  </div>
</template>
<script>
import D3BarChart from 'vue-d3-barchart'
import { mapState } from 'vuex'
import { ROUTES } from '@/config/types'
import { getTxDensity } from '@/filters/NumberFilters'
export default {
  name: 'tx-density-chart',
  props: ['asize'],
  components: {
    D3BarChart
  },
  data () {
    return {
      size: {
        w: 300,
        h: 100
      },
      options: {
        domain: {
          min: 0
        },
        fontSize: 12,
        margin: 0,
        curve: {
          type: 'Cardinal',
          stroke: '#D2134B',
          style: {
            stroke: '#FF9100',
            'stroke-width': 2,
            size: 5
          }
        },
        curveBack: {
          close: true,
          style: {
            stroke: 'none',
            opacity: 0.5
          },
          gradient: {
            stroke: false,
            fill: false
          }
        },
        bars: false,
        padding: 0.25,
        colors: ['#FF9100'],
        line: true,
        axis: {
          valuesY: true,
          linesY: true,
          linesX: true,
          valuesX: true
        },
        marks: {
          type: 'circle',
          size: 6
        },
        getY (d) {
          return Math.round((d.txDensity) * 100) / 100
        },
        formatLabel (bar) {
          const label = []
          label.push('#' + bar.d.number)
          label.push('txd:' + bar.d.txDensity)
          label.push('txs:' + bar.d.transactions)
          return label
        }
      }
    }
  },
  mounted () {
    const vm = this
    this.$nextTick(() => {
      vm.onResize()
    })
  },
  watch: {
    asize () {
      const vm = this
      this.$nextTick(() => {
        vm.onResize()
      })
    }
  },
  computed: {
    ...mapState({
      blocks: state => state.backend.lastBlocks
    }),
    chartOptions () {
      return Object.assign({ size: this.size }, this.options)
    },
    chartData () {
      return this.blocks.map(b => {
        let { _metadata, timestamp, number, transactions } = b
        let { txDensity } = _metadata
        txDensity = getTxDensity(txDensity)
        transactions = transactions.length
        const time = this.blocks[0].timestamp - timestamp
        return { timestamp, txDensity, number, transactions, time }
      })
    }
  },
  methods: {
    onResize () {
      const chartContainer = this.$el.querySelector('.chart-container')
      const w = chartContainer.offsetWidth
      const h = Math.max(chartContainer.offsetHeight, 130)
      this.size = { w, h }
    },
    barClick (event) {
      const bar = event.bar || {}
      const blockNumber = (bar.d) ? bar.d.number : null
      if (blockNumber) this.$router.push({ path: `${ROUTES.block}/${blockNumber}` })
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  }
}
</script>
