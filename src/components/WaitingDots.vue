<template lang="pug">
  svg.waiting-dots(:width='width' :height='size' :viewBox='viewBox')
    template(v-if='drawDots > 0')
      template(v-for='index,i in drawDots')
        transition(name='dot-trans' appear)
          rect.dot(:x=' (i * size) + space * (i+1)' y='0' :height='size' :width='size' :key='i')
</template>
<script>
export default {
  name: 'waiting-dots',
  props: {
    size: {
      type: Number,
      default: 10
    },
    dots: {
      type: Number,
      default: 3
    },
    dotDuration: {
      type: Number,
      default: 750
    }
  },
  data () {
    return {
      interval: undefined,
      drawDots: 0,
      direction: 1,
      lastTick: 0
    }
  },
  created () {
    this.nextFrame()
  },
  beforeDestroy () {
    cancelAnimationFrame(this.interval)
  },
  computed: {
    space () {
      return this.size / 2
    },
    width () {
      const { size, dots, space } = this
      return size * dots + space * (dots + 1)
    },
    viewBox () {
      const { width, size } = this
      return `0 0 ${width} ${size}`
    }
  },
  methods: {
    nextFrame () {
      this.interval = requestAnimationFrame(this.tick)
    },
    tick () {
      const { lastTick, drawDots } = this
      const time = Date.now()
      const d = 1 + Math.pow(drawDots, 2)
      if (time - (this.dotDuration / d) > lastTick) {
        this.lastTick = time
        this.animate()
      }
      this.nextFrame()
    },
    animate () {
      const { drawDots, dots } = this
      if (drawDots >= dots) {
        this.direction = -1
      }
      if (drawDots === 0) {
        this.direction = 1
      }
      this.drawDots = drawDots + (1 * this.direction)
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/vars.styl'

  .waiting-dots
    .dot
      fill-color $color

    .dot-trans-enter-active, .dot-trans-leave-active
      transition fill-opacity 0.25s
      fill-opacity 1

    .dot-trans-enter, .dot-trans-leave-to
      fill-opacity 0
</style>
