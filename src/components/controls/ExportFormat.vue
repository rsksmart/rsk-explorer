<template>
  <div class="export-format">
    <ctrl-switch-values :values="values" :selected="format" @change="updateExportFormat"></ctrl-switch-values>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import CtrlSwitchValues from './CtrlSwitchValues'
import { EXPORT_FORMATS } from '../../config/types'
export default {
  name: 'export-format',
  components: { CtrlSwitchValues },
  computed: {
    ...mapState({
      format: state => state.config.exportFormat
    }),
    values () {
      return Object.values(EXPORT_FORMATS)
    }
  },
  methods: {
    ...mapActions(['updateExportFormat'])
  }
}
</script>
