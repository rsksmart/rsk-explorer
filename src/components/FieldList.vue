<template lang="pug">
  .field-list(v-if="fields")
    template(v-for='field,fieldName in fields')
      field-item(:field="field" :data="data" :fieldName="fieldName")

</template>
<script>
export default {
  name: 'field-list',
  components: {
  },
  props: {
    data: {
      type: Object
    },
    fields: {
      type: Object,
      required: true
    },
    values: {
      type: Object
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/mixins.styl'

  .field-list
     display flex
     flex-flow column nowrap
     flex-centered()
     .item
        flex-centered()
        flex 1
        flex-flow row nowrap
        .field-title, .data-field
          display inline-flex
        .data-field
          flex 2 1 70%
        .field-title
          flex 1 2 30%
          .title
            font-size  .9em
            &:after
              content:':'
</style>
