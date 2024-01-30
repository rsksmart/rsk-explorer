<template>
  <div class="export-controls" v-if="data" label="test label">
    <menu-button>
      <template v-slot:button>
        <icon name="clowd-down"></icon>
        <span class="btn-title">Download</span>
        <icon name="arrow-down" class="icon-down"></icon>
        <icon name="arrow-up" class="icon-up"></icon>
      </template>
      <template v-slot:elements>
        <copy-button class="button med" :value="getFilteredData(data,isCsv)" title="copy json">
          <small>copy</small>
        </copy-button>
        <download-button class="button med" v-bind="downloadData(fileName,data,isCsv)">
          <small>download</small>
        </download-button>
        <div class="row">
          <export-format></export-format>
        </div>
      </template>
    </menu-button>
  </div>
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
    flex 1
    flex-flow row nowrap
    justify-content flex-end

</style>
