<template lang="pug">
  .home
    .hero
      .col-a
        .box.row.last-blocks
          .last-block
            block-box(:block='lastBlocks[0]' title='Last Block')
          pending-blocks(v-if='pending')

      .col-b 
        tx-chart(:asize='appSize.w + appSize.h')
    .cols
      .col-a
        last-blocks
      .col-b
        last-transactions 
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import LastBlocks from './LastBlocks.vue'
import LastTransactions from './LastTransactions.vue'
import TxChart from './TxChart.vue'
import BlockBox from './BlockBox.vue'
import PendingBlocks from './PendingBlocks.vue'
export default {
  name: 'Home',
  components: {
    LastBlocks,
    LastTransactions,
    TxChart,
    BlockBox,
    PendingBlocks
  },
  computed: {
    ...mapState({
      lastBlocks: state => state.backend.lastBlocks
    }),
    ...mapGetters({
      pending: 'pendingBlocks',
      appSize: 'getSize'
    })
  },
  methods: {
    ...mapActions(['updateBlocks'])
  }

}
</script>
<style lang="stylus">
  @import '../lib/styl/vars.styl'

  .home
    display flex

  .hero
    margin-top 2rem
  .last-block
    width 70%
    ul.block-data
      margin 0
      padding 0
      flex-flow column nowrap
    .block-number *
      font-size 2em
</style>
