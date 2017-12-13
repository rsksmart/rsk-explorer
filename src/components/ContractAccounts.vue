<template lang="pug">
  .accounts
    table
      thead
        tr
          template(v-for='field in fields')
            th {{field}} 
      tbody 
        tr(v-for='row in data')
          td 
            router-link(:to='token.baseUri + "account/" + row._id') {{row._id}}
          td {{row.balance | token-value}} {{token.shortName}}


          
</template>
<script>
import { mapGetters } from 'vuex'
import { mSecondsAgo } from '../filters/TimeFilters'
import { tokenValue } from '../filters/TokensFilters'
export default {
  name: 'ContractAccount',
  filters: {
    mSecondsAgo,
    tokenValue
  },
  props: ['data', 'token'],

  data () {
    return {
      fields: [
        'id',
        'balance'
      ]
    }
  },
  computed: {
    ...mapGetters({
      now: 'getDate'
    })
  }

}
</script>

