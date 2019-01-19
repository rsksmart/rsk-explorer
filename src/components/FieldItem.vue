<template lang="pug">
  .item(:class='css')
    field-title(:field='field')
    data-field(
      :field='field'
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
  props: ['field', 'css', 'data','delayed']
}
</script>

