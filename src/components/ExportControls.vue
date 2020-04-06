<template lang="pug">
  .export-controls(v-if='data')
    copy-button.button.med(:value='exportData' title='copy')
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
    exportData () {
      const { data } = this
      return (data) ? JSON.stringify(data, null, 4) : null
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
      const value = this.exportData
      if (!value) return {}
      const fileType = 'json'
      let fileName = this.fileName
      fileName = `${fileName}.${fileType}`
      return { fileType, value, fileName, title: 'download' }
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
