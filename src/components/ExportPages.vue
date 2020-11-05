<template lang="pug">
  .export-pages.section
    h4.brand Dowload
    .odd
      .export-options.frame.row(v-if='!inProgress')
        export-format
      .export-progress.txt-center(v-if='inProgress')
        .center.brand
          small {{metadata.progress}}%
        .row.txt-center
          progress-bar(:progress='metadata.progress || 0.1' :width='progressBarWidth')
      .export.frame(v-if='inProgress')
        ul.plain.small.txt-center
          li
            small(v-if='metadata.received') Received: {{metadata.received}} of {{metadata.total}} items
          li
            small(v-if='metadata.elapsed') {{metadata.elapsed | m-to-time }}
            small(v-if='metadata.estimated') &nbsp;/ {{metadata.estimated | m-to-seconds | s-seconds}}
      .export-buttons.frame
        .col
          button.btn.brand(v-if='!inProgress' @click='exportPages') Export
          button.btn.brand(@click='close') Cancel
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { keccak256 } from '@rsksmart/rsk-utils'
import ExportMixin from '../mixins/export'
import ExportFormat from './controls/ExportFormat'
import ProgressBar from './controls/ProgressBar'
import { FileStream } from '../lib/js/fileStream'
import { mToTime, mToSeconds, sSeconds } from '../filters/TimeFilters'
export default {
  name: 'export-pages',
  components: {
    ExportFormat,
    ProgressBar
  },
  filters: { mToTime, mToSeconds, sSeconds },
  mixins: [ExportMixin],
  props: ['module', 'action', 'params', 'type', 'parentData'],
  data () {
    return {
      exportKey: undefined,
      unsubscribe: undefined,
      computedWidth: 0,
      inProgress: false,
      writer: undefined
    }
  },
  mounted () {
    this.computedWidth = this.$el.offsetWidth
  },
  beforeDestroy () {
    if (this.writer) this.writer.abort()
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
      const writer = FileStream(fileName)
      this.writer = writer
      let excludeTitles
      this.unsubscribe = this.$store.subscribeAction(({ type, payload }) => {
        if (type === 'exportPages' && payload.req && payload.req.key === exportKey) {
          const { data, pages, req } = payload
          const { next } = pages
          const { rowCb, filterData, parentData, isCsv, toCsv } = this
          const convert = isCsv ? v => toCsv(v, { excludeTitles }) : JSON.stringify
          if (data) {
            const filtered = data.map(d => {
              if (rowCb) d = rowCb(d, parentData)
              d = filterData(d)
              d = convert(d)
              excludeTitles = true
              return d
            })
            for (const line of filtered) {
              writer.write(line + '\n')
            }
          }
          if (next !== undefined && next !== null) {
            req.next = next
            this.fetchExportData(req)
          } else {
            this.close()
          }
        }
      })
      this.getPages(payload)
    },
    reset () {
      const { unsubscribe, writer } = this
      if (unsubscribe) unsubscribe()
      if (writer) {
        writer.abort()
      }
      this.inProgress = false
    },
    async close () {
      const { writer } = this
      if (writer) await this.writer.close()
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
    margin 0 0 2em 0
    width 100%
    height auto
    flex-centered()
    flex-flow column wrap
</style>
