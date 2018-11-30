<template lang="pug">
  .data-item(v-if='entity')
    h2.item-title(v-if='entity.itemTitle && data')
      icon.medium(v-if='entity.icon' :name='entity.icon')
      span {{ entity.singular }}
      data-field(v-if='fields[titleField]' :field='fields[titleField]' :row='data')
    .items(v-if='data && fields')
      template(v-for='field,fieldName,index in fields')
        template(v-if='showField(field,data)')
          .item(v-if='!field.renderAs' :class='itemClass(field)')
            field-title(:field='field')
            data-field(
              :field='field'
              :row='dataFormatted'
              :style='cellStyle(field,value(field,false))'
              :delayed='isDelayed(field.fieldName)')
          //-custom component
          .custom-item(v-else :class='itemClass(field)')
            //-.field-title(v-if='!field.hideTitle') {{ field.title }}
            field-title(:field='field' v-if='!field.hideTitle' :class='field.renderAs')
            component.custom(:is='field.renderAs' :data='getValue(field,data)' v-bind='componentProps(field)')
</template>
<script>
import dataMixin from '../mixins/dataMixin'
import DataField from './DataField'
import FieldTitle from './FieldTitle'
import DataTable from './DataTable'
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
    CollapsibleList,
    EventCall
  },
  mixins: [
    dataMixin
  ],
  computed: {
    delayedFields () {
      let delayed = this.delayed || {}
      return delayed.fields || []
    }
  },
  methods: {
    value (field, format) {
      let raw = !format
      return this.getValue(field, this.data, raw)
    },
    isDelayed (field) {
      let fields = this.delayedFields
      return fields.indexOf(field) > -1
    },
    itemClass (field) {
      let css = []
      let fieldName = field.fieldName
      let pos = this.fieldPos(field)
      if (this.isFrom(fieldName, pos)) css.push('from')
      if (this.isTo(fieldName, pos)) css.push('to')
      let row = (pos % 2) ? 'odd' : 'even'
      css.push(row)
      return css
    },
    componentProps (field) {
      return Object.assign({ tableName: `field-${field.fieldName}` }, field.renderAsProps)
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

      .field-icon, .field-title
        margin-right 0.5em

      .field-title
        flex 1
        margin 0 1em 0 2em
        justify-content flex-start

      .data-field
        margin 0 2em 0 0em !important
        flex 5

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

    .field-title
      flex 1
      margin 0 1em 0 2em
      justify-content flex-start

  .field-icon, .field-title
    color $color

  .field-title
    text-transform capitalize
    font-weight bold

  .data-field
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
