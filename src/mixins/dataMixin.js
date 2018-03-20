import { mapGetters } from 'vuex'
import common from './common'
import DataField from '../components/DataField.vue'
import { txValue } from '../filters/TokensFilters'
export default {
  components: {
    DataField
  },
  filters: { txValue },
  mixins: [common],
  props: [
    'data',
    'type',
    'title',
    'hideFields',
    'link',
    'formatRow',
    'formatFields',
    'formatLink',
    'parentData'
  ],
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
    rowLink (row) {
      let link
      let key = this.keyValue(row)
      let linkCb = this.linkCb
      if (linkCb) return linkCb(row, this.parentData, key)
      link = this.link || this.entity.link
      link = link || this.$route.path
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
    }
  }
}
