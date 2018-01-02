<template lang="pug">
  .transaction.box.row(:style='txBoxStyle')
    .box-icon
      router-link(:to='"/transactions/" + tx.hash')
        icon(name='credit-card' :color='blockColor')
    .box-content
      ul.plain.flex
        li.half(:style='blockStyle')
          strong Tx:&nbsp;
            tool-tip(:value='tx.hash' :trim='8' :options='{trimAt:"center"}')
        li.half
            router-link(:to='"/blocks/" + tx.blockNumber')
              icon(name='cube' :color='blockColor')
              small(:style='blockStyle') &nbsp; {{tx.blockNumber}}
        li.half
            tool-tip.from(:value='tx.from' :trim='8' :options='{trimAt:"center"}')
            icon(name='arrow-right' :color='blockColor')
            tool-tip.to(:value='tx.to' :trim='8' :options='{trimAt:"center"}')
        li.half.soft {{ (now - tx.timestamp * 1000) | m-seconds-ago }} ago
</template>
<script>
import { mapGetters } from 'vuex'
import ToolTip from './ToolTip.vue'
import { mSecondsAgo } from '../filters/TimeFilters'
export default {
  name: 'transaction-box',
  components: {
    ToolTip
  },
  filers: {
    mSecondsAgo
  },
  props: ['tx'],
  computed: {
    ...mapGetters({
      now: 'getDate',
      colors: 'getColors',
      getBlockColor: 'getBlockColor'
    }),
    blockColor () {
      return this.getBlockColor(this.tx.blockNumber)
    },
    blockStyle () {
      let color = this.blockColor
      return { color }
    },
    txBoxStyle () {
      let color = this.blockColor
      return { 'border-color': color }
    }
  }

}
</script>
<style lang="stylus">
  .transaction
    font-size 0.8em
    border-left solid 1px
</style>