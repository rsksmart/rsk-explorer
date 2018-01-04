<template lang="pug">
  span.data-field(:style='cellStyle(field,value)')
    template(v-if='value.length > 24')
      tool-tip(:value='value' :trim='trim' :options='ttOpts')
    span(v-else) {{ filteredValue || field.default }}
    span(v-if='field.suffix') &nbsp; {{field.suffix}}
</template>
<script>
import common from '../mixins/common'
export default {
  name: 'data-field',
  mixins: [common],
  props: ['field', 'value', 'link'],
  computed: {
    filteredValue () {
      return this.filterFieldValue()(this.field, this.value)
    }
  }
}
</script>



