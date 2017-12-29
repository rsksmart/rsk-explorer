<template lang="pug">
  .block.box(v-if='block' :style='blockBoxStyle')

    .block-icon.box-icon
       router-link(:to='"/blocks/" + block.number')
        icon(name='cube' :color='blockColor')
    .box-content
      .block-title(v-if='title')
        h4 {{title}}
      ul.block-data.flex
        li.half
          router-link(:to='"/blocks/" + block.number')
            .block-number(:style='blockStyle' )
              span {{block.number}}
        li.half 
          small by 
            tool-tip(:value='block.miner' :trim='4' :options='{trimAt:"center"}')
        li.half Tx: {{block.transactions.length}}
        li.half.soft 
          icon(name='stopwatch')
          small {{ (now - block.timestamp * 1000) | m-seconds-ago }} ago
</template>
<script>
import { mapGetters } from 'vuex'
import ToolTip from './ToolTip.vue'
import { mSecondsAgo } from '../filters/TimeFilters'
export default {
  name: 'block-box',
  components: {
    ToolTip
  },
  filers: {
    mSecondsAgo
  },
  props: ['block', 'title'],
  computed: {
    ...mapGetters({
      now: 'getDate',
      getBlockColor: 'getBlockColor'
    }),
    blockColor () {
      return this.getBlockColor(this.block.number)
    },
    blockStyle () {
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
  @import '../lib/styl/vars.styl'

  .blocks, .block-data
    ul
      margin 0
      padding 0

      li
        list-style none

  .block
    display flex
    flex-flow row
    border-left solid 3px

    .block-icon
      flex 1

      .svg-icon
        fill color2
        width 2em
        height @width


    .block-number
      color color2
      margin-left 0.25rem
      font-size 1.25em
      font-weight 400
</style>



