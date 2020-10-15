<template lang="pug">
  .export-controls(v-if='data')
    copy-button.button.med(:value='exportData(filteredData)' title='copy')
    download-button.button.med(v-bind='downloadData')
</template>
<script>
import CopyButton from './controls/CopyButton'
import DownloadButton from './controls/DownloadButton'
import dataMixin from '../mixins/dataMixin'
export default {
  name: 'export-controls',
  props: ['data', 'type', 'id'],
  components: {
    CopyButton,
    DownloadButton
  },
  mixins: [dataMixin],
  computed: {
    filteredData () {
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
    fileName () {
      let fileName = 'download'
      const { entity, data, type } = this
      const { key } = entity
      const id = (key) ? data[key] : null
      if (type && id) fileName = `${type}-${id}`
      return fileName
    },
    downloadData () {
      const value = this.exportData(this.filteredData)
      if (!value) return {}
      const fileType = 'json'
      const fileName = this.getFileName(fileType)
      return { fileType, value, fileName, title: 'download' }
    }
  },
  methods: {
    exportData (data) {
      return (data) ? JSON.stringify(data, null, 4) : null
    },
    getFileName (type) {
      const { fileName } = this
      return `${fileName}.${type}`
    }
  }
}
</script>
<style lang="stylus">
  .export-controls
    display flex
    flex 1
    flex-flow row nowrap
    justify-content flex-end

    .button
      margin 0 0.5em
      flex 0
</style>
