<template lang="pug">
  .data-item
    h2.item-title(v-if='entity.itemTitle') 
      icon.medium(v-if='entity.icon' :name='entity.icon')
      span {{ entity.singular }}
      data-field(:field='fields[titleField]' :row='data')
    .items.box(v-if='data && fields')
      template(v-for='field,fieldName,index in fields')
        template(v-if='showField(field,data)')
          .item(v-if='!field.renderAs' :class='itemClass(fieldName,index)')
            field-title(:field='field')
            data-field(:field='field' :row='data' :style='cellStyle(field,value(field,false))')
          //-custom component
          template(v-else) 
            .field-title(v-if='!field.hideTitle') {{ field.title }}
            data-table(v-if='field.renderAs === "data-table"' :data='data[fieldName]' :tableName='`field-${fieldName}`' v-bind='field.renderAsProps')
</template>
<script>
import dataMixin from '../mixins/dataMixin'
import DataField from './DataField'
import FieldTitle from './FieldTitle'
import DataTable from './DataTable'
export default {
  name: 'data-item',
  props: [
    'data',
    'type'
  ],
  components: {
    DataField,
    DataTable,
    FieldTitle
  },
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
    min-width 100%
    width 100%

    .items
      list-style none
      display flex
      flex-flow column wrap
      padding 2em

    .item
      flex 3
      font-size 1.125em
      display flex
      align-items center
      margin-bottom 0.5em

      .field-icon, .field-title
        margin-right 0.5em
        color $color

      .field-title
        flex 1
        justify-content flex-start
        text-transform capitalize
        font-weight bold

      .data-field
        flex 9

  .item-title
    text-transform capitalize
    display inline-flex

    .field-value
      display inline-flex

    div, span
      &::before
        content '\00a0'
</style>

