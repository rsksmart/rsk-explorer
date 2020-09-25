<template lang="pug">
  .box-field.box
    .box-field-icon
      field-icon(:icon='field.icon')
    .box-field-content
      field-title(:field='field' :options='{hideIcon:true}')
      data-field(:field='field' :row='row')
</template>

<script>
import DataField from './DataField'
import FieldTitle from './FieldTitle'
import FieldIcon from './FieldIcon'
export default {
  name: 'box-field',
  components: {
    DataField,
    FieldTitle,
    FieldIcon
  },
  props: {
    row: {
      required: true
    },
    field: {
      required: true
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/style.styl'
  @import '../lib/styl/mixins.styl'
  .box-field.box
    display flex
    flex-flow row nowrap
    .data-field, .field-title .title
      margin 0
    .box-field-content
      margin 0 0 0 2em
      .field-title
        justify-content flex-start
    .box-field-icon
      flex-centered()
      align-self start
      .svg-icon
        width 2em
        height @width
</style>
