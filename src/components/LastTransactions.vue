<template lang="pug">
  .tx-wrapper
    h2.title Transactions
    .transactions(v-for='tx in transactions')
      transaction-box(:tx='tx')
     
</template>
<script>
import { mapGetters } from 'vuex'
import TransactionBox from './TransactionBox.vue'
export default {
  name: 'last-transactions',
  components: {
    TransactionBox
  },
  computed: {
    ...mapGetters([
      'transactions'
    ])
  }
}
</script>
<style lang="stylus">
  .tx-wrapper
    flex 1 1 100%
    display block
</style>

