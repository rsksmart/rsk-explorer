<template lang="pug">
  .block.box(v-if='block')
    .block-icon
       icon(name='block')
    .block-number 
      span &#35;{{block.number}}
    ul.block-data
      li by 
        tool-tip(:value='block.miner' :trim='4' :options='{trimAt:"center"}')
      li Tx: {{block.transactions.length}}
      li {{ (now - block.timestamp * 1000) | m-seconds-ago }} ago
      li
        router-link(:to='"/blocks/" + block.number') open
  </template>
<script>
import { mapGetters } from 'vuex'
import ToolTip from './ToolTip.vue'
import { mSecondsAgo } from '../filters/TimeFilters'
export default {
  name: 'Block',
  components: {
    ToolTip
  },
  filers: {
    mSecondsAgo
  },
  props: ['block'],
  computed: {
    ...mapGetters({
      now: 'getDate'
    })
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

    .block-icon
      flex 1
      .svg-icon
        fill color2
        width 2em
        height @width

    .block-data
      flex 10
      display flex
      margin-left 1rem
      flex-flow column wrap

    .block-number
      color color2
      margin-left .25rem
      font-size 1.5em
</style>


