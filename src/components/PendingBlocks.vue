<template lang="pug">
  .pending-blocks.box
    button(@click='updateBlocks')
      cube-of-cubes.cubes( v-if='step && mod' :mod='mod' :step='step' :size='size' :cubeStyleCb='cubeStyle')
      .w-badge
        .badge(:style='badgeStyle') {{ pending }}
    small
     strong {{ pending }} new blocks
    small
     //-em.soft in last {{ (now - firstListBlock.timestamp * 1000) | abbr-time }}
     em.soft in last  {{ now - lastBlocksTime | abbr-time }}
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
      lastBlocksTime: 'lastBlocksTime',
      now: 'getDate'
    }),
    mod () {
      const max = (this.pending > 4) ? this.pending : 4
      return (max) ? Math.ceil(Math.cbrt(max)) : 0
    },
    step () {
      let step = this.pending
      if (step > 5000) step = 5000
      return step
    },
    badgeStyle () {
      const width = (this.pending.toString().length) + 'em'
      const height = width
      return { width, height }
    }
  },
  methods: {
    ...mapActions(['updateBlocks']),
    ...mapGetters(['getBlockColor']),

    cubeStyle (cube) {
      const fill = this.getBlockColor()(cube)
      return { fill }
    }
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
