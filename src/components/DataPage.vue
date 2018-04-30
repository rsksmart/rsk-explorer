<template lang="pug">
  .data-page.centered
    paginator(v-if='isTable' :options='pageOptions' :link='0')
    h2(v-if='title') {{ pageContext }} {{pageTitle}}
    spinner(v-if='requestingPageData && !error')
    .error(v-if='error')
      h1 {{error.error || 'ERROR'}}
    template(v-else) 
      .page-header(v-if='headComponent')
        account-header(v-if='isHeadComponent("AccountHeader")' :data='parentData')
      .page(v-if='data')
        //- Transactions filters
        tx-filters.frame(v-if='action === "getTransactions"' :q='q' :type='type' :action='action')
          
        template(v-if='!isTable')
          ul.prev-next
            li.prev(v-if='prev') 
              router-link(:to='routeParams(prev)')
                icon(name='triangle-arrow-left')
                small previous
            li.total(v-if='total')
              span {{total}}  
            li.next(v-if='next')
              router-link(:to='routeParams(next)')
                small next
                icon(name='triangle-arrow-right')
               
        //- Component
        template(v-if='component')
            //- Event
            contract-events(v-if='isComponent("ContractEvents")' :data='data' :token='token')
            contract-accounts(v-if='isComponent("ContractAccounts")' :data='data' :token='token')
            account(v-if='isComponent("Account")' :data='data' :token='token')
        //- Generic render
        template(v-else)
            template(v-if='isTable')
              data-table(:data='data' :type='dataType' :sort='sort' :parentData='parentData')
            template(v-else)
              data-item(:data='data' :type='dataType' :parentData='parentData')

        template(v-if='isTable')
          paginator(:options='pageOptions' :link='0')


</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import Spinner from './Spinner.vue'
import ContractEvents from './ContractEvents.vue'
import ContractAccounts from './ContractAccounts.vue'
import Account from './Account.vue'
import Paginator from './Paginator.vue'
import ToolTip from './ToolTip.vue'
import DataTable from './DataTable.vue'
import DataItem from './DataItem.vue'
import AccountHeader from './AccountHeader.vue'
import TxFilters from './TxFilters.vue'
export default {
  name: 'data-page',
  components: {
    Spinner,
    DataTable,
    DataItem,
    ContractEvents,
    ContractAccounts,
    Account,
    Paginator,
    ToolTip,
    AccountHeader,
    TxFilters
  },
  props: [
    'type',
    'dataType',
    'action',
    'component',
    'title',
    'keyData',
    'headComponent'
  ],
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
      getTokenData: 'getTokenData',
      query: 'getQuery'
    }),
    data () {
      let key = this.keyData
      let data = this.page.data
      if (data) return (key) ? data[key] : data
    },
    parentData () {
      let data = this.page.parentData
      if (this.isErc20) return this.token
      return data
    },
    prev () {
      return this.page.prev
    },
    next () {
      return this.page.next
    },
    total () {
      return this.page.total
    },
    pageTitle () {
      if (undefined !== this.title) return this.title
      return this.$route.name
    },
    pageContext () {
      if (this.isErc20) return this.token.name
    },
    isTable () {
      return (this.data) ? this.data.length : null
    },
    tableFields () {
      if (this.isTable) {
        return this.fields || Object.keys(this.data[0])
      }
    },
    isErc20 () {
      return (this.type === 'erc20')
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
    },
    key () {
      return this.dataKey()(this.dataType)
    },
    sort () {
      return this.getSavedSort()(this.type, this.action)
    },
    q () {
      let query = this.query
      return (query && query.q) ? query.q : this.getSavedQ()(this.type, this.action)
    }
  },
  methods: {
    ...mapActions([
      'fetchRouteData'
    ]),
    ...mapGetters([
      'dataKey',
      'getSavedSort',
      'getSavedQ'
    ]),
    isArray (val) {
      return Array.isArray(val)
    },
    getData () {
      let type = this.type
      let action = this.action
      return this.fetchRouteData({ action, type })
    },
    isComponent (c) {
      return (this.component === c)
    },
    isHeadComponent (c) {
      return (this.headComponent === c)
    },
    routeParams (data) {
      let params = Object.assign({}, this.$route.params)
      let key = this.key
      let name = this.$route.name
      if (data && key && params) {
        params[key] = data[key]
        return { params, name }
      }
    }
  }
}
</script>
<style lang="stylus">
  .page
    will-change opacity
    animation-name page-anim
    animation-duration 0.3s
    animation-timing-function ease-in

    @keyframes page-anim
      0%
        opacity 0

      100%
        opacity 1

  .page-header
    margin-bottom 2em
</style>

