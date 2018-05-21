<template lang="pug">
  .data-item
    h2.item-title(v-if='entity.itemTitle') 
      icon.medium(v-if='entity.icon' :name='entity.icon')
      span {{ entity.singular }}
      data-field(:field='fields[titleField]' :row='data')
    .items(v-if='data && fields')
      template(v-for='field,fieldName,index in fields')
        template(v-if='showField(field,data)')
          .item(v-if='!field.renderAs' :class='itemClass(fieldName,index)')
            field-title(:field='field')
            data-field(:field='field' :row='data' :style='cellStyle(field,value(field,false))')
          //-custom component
          .custom-item(v-else :class='itemClass(fieldName,index)') 
            //-.field-title(v-if='!field.hideTitle') {{ field.title }}
            field-title(:field='field' v-if='!field.hideTitle' :class='field.renderAs')
            component.custom(:is='field.renderAs' :data='data[fieldName]' v-bind='componentProps(field)' )
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
      let css = []
      if (this.isFrom(fieldName, index)) css.push('from')
      if (this.isTo(fieldName, index)) css.push('to')
      let row = (index % 2) ? 'odd' : 'even'
      css.push(row)
      return css
    },
    componentProps (field) {
      return Object.assign({
        tableName: `field-${field.fieldName}`
      },
        field.renderAsProps)
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/vars.styl'

  .data-item
    min-width 100%
    width 100%

    .big-field.custom
      min-width 20em

    .items
      min-width 100%
      display flex
      flex-flow row wrap
      padding .5em 0em

    .item
      display flex
      flex 1 1 100%
      align-items center
      padding .5em 0em
      overflow visible
    
    //.item.from, .item.to
      // flex 1
    .item
      font-size 1em

      .field-icon, .field-title
        margin-right 0.5em

      .field-title, .custom
        flex 1
        margin 0 1em 0 2em 
        justify-content flex-start
      
      .data-field
        margin 0 2em 0 0em !important
          

  .custom-item
    flex 1
    flex-centered()
    
    .field-title, .custom
      flex 1

  .field-icon, .field-title
    color $color

  .field-title
    text-transform capitalize
    font-weight bold
    justify-selft flex-end
  
  .data-field
    flex 5
    margin 0 !important
    justify-content flex-start
 
    .field-value
      display inline-flex

  .item-title
    text-transform capitalize
    display inline-flex

    .field-value
      display inline-flex


    div, span
      &::before
        content '\00a0'

  .field-title.big-field
    justify-content flex-start
    margin-bottom 0.5em

  .field-title.data-table
    margin 0 !important
    justify-content center !important
    margin-top 1em !important

</style>

