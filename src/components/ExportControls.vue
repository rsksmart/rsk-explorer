<template lang="pug">
  .export-controls(v-if="data" label="test label")
    menu-button
      template(v-slot:button)
        icon(name="dots")
      template(v-slot:elements)
        copy-button.button.med(:value="getFilteredData(data,isCsv)" title="copy json")
          small copy
        download-button.button.med(v-bind="downloadData(fileName,data,isCsv)")
          small download
        .row
          export-format
</template>
<script>
import MenuButton from './controls/MenuButton'
import CopyButton from './controls/CopyButton'
import DownloadButton from './controls/DownloadButton'
import ExportFormat from './controls/ExportFormat'
import exportMixin from '../mixins/export'
import { mapGetters } from 'vuex'
export default {
  name: 'export-controls',
  props: ['data', 'type', 'id'],
  components: {
    MenuButton,
    CopyButton,
    DownloadButton,
    ExportFormat
  },
  mixins: [exportMixin],
  computed: {
    ...mapGetters({
      isCsv: 'isCsvExport'
    }),
    fileName () {
      let fileName = 'download'
      const { entity, data, type } = this
      const { key } = entity
      const id = (key) ? data[key] : null
      if (type && id) fileName = `${type}-${id}`
      return fileName
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
      margin 0.5em
      flex 0

      small
        margin 0 0 0 1em
</style>
