<template lang="pug">
  .table-field
    template(v-if='value.length > 24')
      tool-tip(:value='value' :trim='trim' :options='ttOpts')
    span(v-else) {{ value || field.default }}
    span(v-if='field.suffix') &nbsp; {{field.suffix}}
</template>
<script>
import common from '../mixins/common'
export default {
  name: 'data-table-field',
  mixins: [common],
  props: ['field', 'value']
}
</script>

