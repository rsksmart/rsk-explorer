<template lang="pug">
  .cols
    .col-a
      last-blocks
    .col-b
      tx-chart
      last-transactions 
</template>
<script>
import LastBlocks from './LastBlocks.vue'
import LastTransactions from './LastTransactions.vue'
import TxChart from './TxChart.vue'
export default {
  name: 'Home',
  components: {
    LastBlocks,
    LastTransactions,
    TxChart
  },
  methods: {

  }

}
</script>
