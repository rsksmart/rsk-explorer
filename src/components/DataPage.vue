<template lang="pug">
  .data-page
    h2 {{ pageContext }} {{pageTitle}}
    spinner(v-if='requestingPageData')
    .error(v-if='error')
      pre {{error}}
    .page(v-if='data')
     //- Component
     template(v-if='component')
        //- Event
        contract-events(v-if='isComponent("ContractEvents")' :data='data' :token='token')
        contract-accounts(v-if='isComponent("ContractAccounts")' :data='data' :token='token')
        account(v-if='isComponent("Account")' :data='data' :token='token')
        blocks(v-if='isComponent("Blocks")')
        transactions(v-if='isComponent("Transactions")')


     //- Generic render
     template(v-else)
        template(v-if='isTable')
          table
            thead
              tr
                th(v-for='field in tableFields') {{field}}
            tbody  
              tr(v-for='row in data')
                td(v-for='field in tableFields') {{row[field]}}
        template(v-else)
          pre {{data}}
     
     template(v-if='isTable')
       paginator(:options='pageOptions' :link='0')
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import Spinner from './Spinner.vue'
import ContractEvents from './ContractEvents.vue'
import ContractAccounts from './ContractAccounts.vue'
import Account from './Account.vue'
import Blocks from './Blocks.vue'
import Transactions from './Transactions.vue'
import Paginator from './Paginator.vue'
export default {
  name: 'data-page',
  components: {
    Spinner,
    ContractEvents,
    ContractAccounts,
    Account,
    Blocks,
    Transactions,
    Paginator
  },
  props: ['type', 'action', 'fields', 'component'],
  created () {
    this.getData()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'getData'
  },
  computed: {
    ...mapGetters({
      requestingPageData: 'requestingPageData',
      page: 'getPage',
      error: 'pageError',
      paginator: 'pagePaginator',
      getTokenData: 'getTokenData'
    }),
    data () {
      return this.page.data
    },
    pageTitle () {
      return this.$route.name
    },
    pageContext () {
      if (this.isErc20) return this.token.name
    },
    isTable () {
      return this.data.length
    },
    tableFields () {
      if (this.isTable) {
        return this.fields || Object.keys(this.data[0])
      }
    },
    isErc20 () {
      return (this.type === 'erc20')
    },
    req () {
      let options = this.$route.params
      let type = this.type
      let action = this.action
      let page = this.$route.query.page
      options.page = page
      return { options, type, action, page }
    },
    token () {
      let token = null
      let address = this.$route.params.address
      if (this.isErc20 && address) {
        token = this.getTokenData(address)
        if (token) token.baseUri = '/tokens/' + address + '/'
      }
      return token
    },
    pageOptions () {
      return this.page.pages
    }
  },
  methods: {
    ...mapActions([
      'fetchPageData'
    ]),

    getData () {
      return this.fetchPageData(this.req)
    },
    isComponent (c) {
      return (this.component === c)
    }
  }
}
</script>
