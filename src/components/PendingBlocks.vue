<template lang="pug">
  .pending-blocks.box
    h4 New blocks
    button(@click='updateBlocks')
      cube-of-cubes.cubes( v-if='pending && mod' :mod='mod' :step='pending' :size='size')
      .w-badge
        .badge(:style='badgeStyle') {{pending}}
    small 
     strong {{pending}} new blocks 
    small 
     em.soft in last {{ (now - firstListBlock.timestamp * 1000) | abbr-time }}
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { abbrTime } from '../filters/TimeFilters'
import CubeOfCubes from './CubeOfCubes.vue'
import ToolTip from './ToolTip.vue'
export default {
  name: 'pending-blocks',
  components: {
    ToolTip,
    CubeOfCubes
  },
  filters: {
    abbrTime
  },
  data () {
    return {
      size: 100
    }
  },
  mounted () {
    let size = this.$el.clientWidth / 10
    size = (size >= 100) ? size : 50
    this.size = size
  },
  computed: {
    ...mapGetters({
      pending: 'pendingBlocks',
      firstListBlock: 'firstListBlock',
      now: 'getDate'
    }),
    mod () {
      let max = (this.pending > 4) ? this.pending : 4
      if (max) return Math.ceil(Math.cbrt(max))
    },
    badgeStyle () {
      let width = (this.pending.toString().length) + 'em'
      let height = width
      return { width, height }
    }
  },
  methods: {
    ...mapActions(['updateBlocks'])
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/vars.styl'
  @import '../lib/styl/mixins.styl'

  .pending-blocks
    justify-content center
    align-items center
    h4
      padding 0
      margin 0
    .cubes
      .fill
        fill orange

      svg
        stroke brand3
        overflow visible

    box()
    padding-bottom 0.5rem

    .chart-title
      margin-bottom 1em

  .miners
    min-width 100%
    display flex
    flex-flow row nowrap
    justify-content space-around

  .miner
    flex 1
    position relative
    display flex
    align-items center
    flex-flow column nowrap

    svg
      overflow visible

      .cube
        fill $color
        stroke $dark

    .name
      font-size 0.8em

    .cubes
      display inline-block

    .blocks
      position absolute
      right 1.5em
      text-align center

      span
        badge(1.6em)
        border $border
        background none
</style>

