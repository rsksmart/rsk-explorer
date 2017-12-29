<template lang="pug">
  .tx-wrapper
    h2.title Transactions
    .transactions(v-for='tx in transactions')
      transaction(:tx='tx')
     
</template>
<script>
import { mapGetters } from 'vuex'
import Transaction from './Transaction.vue'
export default {
  name: 'last-transactions',
  components: {
    Transaction
  },
  computed: {
    ...mapGetters({
      transactions: 'blocksTransactions'
    })
  }
}
</script>
<style lang="stylus">
  .tx-wrapper
    flex 1 1 100%
    display block
</style>

