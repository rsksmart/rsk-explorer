<template>
  <svg class="progress-bar" :width="width" :height="height">
    <rect class="bg" x="0" y="0" :height="height" :width="width" rx="5" ry="5"></rect>
    <rect x="0" y="0" :height="height" :width="barWidth" rx="5" ry="5" :fill="PAGE_COLORS[$route.name].cl"></rect>
  </svg>
</template>
<script>
import { PAGE_COLORS } from '@/config/pageColors'

export default {
  name: 'progress-bar',
  props: {
    width: {
      type: String,
      default: '50'
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
      startTime: 0,
      PAGE_COLORS
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

    // rect.bar
    //   fill green

    rect.bg
      fill gray
      opacity 0.15
    text
      fill white
</style>
