<template lang="pug">
.export-format.row
  ctrl-switch(:value="isCsv" @change='changeFormat' :square='true')
  small(:class="(!isCsv) ? 'disabled':''") csv
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
    }
  }
}
</script>
