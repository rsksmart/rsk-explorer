<template lang="pug">
  .tx-chart.chart
    strong.title Last blocks transactions
    .chart-container(v-if='blocks.length' :style='boxStyle')
      d3-bar-chart(:data='blocks' :options='chartOptions')
</template>
<script>
import D3BarChart from 'vue-d3-barchart'
import { mapState } from 'vuex'
import colors from '../config/colors.json'
export default {
  name: 'tx-chart',
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
          min: 0,
          max: null
        },
        fontSize: 12,
        margin: 0,
        curve: false,
        bars: true,
        padding: 0.25,
        colors: [colors.green, colors.green],
        axis: {
          valuesY: true,
          valuesX: true,
          linesY: false,
          linesX: false
        },
        marks: false,
        getX (d) {
          return d
        },
        getY (d) {
          return d.transactions.length
        },
        formatLabel (bar) {
          let label = []
          label.push('#' + bar.d.number)
          label.push('txs:' + bar.d.transactions.length)
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
    }
  },
  methods: {
    onResize () {
      let w = this.$el.parentElement.offsetWidth
      let h = w / 3.5
      this.size = Object.assign({}, { w, h })
    }
  }
}
</script>
<style src="vue-d3-barchart/dist/vue-d3-barchart.css"></style>
<style lang="stylus">
  @import '../lib/styl/vars.styl'

  .chart-container
    display flex
    justify-content space-between
    max-width 100%

  .tx-chart
    max-height 100%
    height auto

    svg
      overflow visible

    .curve path
      stroke brand2
      stroke-width 1
</style>

