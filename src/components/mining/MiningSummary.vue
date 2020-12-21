<template lang="pug">
  .box.w-full
    .summary(v-if="data")
      h3.summary-title MiningSummary
      .summary-wrapper
        .box
          .summary-box
            icon(name="block")
            .summary_content
              h3.summary-header Best Blocks
              .summary-field
                icon(name="btc")
                data-field(:field="fields.bestBtcBlock" :row="miningSummary")
              .summary-field
                icon(name="rsk")
                data-field(:field="fields.bestRskBlock" :row="miningSummary")
        .box
          .summary-box
            icon(name="flame")
            .summary-content
              h3.summary-header Hashrates
              .summary-field
                icon(name="btc")
                div {{miningSummary.btcHashrate}}
              .summary-field
                icon(name="rsk")
                div {{miningSummary.rskHashrate}}
        .box
          .summary-box
            icon(name="flame")
            .summary-content
              h3.summary-header Rsk Over Btc Hashrate
              p {{miningSummary.btcHashrate}}
</template>
<script>
import dataMixin from '../../mixins/dataMixin'
import DataField from '../DataField'
import FieldTitle from '../FieldTitle'
import BoxField from '../BoxField'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'data-table',
  components: {
    DataField,
    FieldTitle,
    BoxField
  },
  mixins: [
    dataMixin
  ],
  data () {
    return {
      type: 'miningSummary'
    }
  },
  mounted () {},
  computed: {
    ...mapState({
      size: state => state.size
    }),
    ...mapGetters({
      miningSummary: 'getMiningSummary'
    }),
    data () {
      return []
    }
  }
}
</script>

<style lang="stylus">
  .box.w-full
    width 100%

  .summary
    width 100%

    &-box
      display flex

      & > .svg-icon
        font-size 3rem
        margin-right 1rem

    &-title
      margin 0
      padding 0.75em 1em

    &-header
      margin-top 0.5rem

    &-header,
    &-field
      display flex
      align-items center
      margin-bottom 0.5rem

      &.center
        text-align center

      .svg-icon
        margin-right 1rem

    &-wrapper
      display grid
      grid-template-columns repeat(auto-fit, minmax(300px, 1fr))
</style>
