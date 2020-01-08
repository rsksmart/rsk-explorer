<template lang="pug">
  .tx-chart.chart
    strong.title Transactions density
    .chart-container(v-if='blocks.length' :style='boxStyle')
      d3-bar-chart(:data='chartData' :options='chartOptions' @barClick='barClick')
</template>
<script>
import D3BarChart from 'vue-d3-barchart'
import { mapState } from 'vuex'
import colors from '../config/colors.json'
import { ROUTES } from '../config/types'
import { getTxDensity } from '../filters/NumberFilters'
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
        curveBack: {
          close: true,
          gradient: {
            stroke: false,
            fill: true
          }
        },
        curve: {
          type: 'Cardinal',
          close: false,
          gradient: {
            stroke: true,
            fill: false
          }
        },
        bars: false,
        padding: 0.25,
        colors: [colors.green, colors.green],
        axis: {
          valuesY: true,
          valuesX: true,
          linesY: false,
          linesX: false
        },
        marks: false,
        getY (d) {
          return d.txDensity
        },
        formatLabel (bar) {
          let label = []
          label.push('#' + bar.d.number)
          label.push('txd:' + bar.d.txDensity)
          label.push('txs:' + bar.d.transactions)
          return label
        }
      }
    }
  },
  mounted () {
    let vm = this
    this.$nextTick(() => {
      vm.onResize()
    })
  },
  watch: {
    asize () {
      let vm = this
      this.$nextTick(() => {
        vm.onResize()
      })
    }
  },
  computed: {
    ...mapState({
      blocks: state => state.backend.lastBlocks
    }),

    boxStyle () {
      return { width: this.size.w + 'px' }
    },
    chartOptions () {
      return Object.assign({ size: this.size }, this.options)
    },
    chartData () {
      return this.blocks.map(b => {
        let { _metadata, timestamp, number, transactions } = b
        let { txDensity } = _metadata
        txDensity = getTxDensity(txDensity)
        transactions = transactions.length
        let time = this.blocks[0].timestamp - timestamp
        return { timestamp, txDensity, number, transactions, time }
      })
    }
  },
  methods: {
    onResize () {
      let w = this.$el.parentElement.offsetWidth
      let h = w / 3.5
      this.size = Object.assign({}, { w, h })
    },
    barClick (event) {
      let bar = event.bar || {}
      let blockNumber = (bar.d) ? bar.d.number : null
      if (blockNumber) this.$router.push({ path: `${ROUTES.block}/${blockNumber}` })
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/vars.styl'

  .chart-container
    display flex
    justify-content space-between
    max-width 100%

  .tx-chart
    max-height 100%
    height auto

    .dummy-bar:hover
      cursor pointer

    svg
      overflow visible

    .curve path
      stroke brand2
      stroke-width 1
</style>
