<template lang="pug">
  .data-table(v-if='data && fields')
    //-pre {{tableData}}
    table.dark(v-if='data')
      thead
        tr
          template(v-for='field,fieldName,index in fields')
            template(v-if='!isHidden(fieldName)')
              th  
                icon(v-if='field.titleIcon && field.icon' :name='field.icon')
                span(v-if='!field.hideTitle') {{ field.title }}
              th(v-if='isFrom(fieldName,index)' )
          th
      tbody
        tr(v-for='row, rowIndex in tableData' :class='rowClass(rowIndex)')
          template(v-for='field,fieldName,index in fields') 
            td(v-if='!isHidden(fieldName)')
              template(v-if='field.link && getValue(field,row)') 
                router-link(:to='field.link + getValue(field,row)' :style='cellStyle(field,getValue(field,row))')
                  data-table-field(:field='field' :value='getValue(field,row)')
              template(v-else)
                data-table-field(:field='field' :value='getValue(field,row)' :style='cellStyle(field,getValue(field,row))')  
            td(v-if='isFrom(fieldName,index)')
              icon(name='arrow-right')
          td
            router-link(:to='rowLink(row)')
              icon(name='load')

</template>
<script>
import { mapGetters } from 'vuex'
import DataTableField from './DataTableField.vue'
import common from '../mixins/common'
export default {
  name: 'data-table',
  props: ['data', 'type', 'hideFields', 'rowCb', 'fieldsCb', 'link'],
  components: {
    DataTableField
  },
  mixins: [
    common
  ],
  computed: {
    entity () {
      if (this.type) return this.dataEntity()(this.type)
    },
    fields () {
      let fields = this.entity.fields
      if (fields) {
        if (this.fieldsCb && typeof (this.fieldsCb) === 'function') {
          fields = this.fieldsCb(fields)
        }
      }
      return fields || Object.keys(this.data[0])
    },
    fieldsKeys () {
      return Object.keys(this.fields)
    },
    key () {
      return this.dataKey()(this.type)
    },
    tableData () {
      let data = this.data
      if (this.rowCb && typeof (this.rowCb) === 'function') {
        data = data.map((row) => {
          return this.rowCb(row)
        })
      }
      return data
    }
  },
  methods: {
    ...mapGetters([
      'dataEntity',
      'getFieldFilteredValue',
      'dataKey',
      'dataKeyValue'
    ]),
    cellStyle (field, value) {
      let style = {}
      let type = field.type
      if (type === 'block') style.color = this.getBlockColor(value)
      return style
    },
    rowClass (index) {
      let cssClass = (index % 2) ? 'odd' : 'even'
      return cssClass
    },
    getValue (field, data) {
      let value = this.getFieldFilteredValue()(field, data)
      // let entity = this.entity.fields[field.name]
      return value || ''
    },
    isFrom (fieldName, index) {
      let next = this.fieldsKeys[index + 1]
      return (fieldName === 'from' && next === 'to')
    },
    keyValue (data) {
      return this.dataKeyValue()(this.type, data)
    },
    rowLink (row) {
      let link = this.link
      if (!link) link = this.$route.fullPath
      let key = this.keyValue(row)
      return link + '/' + key
    },
    isHidden (field) {
      let hideFields = this.hideFields
      if (hideFields) {
        return hideFields.find((value) => {
          return value === field
        })
      }
      return false
    }
  }
}
</script>
