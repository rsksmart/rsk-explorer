<template lang="pug">
  .container-fluid
    .cols
      mining-summary
    .cols
      .col-a
        hashrate-distribution
      .col-b
        hashrate-over-time
    .cols
      .col-a
        difficulty-over-time
      .col-b
        btc-over-rsk
    .cols
      last-btc-blocks
    .cols
    last-rsk-blocks
</template>

<script>
import HashrateDistribution from './HashrateDistribution'
import HashrateOverTime from './HashrateOverTime'
import DifficultyOverTime from './DifficultyOverTime'
import BtcOverRsk from './BtcOverRsk'
import LastBtcBlocks from './LastBtcBlocks'
import LastRskBlocks from './LastRskBlocks'
import MiningSummary from './MiningSummary'

export default {
  components: {
    HashrateDistribution,
    HashrateOverTime,
    DifficultyOverTime,
    BtcOverRsk,
    LastBtcBlocks,
    LastRskBlocks,
    MiningSummary
  }
}
</script>

<style lang="stylus">
  .container-fluid
    width 100%
</style>
