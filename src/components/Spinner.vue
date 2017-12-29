<template lang="pug">
  .spinner(v-show='show')
    cube-of-cubes.cubes(:mod='mod' :step='step' size='50' )
</template>
<script>
import CubeOfCubes from './CubeOfCubes.vue'
export default {
  name: 'spinner',
  components: {
    CubeOfCubes
  },
  data () {
    return {
      step: 5,
      mod: 3,
      dir: 1,
      limit: 0,
      show: false,
      interval: null,
      startTime: 0
    }
  },
  created () {
    let mod = this.mod
    this.limit = mod * mod * mod
    let vm = this
    this.interval = setInterval(vm.animate, mod * 30)
  },
  mounted () {
    this.startTime = Date.now()
  },
  beforeDestroy () {
    clearInterval(this.interval)
  },
  methods: {
    animate () {
      let date = Date.now()
      this.show = (date - this.startTime >= 500)
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
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/vars.styl'

  .spinner
    display flex
    justify-content center

    .cubes
      .fill
        fill none
        stroke gray

      svg
        stroke color3
        overflow visible
</style>

