<template lang="pug">
  .mining-page
    .cols
      mining-summary
    .cols
      .col-a
        hashrate-distribution(:data='getRangeData("hashrateDistribution")')
      .col-b
        hashrate-over-time(:data='getRangeData("hashrateDistributionOverTime")')
    .cols
      .col-a
        difficulty-over-time(:data='getRangeData("difficultyOverTime")')
      .col-b
        rsk-over-btc-hashrate(:data='getRangeData("rskOverBtcHashrate")')
    last-btc-blocks(:lastBtcBlocks='miningState.lastBtcBlocks')
    last-rsk-blocks(:lastRskBlocks='lastRskBlocks')
</template>

<script>
import { mapGetters, mapState } from 'vuex'

import HashrateDistribution from './HashrateDistribution'
import HashrateOverTime from './HashrateOverTime'
import DifficultyOverTime from './DifficultyOverTime'
import RskOverBtcHashrate from './RskOverBtcHashrate.vue'
import LastBtcBlocks from './LastBtcBlocks'
import LastRskBlocks from './LastRskBlocks'
import MiningSummary from './MiningSummary'

export default {
  components: {
    HashrateDistribution,
    HashrateOverTime,
    DifficultyOverTime,
    RskOverBtcHashrate,
    LastBtcBlocks,
    LastRskBlocks,
    MiningSummary
  },
  computed: {
    ...mapState({
      range: state => state.mining.dataRange,
      miningState: state => state.mining
    }),
    ...mapGetters({
      lastRskBlocks: 'getLastRskBlocks'
    })
  },
  methods: {
    getRangeData (module) {
      return this.miningState[module][this.range[module]]
    }
  }
}
</script>
