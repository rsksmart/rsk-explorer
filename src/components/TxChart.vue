<template lang="pug">
  .tx-chart.box.chart
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
        w: 100,
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
          return d.transactions.length
        },
        formatLabel (bar) {
          let label = []
          label.push('#' + bar.d.number)
          label.push('tx:' + bar.d.transactions.length)
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
      let size = { w: this.size.w, h: this.size.h }
      let options = Object.assign({ size }, this.options)
      return options
    }
  },
  methods: {
    onResize () {
      let size = this.size
      size.w = this.$el.clientWidth
      size.h = size.w / 4.5
      this.size = size
    }
  }
}
</script>
<style src="vue-d3-barchart/dist/vue-d3-barchart.css"></style>
<style lang="stylus">
  @import '../lib/styl/vars.styl'

  .chart-container
    display flex
    padding 1em
    justify-content space-between
    width auto

  .tx-chart
    svg
      overflow visible

    .curve path
      stroke brand2
      stroke-width 1
</style>

