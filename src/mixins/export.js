import dataMixin from '../mixins/dataMixin'
import { json2Csv } from '../lib/js/json2csv'
import { CONTEXT } from '../config/types'
const context = CONTEXT.export
export default {
  mixins: [dataMixin],
  methods: {
    filterData (data) {
      const fData = {}
      const { fields, filterFieldValue } = this
      for (const f in fields) {
        const field = fields[f]
        const value = this.getValue(field, data, true)
        const filtered = filterFieldValue()({ field, value, data, context })
        fData[f] = filtered
      }
      return fData
    },
    jsonFilteredData (data) {
      return this.exportData(this.filterData(data))
    },
    getFilteredData (data, csv) {
      let value = this.jsonFilteredData(data)
      if (csv) value = this.toCsv(value)
      return value
    },
    exportData (data) {
      return (data) ? JSON.stringify(data, null, 4) : null
    },
    getFileName (fileName, type) {
      return `${fileName}.${type}`
    },
    downloadData (name, data, csv) {
      let value = this.jsonFilteredData(data)
      if (!value) return {}
      const fileType = this.getFileType(csv)
      if (csv) value = this.toCsv(value)
      const fileName = this.getFileName(name, fileType)
      return { fileType, value, fileName, title: `download ${fileType}` }
    },
    switchFormat (format) {
      return (format === 'CSV') ? 'JSON' : 'CSV'
    },
    changeFormat (format) {
      const newFormat = this.switchFormat(format)
      return this.updateExportFormat(newFormat)
    },
    toCsv (data, options) {
      return json2Csv(data, options)
    },
    getFileType (csv) {
      return (csv) ? 'csv' : 'json'
    }
  }
}
