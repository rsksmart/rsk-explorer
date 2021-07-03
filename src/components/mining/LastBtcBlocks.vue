<template lang="pug">
  .overflow-hidden
    .box
      .data-table
        h3 Last Btc Blocks
        //- Table
        .table-wrapper
          table.dark(v-if='lastBtcBlocks' ref='table')
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
export default {
  name: 'last-btc-blocks',
  props: {
    lastBtcBlocks: {}
  },
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
