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
      let s = this.size
      return `0 0 ${s} ${s}`
    },
    stroke () {
      let percent = this.percent
      let long = this.circumference
      return `${long / 100 * percent}, ${long}`
    },
    strokeWidth () {
      let sw = this.strokeW
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
      let s = this.s
      let d = this.diameter
      let r = this.radius
      let sw = this.strokeWidth
      let p = []
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
      let time = Date.now() - this.startTime
      let duration = this.duration
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
