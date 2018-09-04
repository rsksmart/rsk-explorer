<template lang="pug">
  svg.progress-bar(:width='width' :height='height')
    rect(x='0' y='0' :height='height' :width='barWidth')
</template>
<script>
export default {
  name: 'progress-bar',
  props: {
    width: {
      type: Number,
      default: 50
    },
    height: {
      type: Number,
      default: 10
    },
    duration: {
      type: Number,
      default: 5000
    }
  },
  data () {
    return {
      interval: null,
      percent: 0,
      startTime: 0
    }
  },
  created () {
    let vm = this
    this.interval = setInterval(vm.animate, 500)
  },
  mounted () {
    this.setStartTime()
  },
  beforeDestroy () {
    clearInterval(this.interval)
  },
  computed: {
    barWidth () {
      return this.percent + '%'
    }
  },
  methods: {
    setStartTime () {
      this.startTime = Date.now()
    },
    animate () {
      let time = Date.now() - this.startTime
      let duration = this.duration
      this.percent = parseInt((time * 100) / duration)
      if (this.percent > 99) this.setStartTime()
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/vars.styl'

  .progress-bar
    margin-left 1em
    rect
      fill green
</style>
