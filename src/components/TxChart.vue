<template lang="pug">
  .tx-chart.box
    h3 last blocks transactions
    .chart-container(v-if='blocks.length' :style='boxStyle')
      d3-bar-chart(:data='blocks',:options='chartOptions')
</template>
<script>
import D3BarChart from 'vue-d3-barchart'
import { mapState } from 'vuex'
import colors from '../config/colors.json'
export default {
  name: 'tx-chart',
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
        axis: true,
        curve: {
          type: 'Linear',
          gradient: {
            fill: false,
            stroke: false
          }
        },
        bars: false,
        marks: {
          type: 'square',
          style: {
            fill: colors.color1
          },
          size: 7
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
    console.log(colors.red)
    this.$nextTick(() => {
      vm.onResize()
    })
  },
  computed: {
    ...mapState({
      blocks: state => state.backend.lastBlocks
    }),
    boxStyle () {
      let style = {}
      style.width = this.size.w + 'px'
      return style
    },
    chartOptions () {
      let size = { w: this.size.w, h: this.size.h }
      let options = Object.assign({ size }, this.options)
      return options
    }
  },
  methods: {
    onResize () {
      this.size.w = this.$el.clientWidth
      this.size.h = this.size.w / 4.5
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
    width auto

  .tx-chart
    svg
      overflow visible

    .curve path
      stroke color2
      stroke-width 2
</style>

