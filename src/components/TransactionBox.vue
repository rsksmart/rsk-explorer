<template>
  <div class="tx-container box row" :style="txBoxStyle">
    <div class="box-icons">
      <router-link :to="txLink">
        <icon :name="entity.icon" :color="blockColor"></icon>
      </router-link>
    </div>
    <div class="box-content">
      <ul class="plain flex">
        <li class="half" :style="blockStyle2">
          <data-field :field="fields.hash" :row="tx"></data-field>
        </li>
        <li class="half">
          <router-link :to="blockLink">
            <icon :name="bField.icon" :color="blockColor"></icon>
            <small :style="blockStyle2">&nbsp; {{ blockNumber }}</small>
          </router-link>
        </li>
        <li class="half from-to" v-if="tx.txType == 'normal'">
          <data-field class="small from" :field="fields.from" :row="tx"></data-field>
          <icon class="from-to-arrow" name="arrow-right" :color="blockColor"></icon>
          <data-field class="small to" :field="fields.to" :row="tx"></data-field>
        </li>
        <li class="half" v-else>
          <span>{{ tx.txType }}</span>
        </li>
        <li class="half soft">
          <field-title class="small" :field="fields.time"></field-title>
          <data-field :field="fields.time" :row="tx"></data-field>
        </li>
        <li class="half" v-if="tx.txType == 'normal'">
          <data-field :field="fields.value" :row="tx"></data-field>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { mSecondsAgo } from '../filters/TimeFilters'
import dataMixin from '../mixins/dataMixin'
import DataField from './DataField'
import FieldTitle from './FieldTitle'
export default {
  name: 'transaction-box',
  components: {
    DataField,
    FieldTitle
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
      type: 'transactionsBox'
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
      const color = this.blockColor
      return { color }
    },
    txBoxStyle () {
      const color = this.blockColor
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
      const field = this.bField
      const value = this.tx.blockNumber
      return this.filterFieldValue()({ field, value })
    }
  }
}
</script>
<style lang="stylus">
  .transaction
    font-size 0.8em
    border-left solid 1px

    ul
      li
        margin 0 0 0.125em 0

  .from-to-arrow
    margin 0 0.25em

  .from-to
    display flex
    flex-flow row nowrap
    justify-content space-between

    .from, .to
      max-width 50% !important
      flex 1
</style>
