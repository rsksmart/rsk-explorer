<template lang="pug">
  .transactions-page
    table
      thead
        tr
          th(v-for='field in fields') {{field}}
      tbody
        tr(v-for='row in data')
          td(v-for='field in fields') {{ row.transactions[field] }}
</template>
<script>
export default {
  name: 'transactions',
  props: ['data'],
  data () {
    return {
      fields: ['hash', 'blockNumber', 'from', 'to']
    }
  }
}
</script>

