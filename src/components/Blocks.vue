<template lang="pug">
  .blocks-page
    h1 blocks
    template(v-if='page.data')
      table
        thead
          tr
            th(v-for='field in fields') {{ field }}
        tbody
          tr(v-for='row in page.data')
            template(v-for='field in fields') 
              td(v-if='!isArray(row[field])') {{ row[field] }}
              td(v-else) {{ row[field].length }}
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'blocks',
  data () {
    return {
      fields: ['number', 'hash', 'transactions']
    }
  },
  computed: {
    ...mapGetters({
      now: 'getDate',
      page: 'getPage',
      account: 'getPageAccount'
    })
  },
  methods: {
    isArray (val) {
      return Array.isArray(val)
    }
  }

}
</script>

