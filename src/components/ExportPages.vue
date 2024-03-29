<template>
  <div class="export-pages bg-secondary">
    <h4 class="title">Download</h4>
    <form class="form-export">
      <div class="export-options" v-if="!inProgress">
        <fieldset class="frame" v-if="itemEntity">
          <legend>Fields</legend>
          <export-items></export-items>
        </fieldset>
        <fieldset class="frame">
          <legend>Format</legend>
          <export-format></export-format>
        </fieldset>
      </div>
      <div class="export-progress txt-center" v-if="inProgress">
        <div class="center brand">
          <small>{{ metadata.progress }}%</small>
        </div>
        <div class="txt-center">
          <progress-bar :progress="metadata.progress || 0.1" :width="'100%'"></progress-bar>
        </div>
      </div>
      <div class="export" v-if="inProgress">
        <div class="plain small txt-center">
          <div>
            <small v-if="metadata.received">Received: {{ metadata.received }} of {{ metadata.total }} items</small>
          </div>
          <div>
            <small v-if="metadata.elapsed">{{ metadata.elapsed | m-to-time }}</small>
            <small v-if="metadata.estimated">&nbsp;/ {{ metadata.estimated | m-to-seconds | s-seconds }}</small>
          </div>
        </div>
      </div>
      <div class="export-buttons">
        <button class="export" :style="{ backgroundColor: PAGE_COLORS[$route.name].cl, color: PAGE_COLORS[$route.name].cl2 }" v-if="!inProgress" @click="exportPages">Export</button>
        <button class="cancel" @click="close">Cancel</button>
      </div>
    </form>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { keccak256 } from '@rsksmart/rsk-utils'
import ExportMixin from '../mixins/export'
import ExportFormat from './controls/ExportFormat'
import ExportItems from './controls/ExportItems'
import ProgressBar from './controls/ProgressBar'
import { FileStream } from '../lib/js/fileStream'
import { mToTime, mToSeconds, sSeconds } from '../filters/TimeFilters'
import { EXPORT_ITEMS } from '../config/types'
import { PAGE_COLORS } from '@/config/pageColors'

export default {
  name: 'export-pages',
  components: {
    ExportFormat,
    ProgressBar,
    ExportItems
  },
  filters: { mToTime, mToSeconds, sSeconds },
  mixins: [ExportMixin],
  props: ['module', 'action', 'params', 'entityName', 'parentData', 'itemEntity'],
  data () {
    return {
      exportKey: undefined,
      unsubscribe: undefined,
      computedWidth: 0,
      inProgress: false,
      writer: undefined,
      PAGE_COLORS
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
    type () {
      const { itemEntity, entityName, exportItems } = this
      return (itemEntity && exportItems === EXPORT_ITEMS.ALL) ? itemEntity : entityName
    },
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
    },
    exportItems () {
      return this.getUserConfig()('exportItems')
    }
  },
  methods: {
    ...mapGetters(['getExportMetadata', 'getUserConfig']),
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
          const { rowCb, filterData, parentData, isCsv, toCsv, context } = this
          const convert = isCsv ? v => toCsv(v, { excludeTitles }) : JSON.stringify
          if (data) {
            const filtered = data.map(d => {
              if (rowCb) d = rowCb({ data: d, parentData, context })
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
