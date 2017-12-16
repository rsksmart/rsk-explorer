<template lang="pug">
  .spinner
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
      limit: 0
    }
  },
  created () {
    let mod = this.mod
    this.limit = mod * mod * mod
    let vm = this
    setInterval(vm.animate, mod * 30)
  },

  methods: {
    animate () {
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

