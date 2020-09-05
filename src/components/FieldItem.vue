<template lang="pug">
  .item(:class='css')
    field-title(:field='parsedField')
    data-field(
      :field='parsedField'
      :row='data'
      :style='cellStyle(field,getValue(field,data,true))'
      :delayed='delayed')

</template>
<script>
import dataMixin from '../mixins/dataMixin'
import DataField from './DataField'
import FieldTitle from './FieldTitle'
export default {
  name: 'field-item',
  components: {
    DataField,
    FieldTitle
  },
  mixins: [
    dataMixin
  ],
  props: ['field', 'fieldName', 'css', 'data', 'delayed'],
  computed: {
    parsedField () {
      const { field, fieldName } = this
      return this.parseField(fieldName, field)
    }
  }
}
</script>
