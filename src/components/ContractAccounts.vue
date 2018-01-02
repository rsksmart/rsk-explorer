<template lang="pug">
  .accounts
    data-table(:data='data' :fieldsCb='formatFields' type='accounts')
</template>
<script>
import DataTable from './DataTable.vue'
export default {
  name: 'ContractAccount',
  components: {
    DataTable
  },
  props: ['data', 'token'],
  methods: {
    formatFields (fields) {
      fields.balance.suffix = this.token.shortName
      return fields
    }
  }
}
</script>

