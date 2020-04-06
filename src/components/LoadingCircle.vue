<template lang="pug">
  svg.loading-circle(:width='size' :height='size' :viewBox='viewBox')
    path.circle(:d='path' :stroke-dasharray='stroke' :stroke-width='strokeWidth')
</template>
<script>
export default {
  name: 'loading-circle',
  props: {
    size: {
      type: Number,
      default: 50
    },
    strokeW: Number,
    duration: {
      type: Number,
      default: 3000
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
    this.nextFrame()
  },
  mounted () {
    this.setStartTime()
  },
  beforeDestroy () {
    cancelAnimationFrame(this.interval)
  },
  computed: {
    s () {
      return this.size - this.strokeWidth
    },
    viewBox () {
      const s = this.size
      return `0 0 ${s} ${s}`
    },
    stroke () {
      const percent = this.percent
      const long = this.circumference
      return `${long / 100 * percent}, ${long}`
    },
    strokeWidth () {
      const sw = this.strokeW
      return sw || this.size / 4
    },
    radius () {
      return this.s / 2
    },
    circumference () {
      return this.s * Math.PI
    },
    diameter () {
      return this.radius * 2
    },
    path () {
      const s = this.s
      const d = this.diameter
      const r = this.radius
      const sw = this.strokeWidth
      const p = []
      p.push(`M ${s / 2 + sw / 2} ${sw / 2}`)
      p.push(`a${r} ${r}  0 0 1 0 ${d}`)
      p.push(`a${r} ${r}  0 0 1 0 -${d}`)
      return p.join(' ')
    }
  },
  methods: {
    setStartTime () {
      this.startTime = Date.now()
    },
    nextFrame () {
      this.interval = requestAnimationFrame(this.animate)
    },
    animate () {
      const time = Date.now() - this.startTime
      const duration = this.duration
      this.percent = parseInt((time * 100) / duration)
      if (this.percent > 99) this.setStartTime()
      this.nextFrame()
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/vars.styl'

  .loading-circle
    overflow hidden
    display flex
    fill none !important
    stroke white
</style>
