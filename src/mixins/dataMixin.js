import { mapGetters } from 'vuex'
import common from './common'
import { txValue } from '../filters/TokensFilters'
export default {
  filters: { txValue },
  mixins: [common],
  computed: {
    pageTitle () {
      return this.title || this.type
    },
    fieldsCb () {
      return this.cbParse('formatFields')
    },
    rowCb () {
      return this.cbParse('formatRow')
    },
    linkCb () {
      return this.cbParse('formatLink')
    },
    entity () {
      if (this.type) return this.dataEntity()(this.type)
    },
    fields () {
      if (this.entity) {
        let fields = this.entity.fields
        let parentData = this.parentData
        if (fields) {
          if (this.fieldsCb) {
            fields = this.fieldsCb(fields, parentData)
          }
        }
        return fields || this.dataKeys
      }
      return this.dataKeys
    },
    fieldsKeys () {
      return Object.keys(this.fields)
    },
    key () {
      return this.dataKey()(this.type)
    },
    dataFormatted () {
      let data = this.data
      let parentData = this.parentData
      if (this.rowCb) {
        if (Array.isArray(data)) {
          data = data.map(row => {
            return this.rowCb(row, parentData)
          })
        } else {
          data = this.rowCb(data, parentData)
        }
      }
      return data
    },
    dataKeys () {
      let data = this.data
      if (data) {
        if (data[0]) return Object.keys(data[0])
        else return Object.keys(data)
      }
    },
    iconLoad () {
      let entity = this.entity
      let icon = 'load'
      if (entity) icon = entity.icon || icon
      return icon
    },
    titleField () {
      return this.entity.titleField || this.key
    }
  },
  methods: {
    ...mapGetters([
      'dataEntity',
      'getFieldValue',
      'getFieldFilteredValue',
      'filterFieldValue',
      'dataKey',
      'dataKeyValue'
    ]),
    fieldFromKey (key) {
      let entity = this.entity
      let keys = entity.fieldsKeys
      if (keys) {
        return entity.fields[keys[key]]
      }
    },
    cbParse (key) {
      let cb = this[key]
      if (this.entity) cb = cb || this.entity[key]
      return typeof cb === 'function' ? cb : null
    },
    rowClass (index) {
      let cssClass = index % 2 ? 'odd' : 'even'
      return cssClass
    },
    getValue (field, data, raw) {
      let value = this.getFieldFilteredValue()(field, data, raw)
      return value || ''
    },
    isFrom (fieldName, index) {
      let next = this.fieldsKeys[index + 1]
      return fieldName === 'from' && next === 'to'
    },
    isTo (fieldName, index) {
      let prev = this.fieldsKeys[index - 1]
      return fieldName === 'to' && prev === 'from'
    },
    keyValue (data) {
      return this.dataKeyValue()(this.type, data)
    },
    iconStyle (row) {
      let style = {}
      let value = row[this.key]
      if (this.type === 'blocks') {
        style.color = this.getBlockColor(value)
        style.fill = style.color
      }

      return style
    },
    showField (field, data) {
      let fieldName = field.fieldName
      let hidden = this.isHidden(fieldName)
      let entity = this.entity
      let isTitleField = (fieldName === entity.titleField)
      let isNotEmpty = (field.hideIfEmpty) ? this.getValue(field, data) : true
      return !hidden && !isTitleField && isNotEmpty
    },
    rowLink (row) {
      let link
      let key = this.keyValue(row)
      let linkCb = this.linkCb
      if (linkCb) return linkCb(row, this.parentData, key)
      link = link || this.entity.link
      link = link || this.$route.path
      link = String(link).replace(/\/$/, '')
      link = link + '/' + key
      return link
    },
    isHidden (field) {
      let hideFields = this.hideFields
      if (hideFields) {
        return hideFields.find(value => {
          return value === field
        })
      }
      return false
    },
    makeLink (field, row) {
      let value = this.getValue(field, row, true)
      return ((value || value === 0) && field.link) ? field.link + value : null
    },
    computeTrim (field, value) {
      if (field.trim === 0) return 0
      if (String(value.length) > this.trimIf) {
        return field.trim || this.defaultTrim
      }
    }
  }
}
