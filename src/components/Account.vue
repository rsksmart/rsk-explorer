<template lang="pug">
  .account
    h2 {{token.name}} Account
    .box
      ul.account-balance
        li
          strong Address: 
          span {{data.balance._id}}
        li
          strong Balance: 
          span(v-if='balance') {{balance | token-value}} {{token.shortName}}
          span(v-else) {{ balance }}
    h3 Events
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
<style lang="stylus">
  .account-balance
    list-style none
    li
      font-size 1.25em
    strong 
      margin-right 1em 
</style>


