<template>
  <div class="data-item" v-if="entity">
    <h2 class="item-title" v-if="entity.itemTitle && data">
      <icon class="medium" v-if="entity.icon" :name="entity.icon"></icon>
      <span>{{ entity.singular }}</span>
      <data-field v-if="fields[titleField]" :field="fields[titleField]" :row="data"></data-field>
    </h2>
    <div class="items" v-if="data && fields">
      <template v-for="(field, fieldName, index) in fields">
        <template v-if="showField(field, data)">
          <template v-if="hasFields(field)">
            <template v-for="(f, n, ii) in field.fields">
              <field-item v-if="!f.renderAs" :field="parseField(n, field.fields[n])" :data="dataFormatted" v-bind="componentProps(f)" :css="itemClass(f, index + ii)" :key="`1-${n}`" />
              <div class="custom-item" v-else :class="itemClass(f)" :key="`2-${ii}`">
                <field-title :field="parseField(n, field.fields[n])" v-if="!field.hideTitle" :class="f.renderAs"></field-title>
                <component.custom :is="f.renderAs" :field="f" :data="getValue(f, data)" v-bind="componentProps(f)"></component.custom>
              </div>
            </template>
          </template>
          <template v-else>
            <field-item v-if="!field.renderAs" :field="field" :data="dataFormatted" v-bind="componentProps(field)" :css="itemClass(field, index)" :key="`3-${index}`" />
            <div class="custom-item" v-else :class="itemClass(field)" :key="`4-${index}`">
              <field-title :field="field" v-if="!field.hideTitle" :class="field.renderAs"></field-title>
              <component.custom :is="field.renderAs" :field="field" :data="getValue(field, data)" v-bind="componentProps(field)"></component.custom>
            </div>
          </template>
        </template>
      </template>
    </div>
  </div>
</template>
<script>
import dataMixin from '../mixins/dataMixin'
import DataField from './DataField'
import FieldTitle from './FieldTitle'
import DataTable from '@/components/General/DataTable'
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
