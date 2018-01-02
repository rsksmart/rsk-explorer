<template lang="pug">
  .data-page.centered
    h2(v-if='title') {{ pageContext }} {{pageTitle}}
    spinner(v-if='requestingPageData')
    .error(v-if='error')
      h1 {{error.error}}
    template(v-else) 
      .page(v-if='data')
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
            blocks(v-if='isComponent("Blocks")' :data='data')
            block(v-if='isComponent("Block")' :block='data' :next='next' :prev='prev')
            transactions(v-if='isComponent("Transactions")' :data='data')
        //- Generic render
        template(v-else)
            template(v-if='isTable')
              data-table(:data='data' :type='dataType' :parentData='token')
              //-table
                thead
                  tr
                    th(v-for='field in tableFields') {{field}}
                tbody  
                  tr(v-for='row in data')
                    template(v-for='field in tableFields')
                      td(v-if='isArray(row[field])') {{ row[field].length }}
                      template(v-else)
                        td(v-if='row[field].toString().length < 24') {{ row[field] }}
                        td(v-else)
                          tool-tip(:value='row[field].toString()' trim='6' :options='{trimAt:"center"}')
                        
                      
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
import Paginator from './Paginator.vue'
import Block from './Block.vue'
import ToolTip from './ToolTip.vue'
import DataTable from './DataTable.vue'
export default {
  name: 'data-page',
  components: {
    Spinner,
    DataTable,
    ContractEvents,
    ContractAccounts,
    Account,
    Paginator,
    ToolTip,
    Block
  },
  props: ['type', 'dataType', 'action', 'component', 'title'],
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
    prev () {
      return this.page.prev
    },
    next () {
      return this.page.next
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
    },
    key () {
      return this.dataKey()(this.dataType)
    }
  },
  methods: {
    ...mapActions([
      'fetchPageData'
    ]),
    ...mapGetters([
      'dataKey'
    ]),
    isArray (val) {
      return Array.isArray(val)
    },
    getData () {
      return this.fetchPageData(this.req)
    },
    isComponent (c) {
      return (this.component === c)
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
</style>

