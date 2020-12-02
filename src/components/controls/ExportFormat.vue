<template lang="pug">
.export-format
  ctrl-switch-values(:values="['json','csv']" :selected="format.toLowerCase()" @change="changeFormat")
</template>
<script>
import { mapState, mapActions } from 'vuex'
import CtrlSwitchValues from './CtrlSwitchValues'
export default {
  name: 'export-format',
  components: { CtrlSwitchValues },
  computed: {
    ...mapState({
      format: state => state.config.exportFormat
    })
  },
  methods: {
    ...mapActions(['updateExportFormat']),
    changeFormat (newFormat) {
      return this.updateExportFormat(newFormat.toUpperCase())
    }
  }
}
</script>
