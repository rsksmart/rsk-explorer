<template lang="pug">
  .export-controls(v-if="data")
    menu-button
      template(v-slot:button)
        icon(name="dots")
      template(v-slot:elements)
        copy-button.button.med(:value="getFilteredData()" title="copy json")
          small copy JSON
        copy-button.button.med(:value='getFilteredData(true)' title="copy csv")
          small copy CSV
        download-button.button.med(v-bind="downloadData()")
          small download JSON
        download-button.button.med(v-bind="downloadData(true)")
          small download CSV
</template>
<script>
import MenuButton from './controls/MenuButton'
import CopyButton from './controls/CopyButton'
import DownloadButton from './controls/DownloadButton'
import dataMixin from '../mixins/dataMixin'
import { json2Csv } from '../lib/js/json2csv'
export default {
  name: 'export-controls',
  props: ['data', 'type', 'id'],
  components: {
    MenuButton,
    CopyButton,
    DownloadButton
  },
  mixins: [dataMixin],
  computed: {
    fileName () {
      let fileName = 'download'
      const { entity, data, type } = this
      const { key } = entity
      const id = (key) ? data[key] : null
      if (type && id) fileName = `${type}-${id}`
      return fileName
    }
  },
  methods: {
    filterData () {
      const fData = {}
      const { fields, filterFieldValue, data } = this
      for (const f in fields) {
        const field = fields[f]
        const value = this.getValue(field, data, true)
        const filtered = filterFieldValue()(field, value, data)
        fData[f] = filtered
      }
      return fData
    },
    jsonFilteredData () {
      return this.exportData(this.filterData())
    },
    getFilteredData (csv) {
      let value = this.jsonFilteredData()
      if (csv) value = json2Csv(value)
      return value
    },
    exportData (data) {
      return (data) ? JSON.stringify(data, null, 4) : null
    },
    getFileName (type) {
      const { fileName } = this
      return `${fileName}.${type}`
    },
    downloadData (csv) {
      let value = this.jsonFilteredData()
      if (!value) return {}
      const fileType = (csv) ? 'csv' : 'json'
      if (csv) value = json2Csv(value)
      const fileName = this.getFileName(fileType)
      return { fileType, value, fileName, title: `download ${fileType}` }
    }
  }
}
</script>
<style lang="stylus">
  .export-controls
    display flex
    position relative
    flex 1
    flex-flow row nowrap
    justify-content flex-end

    .button
      margin 0 0.5em
      flex 0
</style>
