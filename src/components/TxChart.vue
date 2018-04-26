<template lang="pug">
  .tx-chart.chart
    strong.title Last blocks transactions
    .chart-container(v-if='blocks.length' :style='boxStyle')
      d3-bar-chart(:data='blocks',:options='chartOptions')
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
        fontSize: 12,
        margin: 10,
        curve: {
          type: 'Step',
          gradient: {
            fill: false,
            stroke: false
          },
          style: {
            stroke: colors.green
          }
        },
        bars: false,
        axis: {
          valuesY: true,
          valuesX: true,
          linesY: true,
          linesX: true
        },
        marks: {
          type: 'square',
          style: {
            fill: colors.green
          },
          size: 6
        },
        getX (d) {
          return d
        },
        getY (d) {
          return d.txs
        },
        formatLabel (bar) {
          let label = []
          label.push('#' + bar.d.number)
          label.push('tx:' + bar.d.txs)
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

