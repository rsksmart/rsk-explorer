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
      const type = this.type
      if (type) {
        const entity = this.dataEntity()(type)
        // if (!entity) console.warn(`Warning, unknown entity: ${type}`)
        return entity
      }
    },
    fields () {
      const entity = this.entity || {}
      let fields = entity.fields
      if (entity) {
        const parentData = this.parentData
        const data = this.data
        if (fields) {
          const fcb = this.fieldsCb
          if (fcb) {
            fields = fcb(fields, data, parentData)
            for (const name in fields) {
              fields[name] = this.parseField(name, fields[name])
            }
          }
        }
        fields = fields || this.dataKeys
      }
      return Object.assign({}, fields)
    },
    visibleFields () {
      return Object.values(this.fields)
        .filter(f => this.showField(f, this.data))
        .map(f => f.name)
    },
    fieldsKeys () {
      return Object.keys(this.fields)
    },
    key () {
      return this.dataKey()(this.type)
    },
    dataFormatted () {
      let data = this.data || {}
      const parentData = this.parentData || {}
      const fields = this.fields
      if (this.rowCb) {
        if (Array.isArray(data)) {
          data = data.map(row => {
            return this.rowCb(row, parentData, fields)
          })
        } else {
          data = this.rowCb(data, parentData, fields)
        }
      }
      return data
    },
    dataKeys () {
      const data = this.data
      if (data) {
        if (data[0]) return Object.keys(data[0])
        else return Object.keys(data)
      }
    },
    iconLoad () {
      const entity = this.entity
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
      const entity = this.entity
      const keys = entity.fieldsKeys
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
      const cssClass = index % 2 ? 'odd' : 'even'
      return cssClass
    },
    getValue (field, data, raw) {
      return this.getFieldFilteredValue()(field, data, raw)
    },
    isFrom (fieldName, index) {
      const next = this.visibleFields[index + 1]
      return fieldName === 'from' && next === 'to'
    },
    isTo (fieldName, index) {
      const prev = this.visibleFields[index - 1]
      return fieldName === 'to' && prev === 'from'
    },
    fieldPos (field) {
      return this.visibleFields.indexOf(field.name)
    },
    keyValue (data) {
      return this.dataKeyValue()(this.type, data)
    },
    iconStyle (row) {
      const style = {}
      const value = (row) ? row[this.key] : null
      if (this.type === 'blocks') {
        style.color = this.getBlockColor(value)
        style.fill = style.color
      }

      return style
    },
    fieldFormatProp (prop, field, value, filteredValue, row) {
      if (undefined === value) value = this.getValue(field, this.data, true)
      if (undefined === filteredValue) filteredValue = this.filterFieldValue()(field, value, row)
      const pv = field[prop]
      if (typeof pv === 'function') {
        return pv(value, filteredValue, row)
      }
      return pv
    },
    fieldValueDescription (field, value, filteredValue, row) {
      return this.fieldFormatProp('valueDescription', field, value, filteredValue, row)
    },

    fieldCss (field, value, filteredValue, row) {
      return this.fieldFormatProp('css', field, value, filteredValue, row)
    },

    fieldIcon (field, value, filteredValue, row) {
      return this.fieldFormatProp('icon', field, value, filteredValue, row)
    },

    fieldSuffix (field, value, filteredValue, row) {
      return this.fieldFormatProp('suffix', field, value, filteredValue, row)
    },

    renderAsProps (payload) {
      const field = payload.field || {}
      const props = field.renderAsProps
      return (typeof props === 'function') ? props(payload) : props
    },

    showField (field, data) {
      const fieldName = field.fieldName
      const hidden = this.isHidden(fieldName)
      const entity = this.entity
      const isTitleField = (fieldName === entity.titleField)
      const value = this.getValue(field, data)
      const isNotEmpty = (field.hideIfEmpty) ? value : true
      return Boolean(!field.hide && !hidden && !isTitleField && isNotEmpty)
    },

    rowLink (row) {
      let link
      const key = this.keyValue(row)
      const linkCb = this.linkCb
      if (linkCb) return linkCb(row, this.parentData, this.entity.link, key)
      link = link || this.entity.link
      // link = link || this.$route.path
      link = link || ''
      link = String(link).replace(/\/$/, '')
      link = link + '/' + key
      return link
    },
    isHidden (field) {
      const hideFields = this.hideFields
      if (hideFields) {
        return hideFields.find(value => {
          return value === field
        })
      }
      return false
    },
    makeLink (field, row) {
      const link = field.link
      const value = this.getValue(field, row, true)
      if (typeof link === 'function') return link(row, value, link)
      return ((value || value === 0) && link) ? link + value : null
    },
    computeTrim (field, value, filteredValue) {
      value = filteredValue || value
      field = field || {}
      value = value || ''
      value = `${value}`
      const { trim } = field
      if (trim === 'forced-auto') return 'auto'
      if (trim === 0) return 0
      if (value.length > this.trimIf) {
        return trim || this.defaultTrim
      }
    }
  }
}
