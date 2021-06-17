<template lang="pug">
  .data-item(v-if='entity')
    h2.item-title(v-if='entity.itemTitle && data')
      icon.medium(v-if='entity.icon' :name='entity.icon')
      span {{ entity.singular }}
      data-field(v-if='fields[titleField]' :field='fields[titleField]' :row='data')
    .items(v-if='data && fields')
      template(v-for='field,fieldName,index in fields')
        template(v-if='showField(field,data)')

          template(v-if='hasFields(field)')
            template(v-for='f,n,ii in field.fields')
              field-item(v-if='!f.renderAs' :field='parseField(n,field.fields[n])' :data='dataFormatted' v-bind='componentProps(f)' :css='itemClass(f,index+ii)')
              .custom-item(v-else :class='itemClass(f)')
                field-title(:field='parseField(n,field.fields[n])' v-if='!field.hideTitle' :class='f.renderAs')
                component.custom(:is='f.renderAs' :field='f' :data='getValue(f,data)' v-bind='componentProps(f)')

          template(v-else)
            field-item(v-if='!field.renderAs' :field='field' :data='dataFormatted' v-bind='componentProps(field)' :css='itemClass(field,index)')
              //-custom component
            .custom-item(v-else :class='itemClass(field)')
              field-title(:field='field' v-if='!field.hideTitle' :class='field.renderAs')
              component.custom(:is='field.renderAs' :field='field' :data='getValue(field,data)' v-bind='componentProps(field)')
</template>
<script>
import dataMixin from '../mixins/dataMixin'
import DataField from './DataField'
import FieldTitle from './FieldTitle'
import DataTable from './DataTable'
import FieldItem from './FieldItem'
import CollapsibleList from './CollapsibleList'
import EventCall from './EventCall'
export default {
  name: 'data-item',
  props: [
    'data',
    'type',
    'parentData',
    'delayed'
  ],
  components: {
    DataField,
    DataTable,
    FieldTitle,
    FieldItem,
    CollapsibleList,
    EventCall
  },
  mixins: [
    dataMixin
  ],
  computed: {
    delayedFields () {
      const delayed = this.delayed || {}
      return delayed.fields || []
    }
  },
  methods: {
    value (field, format) {
      const raw = !format
      return this.getValue(field, this.data, raw)
    },
    isDelayed (field) {
      const fields = this.delayedFields
      return fields.indexOf(field) > -1
    },
    itemClass (field, rowNumber) {
      const css = []
      const fieldName = field.fieldName
      const pos = this.fieldPos(field)
      if (this.isFrom(fieldName, pos)) css.push('from')
      if (this.isTo(fieldName, pos)) css.push('to')
      rowNumber = rowNumber || pos
      const row = (rowNumber % 2) ? 'odd' : 'even'
      css.push(row)
      return css
    },
    componentProps (field) {
      const tableName = `field-${field.fieldName}`
      const delayed = this.isDelayed(field)
      let props = { tableName, delayed }
      props = (field.renderAsProps) ? Object.assign(props, field.renderAsProps) : props
      return props
    },
    hasFields (field) {
      return field.fields && Object.keys(field.fields).length
    }
  }
}
</script>

<style lang="stylus">
  @import '../lib/styl/vars.styl'
  @import '../lib/styl/media_queries.styl'

  .data-item
    min-width 100%
    width 100%

    .items
      min-width 100%
      display flex
      flex-flow row wrap
      padding 0.5em 0em

    .item
      display flex
      flex 1 1 100%
      align-items center
      padding 0.5em 0em
      overflow visible

    .item
      font-size 1em

     .field-title
        margin-right 0.5em

      .field-title
        flex 1
        margin 0 1em 0 2em
        justify-content flex-start
        align-self flex-start

      .data-field
        margin 0 2em 0 0em !important
        flex 5

  .field-value
    display inline-flex

  .custom
    display flex
    flex-flow column wrap
    margin 0 2em 0 0em !important
    flex 5

  .custom-item
    display flex
    flex 1 1 100%
    align-items center
    overflow visible
    padding 0.5em 0em
    max-width 100%

    .field-title
      flex 1
      margin 0 1em 0 2em
      justify-content flex-start

  .field-icon, .field-title
    color $color

  .field-title
    text-transform capitalize
    font-weight 600

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
    align-self flex-start
    margin-bottom 0.5em

  .field-title.big-field, .big-field.custom
    margin 0 1em 0em 2em

  .field-title.data-table
    margin 0 !important
    justify-content center !important
    margin-top 1em !important

  @media $media_medium
    .data-item
      .big-field.custom
        min-width 20em
</style>
