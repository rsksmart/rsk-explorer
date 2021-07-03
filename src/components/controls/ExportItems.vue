<template lang="pug">
.export-items
  ctrl-switch-values(:values="values" :selected="exportItems" @change="updateExportItems")
</template>
<script>
import { mapState, mapActions } from 'vuex'
import CtrlSwitchValues from './CtrlSwitchValues'
import { EXPORT_ITEMS } from '../../config/types'
export default {
  name: 'export-items',
  components: { CtrlSwitchValues },
  computed: {
    ...mapState({
      exportItems: state => state.config.exportItems
    }),
    values () {
      return Object.values(EXPORT_ITEMS)
    }
  },
  methods: {
    ...mapActions(['updateExportItems'])
  }
}
</script>
