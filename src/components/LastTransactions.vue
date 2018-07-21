<template lang="pug">
  .tx-wrapper
    h2.title
      router-link(:to='entity.listLink')
        icon(:name='entity.icon')
        span &nbsp; {{pageTitle}}
    .transactions(v-for='tx,index in transactions')
      transaction-box(v-if='index <= 13' :tx='tx')

</template>
<script>
import { mapGetters } from 'vuex'
import TransactionBox from './TransactionBox.vue'
import dataMixin from '../mixins/dataMixin'
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
