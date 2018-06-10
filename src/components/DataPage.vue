<template lang="pug">
  .data-page.centered
    paginator(v-if='isTable && !headComponent' :options='pageOptions' :link='0')
    spinner(v-if='requestingPageData && !error')
    .error(v-if='error')
      h1 {{error.error || 'ERROR'}}
    template(v-else) 
      h2.title(v-if='pageTitle && data') {{ pageContext }} {{pageTitle}}
      //- Header
      .page-header(v-if='headComponent')
        component(:is='headComponent' :data='parentData' :type='headType')
        paginator(v-if='isTable' :options='pageOptions' :link='0')
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
            component(:is='component' :data='data' :token='token')
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
import Paginator from './Paginator.vue'
import ToolTip from './ToolTip.vue'
import DataTable from './DataTable.vue'
import DataItem from './DataItem.vue'
import TxFilters from './TxFilters.vue'
export default {
  name: 'data-page',
  components: {
    Spinner,
    DataTable,
    DataItem,
    Paginator,
    ToolTip,
    TxFilters
  },
  props: [
    'type',
    'dataType',
    'action',
    'component',
    'title',
    'keyData',
    'headComponent',
    'headType'
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
      query: 'getQuery'
    }),
    data () {
      let key = this.keyData
      let data = this.page.data
      if (data) return (key) ? data[key] : data
    },
    parentData () {
      return this.page.parentData
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
      if (undefined === this.title) return this.$route.name
      let title = this.title
      if (title) {
        let data = this.data || {}
        let parentData = this.parentData || {}
        return (typeof (title) === 'function') ? title(data, parentData) : title
      }
    },
    pageContext () {
      let name = this.data.name || null
      return name
    },
    isTable () {
      return (this.data) ? this.isArray(this.data) : false
    },
    tableFields () {
      if (this.isTable) {
        return this.fields || Object.keys(this.data[0])
      }
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
      return this.getSavedQ()(this.type, this.action)
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
  .page-header
    width 100%

  .data-page h2.title
    text-transform capitalize
    // align-self flex-start

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

