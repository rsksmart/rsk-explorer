<template lang="pug">
  svg.progress-bar(:width='width' :height='height')
    rect.bg(x='0' y='0' :height='height' :width='width')
    rect.bar(x='0' y='0' :height='height' :width='barWidth')
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
    },
    progress: {
      type: Number
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
    this.interval = requestAnimationFrame(this.animate)
  },
  beforeDestroy () {
    this.removeInterval()
  },
  computed: {
    barWidth () {
      return this.percent + '%'
    }
  },
  methods: {
    animate () {
      const { progress, duration } = this
      if (!this.startTime) this.startTime = Date.now()
      const time = Date.now() - this.startTime
      this.percent = progress || parseInt((time * 100) / duration)
      if (this.percent < 100) this.interval = requestAnimationFrame(this.animate)
    },
    removeInterval () {
      cancelAnimationFrame(this.interval)
    }
  }
}
</script>
<style lang="stylus">
  @import '../../lib/styl/vars.styl'

  .progress-bar
    margin 0 1em

    rect.bar
      fill color1

    rect.bg
      fill gray
      opacity 0.15
    text
      fill red
</style>
