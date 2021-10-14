<template lang="pug">
  .box.w-full
    .summary(v-if="data")
      h3.summary-title Mining Summary
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
              tool-tip(value="7-day moving average" :options="tipOptions")
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
              p(style="fontSize: 1.5em") {{miningSummary.rskOverBtcHashrate}}
</template>
<script>
import dataMixin from '../../mixins/dataMixin'
import DataField from '../DataField'
import FieldTitle from '../FieldTitle'
import BoxField from '../BoxField'
import ToolTip from '../ToolTip'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'data-table',
  components: {
    DataField,
    FieldTitle,
    BoxField,
    ToolTip
  },
  mixins: [
    dataMixin
  ],
  data () {
    return {
      type: 'miningSummary',
      tipOptions: {
        forceTip: true
      }
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
