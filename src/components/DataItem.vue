<template lang="pug">
  .data-item
    ul(v-if='data && fields')
      template(v-for='field,fieldName,index in fields')
        li.item(v-if='!isHidden(fieldName)' :class='itemClass(fieldName,index)')
          icon.field-icon(v-if='field.titleIcon && field.icon' :name='field.icon')
          span.field-title(v-if='!field.hideTitle') {{ field.title }}:
          data-field(:field='field' :row='data' :style='cellStyle(field,value(field,false))') 
</template>
<script>
import dataMixin from '../mixins/dataMixin'
import DataField from '../components/DataField'
export default {
  name: 'data-item',
  props: [
    'data',
    'type'
  ],
  components: { DataField },
  mixins: [
    dataMixin
  ],
  methods: {
    value (field, format) {
      let raw = !format
      return this.getValue(field, this.data, raw)
    },
    itemClass (fieldName, index) {
      let cssClass = []
      if (this.isFrom(fieldName, index)) cssClass.push('from')
      if (this.isTo(fieldName, index)) cssClass.push('to')
      return cssClass
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/vars.styl'

  .data-item
    ul
      list-style none
      display flex
      flex-flow column wrap

      li.item
        flex 3
        font-size 1.25em
        display flex
        align-items center
        justify-content space
        margin-bottom 0.5em

        .field-icon, .field-title
          margin-right 0.5em
          color $color

        .field-title
          text-transform capitalize
          font-weight bold
</style>

