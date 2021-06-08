<template lang="pug">
  .overflow-auto
    .box
      .data-table.overflow-auto
        h3 Last Btc Blocks
        //- Table
        table.dark(v-if='data' ref='table')
          thead
            tr
              template(v-for='field,fieldName,index in fields')
                th.unsortable
                  field-title(:field='field')
          tbody
            tr(v-for='row, rowIndex in lastBtcBlocks' :class='rowClass(rowIndex)')
              template(v-for='field,fieldName,index in fields')
                td(:style="{ backgroundColor: row.status === 'NotInNetwork' ? 'rgba(255, 255, 0, 0.1)' : 'inherit' }")
                  data-field(:field='field' :row='row')
</template>
<script>
import dataMixin from '../../mixins/dataMixin'
import DataField from '../DataField'
import FieldTitle from '../FieldTitle'
import { mapState } from 'vuex'
export default {
  name: 'data-table',
  components: {
    DataField,
    FieldTitle
  },
  mixins: [
    dataMixin
  ],
  data () {
    return {
      type: 'lastBtcBlocks'
    }
  },
  mounted () { },
  computed: {
    ...mapState({
      size: state => state.size,
      lastBtcBlocks: state => state.mining.lastBtcBlocks
    }),
    data () {
      return []
    }
  },
  methods: {
    tdClass (name) {
      const css = [`field__${name}`]
      if (this.key === name) css.push('row-header')
      return css
    }
  }
}
</script>

<style lang="stylus">
  .overflow-auto
    overflow auto
    width 100%
</style>
