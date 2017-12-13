<template lang="pug">
  .account
    ul.account-balance.box
      h3 Balance: 
        span(v-if='balance') {{balance | token-value}} {{token.shortName}}
        span(v-else) {{ balance }}
      
    contract-events(:data='data.account' :token='token')



          
</template>
<script>
import { mSecondsAgo } from '../filters/TimeFilters'
import { tokenValue } from '../filters/TokensFilters'
import ContractEvents from './ContractEvents.vue'
export default {
  name: 'ContractAccount',
  components: {
    ContractEvents
  },
  filters: {
    mSecondsAgo,
    tokenValue
  },
  props: ['data', 'token'],
  computed: {
    balance () {
      let balance = this.data.balance
      return balance.balance || 0
    }
  }

}
</script>

