<template lang="pug">
  span.data-field(:style='cellStyle(field,value)')
    template(v-if='value.length > 24')
      tool-tip(:value='value' :trim='trim' :options='ttOpts' :router-link='link')
    template(v-else)
      router-link(v-if='link' :to='link')
        span {{ filteredValue || field.default }}
      span(v-else) {{ filteredValue || field.default }}   
    span(v-if='field.suffix') &nbsp; {{field.suffix}}
</template>
<script>
import common from '../mixins/common'
import dataMixin from '../mixins/dataMixin'
export default {
  name: 'data-field',
  mixins: [common, dataMixin],
  props: ['field', 'row'],
  computed: {
    filteredValue () {
      return this.filterFieldValue()(this.field, this.value)
    },
    value () {
      return this.getValue(this.field, this.row, true)
    },
    link () {
      return this.makeLink(this.field, this.row)
    }
  }
}
</script>



