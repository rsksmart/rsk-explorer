<template lang="pug">
  .transaction.box.row(:style='txBoxStyle')
    .box-icons
      router-link(:to='txLink')
        icon(:name='entity.icon' :color='blockColor')
    .box-content
      ul.plain.flex
        li.half(:style='blockStyle2')
          strong Tx:&nbsp;
            tool-tip(:value='tx.hash' :trim='8' :options='{trimAt:"center"}' :router-link='txLink')
        li.half
            router-link(:to='blockLink')
              icon(:name='bField.icon' :color='blockColor')
              small(:style='blockStyle2') &nbsp; {{blockNumber}}
        li.half(v-if='tx.txType == "normal"')
            tool-tip.from(v-if='tx.from' :value='tx.from' :trim='8' :options='{trimAt:"center"}')
            icon(name='arrow-right' :color='blockColor')
            tool-tip.to(v-if='tx.to' :value='tx.to' :trim='8' :options='{trimAt:"center"}')
        li.half(v-else)
          span {{tx.txType}}
        li.half.soft {{ (now - tx.timestamp * 1000) | m-seconds-ago }} ago
</template>
<script>
import { mapGetters } from 'vuex'
import ToolTip from './ToolTip.vue'
import { mSecondsAgo } from '../filters/TimeFilters'
import dataMixin from '../mixins/dataMixin'
export default {
  name: 'transaction-box',
  components: {
    ToolTip
  },
  mixins: [
    dataMixin
  ],
  filers: {
    mSecondsAgo
  },
  props: ['tx'],
  data () {
    return {
      type: 'transaction'
    }
  },
  computed: {
    ...mapGetters({
      now: 'getDate'
    }),
    blockColor () {
      return this.getBlockColor(this.tx.blockNumber)
    },
    blockStyle2 () {
      let color = this.blockColor
      return { color }
    },
    txBoxStyle () {
      let color = this.blockColor
      return { 'border-color': color }
    },
    bField () {
      return this.fields.block
    },
    txLink () {
      return this.makeLink(this.fields.hash, this.tx)
    },
    blockLink () {
      return this.makeLink(this.bField, this.tx)
    },
    blockNumber () {
      return this.filterFieldValue()(this.bField, this.tx.blockNumber)
    }
  }

}
</script>
<style lang="stylus">
  .transaction
    font-size 0.8em
    border-left solid 1px
</style>