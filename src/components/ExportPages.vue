<template lang="pug">
  .export-pages
    .export-options(v-if='!inProgress')
      export-format
    .export-progress(v-if='inProgress')
      span {{metadata.progress}}%
      progress-bar(:progress='metadata.progress || 0.1' :width='progressBarWidth')
    .export(v-if='inProgress')
      ul.plain.small
        li Received: {{metadata.received}} of {{metadata.total}}
        li
          span(v-if='metadata.elapsed') {{metadata.elapsed | t-seconds-ago }}
          span(v-if='metadata.estimated') &nbsp;/ {{metadata.estimated | m-to-seconds | s-seconds}}
    .export-buttons.row
      button.btn(v-if='!inProgress' @click='exportPages') Export
      button.btn(@click='close') Cancel
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { keccak256 } from '@rsksmart/rsk-utils'
import ExportMixin from '../mixins/export'
import ExportFormat from './controls/ExportFormat'
import ProgressBar from './controls/ProgressBar'
import { downloadText } from '../lib/js/io'
export default {
  name: 'export-pages',
  components: {
    ExportFormat,
    ProgressBar
  },
  mixins: [ExportMixin],
  props: ['module', 'action', 'params', 'type', 'parentData'],
  data () {
    return {
      exportKey: undefined,
      unsubscribe: undefined,
      computedWidth: 0,
      inProgress: false
    }
  },
  mounted () {
    this.computedWidth = this.$el.offsetWidth
  },
  beforeDestroy () {
    this.reset()
  },
  computed: {
    ...mapGetters({
      isCsv: 'isCsvExport'
    }),
    payload () {
      const { module, action, params } = this
      if (!module || !action || !params) return
      return Object.assign({}, { module, action, params })
    },
    metadata () {
      const metadata = this.getExportMetadata()(this.exportKey) || {}
      const { received, total, started } = metadata
      metadata.progress = (received && total) ? parseInt(received * 100 / total) : 0
      metadata.elapsed = (started) ? Date.now() - metadata.started : 0
      const { progress, elapsed } = metadata
      metadata.estimated = (progress) ? parseInt(elapsed / progress) * 100 : 0
      return metadata
    },
    progressBarWidth () {
      return parseInt(this.computedWidth / 2)
    }
  },
  methods: {
    ...mapGetters(['getExportMetadata']),
    ...mapActions(['getPages', 'fetchExportData']),
    createKey (payload) {
      const { type } = this
      if (!type || !payload) return
      const hash = keccak256(JSON.stringify(payload))
      return `${type}-${hash}`
    },
    exportPages () {
      this.reset()
      this.inProgress = true
      const { payload, isCsv } = this
      const exportKey = this.createKey(payload)
      this.exportKey = exportKey
      payload.key = exportKey
      const fileType = this.getFileType(isCsv)
      const fileName = this.getFileName(exportKey, fileType)
      let content = []
      this.unsubscribe = this.$store.subscribeAction(({ type, payload }) => {
        if (type === 'exportPages' && payload.req && payload.req.key === exportKey) {
          const { data, pages, req } = payload
          const { next } = pages
          if (data) {
            const { rowCb, filterData, parentData } = this
            const filtered = data.map(d => {
              if (rowCb) d = rowCb(d, parentData)
              d = filterData(d)
              return d
            })
            content = content.concat(filtered)
          }
          if (next !== undefined && next !== null) {
            req.next = next
            this.fetchExportData(req)
          } else {
            content = this.exportData(content)
            if (isCsv) content = this.toCsv(content)
            downloadText(content, fileName, fileType)
            this.close()
          }
        }
      })
      this.getPages(payload)
    },
    reset () {
      const { unsubscribe } = this
      if (unsubscribe) unsubscribe()
      this.inProgress = false
    },
    close () {
      this.reset()
      this.$emit('close')
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/vars.styl'
  @import '../lib/styl/mixins.styl'

  .export-pages
    width 100%
    height auto
    flex-centered()
    flex-flow column wrap
</style>
