<template lang="pug">
  .export-controls(v-if="data" label="test label")
    menu-button
      template(v-slot:button)
        icon(name="dots")
      template(v-slot:elements)
        copy-button.button.med(:value="getFilteredData(isCsv)" title="copy json")
          small copy
        download-button.button.med(v-bind="downloadData(isCsv)")
          small download
        .row
          ctrl-switch(:value="isCsv" @change='changeFormat' :square='true')
          small(:class="(!isCsv) ? 'disabled':''") csv
</template>
<script>
import MenuButton from './controls/MenuButton'
import CopyButton from './controls/CopyButton'
import DownloadButton from './controls/DownloadButton'
import CtrlSwitch from './controls/CtrlSwitch'
import dataMixin from '../mixins/dataMixin'
import { json2Csv } from '../lib/js/json2csv'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'export-controls',
  props: ['data', 'type', 'id'],
  components: {
    MenuButton,
    CopyButton,
    DownloadButton,
    CtrlSwitch
  },
  mixins: [dataMixin],
  computed: {
    ...mapState({
      format: state => state.config.exportFormat
    }),
    isCsv () {
      return this.format === 'CSV'
    },
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
    ...mapActions(['updateExportFormat']),
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
    },
    switchFormat (format) {
      return (format === 'CSV') ? 'JSON' : 'CSV'
    },
    changeFormat () {
      const newFormat = this.switchFormat(this.format)
      return this.updateExportFormat(newFormat)
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
      margin  0.5em
      flex 0
      small
        margin 0 0 0 1em
</style>
