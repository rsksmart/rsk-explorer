<template lang="pug">
  .pending-txs
    h2 Pending transactions
    .tx-pool-chart(v-if='chart')
      chart(:data='chart' :options='chartOptions', title='Pending Txs Log')
        //-chart(:data='chart' :options='blocksChartOptions')
    h3 Tx pool
    template(v-if='!txs')
      .info.txt-center
        span Tx pool is empty
    template(v-else)
      data-table(:type='type' :page='txs')
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import DataTable from './DataTable'
import Chart from './Chart'
import { dayFromTs, timeFromTs } from '../filters/TimeFilters'
export default {
  name: 'tx-pool',
  components: {
    DataTable,
    Chart
  },
  data () {
    return {
      type: 'txPool',
      chartOptions: {
        getY (d) {
          return d.pending
        },
        bars: false,
        curve: {
          type: 'Carnidal',
          gradient: {
            fill: false,
            stroke: true
          }
        },
        curveBack: {
          close: true,
          gradient: {
            fill: true,
            stroke: false
          }
        },
        colorCb: (x, d) => {
          let color = this.blockColor(d.blockNumber)
          return color
        },
        formatLabel: bar => {
          let label = []
          let fill = this.blockColor(bar.d.blockNumber)
          label.push({ style: { fill }, txt: `#${bar.d.blockNumber}` })
          label.push(`pending: ${bar.d.pending}`)
          label.push(`queued: ${bar.d.queued}`)
          label.push(`${dayFromTs(bar.d.timestamp)}`)
          label.push(`${timeFromTs(bar.d.timestamp)}`)
          return label
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
      let data = this.txPool.txs || []
      return (data.length) ? { data } : null
    }
  },
  methods: {
    ...mapGetters({
      getBlockColor: 'getBlockColor2'
    }),

    blockColor (block) {
      let bc = this.getBlockColor()
      return bc(block)
    }
  }
}
</script>
<style lang="stylus">
  .pending-txs
    min-width 100%

    svg
      path
        direction
</style>
