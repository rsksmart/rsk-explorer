<template lang="pug">
  .cols
    .col-a
      blocks
    .col-b
      tx-chart
      transactions 
</template>
<script>
import Blocks from './Blocks.vue'
import Transactions from './Transactions.vue'
import TxChart from './TxChart.vue'
export default {
  name: 'Home',
  components: {
    Blocks,
    Transactions,
    TxChart
  },
  methods: {

  }

}
</script>
