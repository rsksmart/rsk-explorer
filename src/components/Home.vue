<template>
  <div class="home-view" v-if="lastBlocks.length">
    <stats-content />
    <div class="content-block-chart">
      <last-block :block="lastBlocks[0]" title="Last Block" />
      <tx-density-chart :asize="appSize.w + appSize.h" />
    </div>
    <div class="content-blocks-tx">
      <last-blocks />
      <last-transactions />
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import LastBlocks from '@/components/home/Block/LastBlocks.vue'
import StatsContent from '@/components/home/StatsContent.vue'
import LastBlock from '@/components/home/Block/LastBlock.vue'
import TxDensityChart from '@/components/Charts/TxDensityChart.vue'
import LastTransactions from './Transactions/LastTransactions.vue'
export default {
  name: 'Home',
  components: {
    LastBlocks,
    LastTransactions,
    StatsContent,
    LastBlock,
    TxDensityChart
  },
  computed: {
    ...mapState({
      lastBlocks: state => state.backend.lastBlocks
    }),
    ...mapGetters({
      appSize: 'getSize'
    })
  }
}
</script>
