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
          Copy
        </copy-button>
        <button @click="downloadInfo('json')">Download JSON</button>
        <button @click="downloadInfo('csv')">Download csv</button>
      </template>
    </menu-button>
  </div>
</template>
<script>
import { downloadText } from '@/lib/js/io'
import MenuButton from './controls/MenuButton'
import CopyButton from './controls/CopyButton'
import exportMixin from '../mixins/export'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'export-controls',
  props: ['data', 'type', 'id'],
  components: {
    MenuButton,
    CopyButton
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
  },
  methods: {
    ...mapActions(['updateExportFormat']),
    downloadInfo (type) {
      const isCsv = type === 'csv'
      const info = this.downloadData(this.fileName, this.data, isCsv)
      downloadText(info.value, info.fileName, type)
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
