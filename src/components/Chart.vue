<template lang="pug">

  .chart(v-if='data')
    strong.title(v-if='title') {{title}}
    .chart-container(v-if='data.length' :style='boxStyle')
      d3-bar-chart(:data='data' :options='chartOptions')

</template>
<script>
import D3BarChart from 'vue-d3-barchart'
import { mapGetters } from 'vuex'
import chartsDefaults from '../config/chartsDefaults'
export default {
  name: 'chart',
  components: {
    D3BarChart
  },
  props: ['data', 'options', 'title', 'heightRatio'],
  data () {
    return {
      size: {
        w: 300,
        h: 100
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
    ...mapGetters({
      appSize: 'getSize'
    }),
    opts () {
      return this.options || chartsDefaults
    },
    asize () {
      return this.appSize.w + this.appSize.h
    },
    boxStyle () {
      return { width: this.size.w + 'px' }
    },
    chartOptions () {
      return Object.assign({ size: this.size }, this.opts)
    },
    hRatio () {
      const hr = this.heightRatio
      return (undefined !== hr) ? hr : 3.5
    }
  },
  methods: {
    onResize () {
      const w = this.$el.parentElement.offsetWidth
      const h = w / this.hRatio
      this.size = Object.assign({}, { w, h })
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

  svg
    overflow visible

  .curve path
    stroke brand2
    stroke-width 1

  .curve-back
    path
      opacity 0.2
      stroke none
</style>
