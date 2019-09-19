<template lang="pug">
  .spinner(v-show='show')
    cube-of-cubes.cubes(:mod='mod' :step='step' size='50' )
</template>
<script>
import CubeOfCubes from './CubeOfCubes.vue'
export default {
  name: 'spinner',
  props: {
    mod: {
      type: Number,
      default: 3
    },
    delay: {
      type: Number,
      default: 500
    },
    speed: {
      type: Number,
      default: 30
    }
  },
  components: {
    CubeOfCubes
  },
  data () {
    return {
      step: 5,
      dir: 1,
      limit: 0,
      show: false,
      interval: null,
      frameDuration: 0,
      startTime: 0,
      prevFrame: undefined
    }
  },
  created () {
    let { mod, speed } = this
    this.limit = mod * mod * mod
    this.frameDuration = mod * speed
    this.prevFrame = Date.now()
    this.nextFrame()
  },
  mounted () {
    this.startTime = Date.now()
  },
  beforeDestroy () {
    cancelAnimationFrame(this.interval)
  },
  methods: {
    nextFrame () {
      this.interval = requestAnimationFrame(this.animate)
    },
    animate () {
      let date = Date.now()
      let { prevFrame, frameDuration } = this
      let elapsed = date - prevFrame
      if (elapsed < frameDuration) return this.nextFrame()
      this.show = (date - this.startTime >= this.delay)
      let step = this.step
      if (step < this.limit) {
        step += this.dir
      } else {
        this.dir = -this.dir
        step--
      }
      if (!step) {
        this.dir = 1
        step++
      }
      this.step = step
      this.prevFrame = date
      this.nextFrame()
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/vars.styl'

  .spinner
    min-height 100vh
    min-width 100%
    display flex
    justify-content center
    align-items center

    .cubes
      .fill
        fill $color
        stroke gray

      svg
        stroke brand3
        overflow visible
</style>
