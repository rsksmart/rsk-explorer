<template lang="pug">
  transition(name='blockbox')
    .block-box
      .block.box(v-if='block' :style='blockBoxStyle')
        .block-icon.box-icon
          router-link(:to='"/blocks/" + block.number')
            icon(name='cube' :color='blockColor')
        .box-content
          .block-title(v-if='title')
            h4.title {{title}}
          ul.block-data.flex
            li.half
              router-link(:to='"/blocks/" + block.number')
                .block-number(:style='bStyle' )
                  span {{block.number | locale}}
            li.half 
              small by 
                tool-tip(:value='block.miner' :trim='4' :options='{trimAt:"center"}')
            li.half.soft(:style='bStyle')
              icon(name='transaction' :style='bStyle')
              strong &nbsp;{{block.txs}}
            li.half.soft 
              icon(name='stopwatch')
              small {{ (now - block.timestamp * 1000) | m-seconds-ago }} ago
</template>
<script>
import ToolTip from './ToolTip.vue'
import common from '../mixins/common'
import { mSecondsAgo } from '../filters/TimeFilters'
export default {
  name: 'block-box',
  mixins: [common],
  components: {
    ToolTip
  },
  filers: {
    mSecondsAgo
  },
  props: ['block', 'title'],
  computed: {
    blockColor () {
      return this.getBlockColor(this.block.number)
    },
    bStyle () {
      let color = this.blockColor
      return { color, fill: color }
    },
    blockBoxStyle () {
      let color = this.blockColor
      return { 'border-color': color }
    }
  }
}
</script>
<style lang="stylus">
  .block-box
    display block
    will-change opacity
    .title
      padding 0
      margin 0

  .blockbox-enter-active
    transition opacity 0.5s
    opacity 1

  .blockbox-enter, .block-box-leave-to
    opacity 0
</style>




