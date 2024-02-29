<template>
  <div class="pending-txs">
    <h2>Pending transactions</h2>
    <div class="tx-pool-chart">
      <chart v-if="chart.length" :data="chart" :options="options" title="Pending Txs Log"></chart>
      <!-- <chart :data="chart" :options="blocksChartOptions"></chart> -->
    </div>
    <h3>Tx pool</h3>
    <template v-if="!txs">
      <div class="info txt-center">
        <span>Tx pool is empty</span>
      </div>
    </template>
    <template v-else>
      <data-table :type="type" :page="txs"></data-table>
    </template>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import DataTable from './General/DataTable.vue'
import Chart from './Chart'
import { dayFromTs, timeFromTs } from '../filters/TimeFilters'
import chartsDefaults from '../config/chartsDefaults'
export default {
  name: 'tx-pool',
  components: {
    DataTable,
    Chart
  },
  props: ['size'],
  data () {
    return {
      type: 'txPool',
      chartOptions: {
        domain: {
          max: null,
          min: 0
        },
        getY (d) {
          return d.pending
        },
        bars: false,
        axis: {
          linesY: true,
          valuesY: true
        },
        curve: {
          type: 'MonotoneX',
          style: {
            'stroke-width': 2,
            opacity: 0.6
          },
          gradient: {
            fill: false,
            stroke: true
          }
        },
        curveBack: {
          close: true,
          style: {
            opacity: 0.15
          },
          gradient: {
            fill: true,
            stroke: false
          }
        },
        colorCb: (x, d) => {
          const color = this.blockColor(d.blockNumber)
          return color
        },
        formatLabel: bar => {
          const time = bar.d.timestamp
          const fill = this.blockColor(bar.d.blockNumber)
          return [
            ({ style: { fill }, txt: `#${bar.d.blockNumber}` }),
            (`pending: ${bar.d.pending}`),
            (`queued: ${bar.d.queued}`),
            (`${dayFromTs(time)}`),
            (`${timeFromTs(time)}`)
          ]
        },
        marks: {
          type: 'circle',
          size: 5
        }
      },
      blocksChartOptions: {
        getY (d) {
          return 1
        },
        bars: false,
        axis: false,
        marks: {
          type: 'square',
          size: 5
        },
        formatLabel (bar) {
          return [`#${bar.d.blockNumber}`]
        }

      }
    }
  },
  computed: {
    ...mapState({
      txPool: state => state.backend.txPool,
      chart: state => state.backend.txPoolChart
    }),
    txs () {
      const data = this.txPool.txs || []
      return (data.length) ? { data } : null
    },
    options () {
      return Object.assign(chartsDefaults, this.chartOptions)
    }
  },
  methods: {
    ...mapGetters({
      getBlockColor: 'getBlockColor2'
    }),

    blockColor (block) {
      const bc = this.getBlockColor()
      return bc(block)
    },
    handleResize () {
      const chartContainer = this.$el.querySelector('.tx-pool-chart')
      const w = chartContainer.offsetWidth
      const h = 250
      // Realiza acciones basadas en el nuevo ancho aquí
      const opt = Object.assign(chartsDefaults, this.chartOptions)
      const size = { w, h }
      this.chartOptions = { ...opt, size }
    }
  },
  mounted () {
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>
