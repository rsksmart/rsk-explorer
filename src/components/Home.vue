<template lang="pug">
  .home
    .hero
      .col-a
        .box.row.last-blocks
          .last-block
            block-box(:block='lastBlocks[0]' title='Last Block')
          pending-blocks(v-if='pending')
          .auto-update
            //-input(type='checkbox' id='auto-update' v-model='aUpdate')
            //-label(for='auto-update') Auto update
            ctrl-switch(label='Auto update' :value='aUpdate' @change='setAupdate')
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
import CtrlSwitch from './CtrlSwitch.vue'
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
  @import '../lib/styl/vars.styl'

  .home
    display flex

  .last-blocks
    flex-flow row wrap

  .auto-update
    display flex
    justify-content center
    width 100%
    

  .hero
    margin-top 2rem

  .last-block
    flex 7
    width 100%

    ul.block-data
      margin 0
      padding 0
      flex-flow column nowrap

    .block-number *
      font-size 2em

  .pending-blocks
    flex 3
</style>
