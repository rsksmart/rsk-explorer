<template lang="pug">
.export-format.row
  small.label(:class='formatCss("json")') json
  ctrl-switch(:value="isCsv" @change='changeFormat' :square='true' css='enabled')
  small.label(:class='formatCss("csv")') csv
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import CtrlSwitch from './CtrlSwitch'
export default {
  name: 'export-format',
  components: { CtrlSwitch },
  computed: {
    ...mapState({
      format: state => state.config.exportFormat
    }),
    ...mapGetters({
      isCsv: 'isCsvExport'
    })
  },
  methods: {
    ...mapActions(['updateExportFormat']),
    switchFormat (format) {
      return (format === 'CSV') ? 'JSON' : 'CSV'
    },
    changeFormat () {
      const newFormat = this.switchFormat(this.format)
      return this.updateExportFormat(newFormat)
    },
    formatCss (value) {
      const format = this.format.toLowerCase()
      return (value === format) ? ['brand', 'bold'] : 'disabled'
    }
  }
}
</script>
<style lang="stylus">
  .export-format
    .switch
      margin 0 0.5em
</style>
