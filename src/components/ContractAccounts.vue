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
      let token = this.token
      let uri = token.baseUri + 'accounts/'
      let def = 'This Account'
      fields.link = uri
      fields.default = def
      fields.amount.suffix = token.shortName
      return fields
    }
  }
}
</script>

