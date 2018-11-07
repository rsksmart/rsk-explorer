<template lang="pug">
  .tx-wrapper
    h2.title
      router-link(:to='entity.listLink')
        icon(:name='entity.icon')
        span &nbsp; {{pageTitle}} &nbsp;
      ul.list-head
        li
          router-link(:to='txPoolPath')
            span {{pending}}
        li
          router-link(:to='txPoolPath')
            span /{{queued}}
    .transactions(v-for='tx,index in transactions')
      transaction-box(v-if='index <= 13' :tx='tx')

</template>
<script>
import { mapGetters } from 'vuex'
import TransactionBox from './TransactionBox.vue'
import dataMixin from '../mixins/dataMixin'
import { ROUTES } from '../config/types'
export default {
  name: 'last-transactions',
  components: {
    TransactionBox
  },
  mixins: [
    dataMixin
  ],
  data () {
    return {
      type: 'transactions'
    }
  },
  computed: {
    ...mapGetters({
      transactions: 'transactions',
      pending: 'getTxPoolPending',
      queued: 'getTxPoolQueued'
    }),
    txPoolPath () {
      return ROUTES.txPool
    }
  }
}
</script>
<style lang="stylus">
  .tx-wrapper
    flex 1 1 100%
    display block
</style>
