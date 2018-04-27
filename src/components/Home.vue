<template lang="pug">
  .home
    .hero
      .col-a
        .box.row.last-blocks
          .last-block
            block-box(:block='lastBlocks[0]' title='Last Block')
          pending-blocks(v-if='pending')
          .auto-update
            ctrl-switch(label='Auto update' :value='aUpdate' @change='setAupdate')
      .col-b
        .box
          .chart-c
            tx-chart(:asize='appSize.w + appSize.h')
    .cols
      .col-a
        last-blocks
        .center
          router-link.btn.color1(:to='`/${r.blocks}/`')
            span Show all 
      .col-b
        last-transactions
        .center
          router-link.btn.color1(:to='`/${r.transactions}/`')
            span Show all  
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import LastBlocks from './LastBlocks.vue'
import LastTransactions from './LastTransactions.vue'
import TxChart from './TxChart.vue'
import BlockBox from './BlockBox.vue'
import PendingBlocks from './PendingBlocks.vue'
import CtrlSwitch from './CtrlSwitch.vue'
import { ROUTES as r } from '../config/types'
export default {
  name: 'Home',
  components: {
    LastBlocks,
    LastTransactions,
    TxChart,
    BlockBox,
    PendingBlocks,
    CtrlSwitch
  },
  data () {
    return {
      r
    }
  },
  computed: {
    ...mapState({
      lastBlocks: state => state.backend.lastBlocks
    }),
    ...mapGetters({
      pending: 'pendingBlocks',
      appSize: 'getSize',
      autoUpdate: 'autoUpdate'
    }),
    aUpdate: {
      get () {
        return this.autoUpdate
      },
      set (value) {
        this.setAupdate(value)
      }
    }
  },
  methods: {
    ...mapActions([
      'updateBlocks',
      'setAutoUpdate'
    ]),
    setAupdate (value) {
      this.updateBlocks()
      this.setAutoUpdate(value)
    }
  }

}
</script>
<style lang="stylus">
  .home
    max-width 100%

  .chart-c
    margin 0.5em 1em
    max-width 100%
</style>

