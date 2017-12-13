<template lang="pug">
  .tx.box
    ul
      li TX:&nbsp;
        tool-tip(:value='tx.hash' :trim='8' :options='{trimAt:"center"}')
      li 
        span From: &nbsp;  
          tool-tip(:value='tx.from' :trim='8' :options='{trimAt:"center"}')
        span &nbsp; to: &nbsp;
          tool-tip(:value='tx.to' :trim='8' :options='{trimAt:"center"}')
      li {{ (now - tx.timestamp * 1000) | m-seconds-ago }} ago
      li 
        router-link(:to='"/transactions/" + tx.blockHash') open
  </template>
<script>
import { mapGetters } from 'vuex'
import ToolTip from './ToolTip.vue'
import { mSecondsAgo } from '../filters/TimeFilters'
export default {
  name: 'Transaction',
  components: {
    ToolTip
  },
  filers: {
    mSecondsAgo
  },
  props: ['tx'],
  computed: {
    ...mapGetters({
      now: 'getDate'
    })
  }

}
</script>
<style lang="stylus">
</style>