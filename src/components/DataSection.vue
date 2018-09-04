<template lang="pug">
  .section
    spinner(v-if='requesting && !error')
    .error(v-if='error')
      h2 {{error.error || 'ERROR'}}
    template(v-else)
      //- Transactions filters
      tx-filters.frame(v-if='action === "getTransactions"' :q='q' :type='type' :action='action')
      paginator(v-if='isTable' :options='pageOptions' :link='0')
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
    template(v-if='component && data')
        component(:is='component' :data='data' :type='dataType' :parentData='parentData' :delayed='delayed')
    //- Generic render
    template(v-else)
        template(v-if='isTable')
          data-table(:page='page' :type='dataType' :sort='sort' :parentData='parentData')
        template(v-else)
          data-item(:data='data' :type='dataType' :parentData='parentData' :delayed='delayed')

    template(v-if='isTable')
      paginator(:options='pageOptions' :link='0')

</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import ToolTip from './ToolTip'
import DataTable from './DataTable'
import DataItem from './DataItem'
import Paginator from './Paginator'
import TxFilters from './TxFilters'
import Spinner from './Spinner'
export default {
  name: 'data-section',
  components: {
    DataTable,
    DataItem,
    ToolTip,
    Paginator,
    TxFilters,
    Spinner
  },
  props: [
    'type', 'dataType', 'component', 'action', 'reqKey'
  ],
  computed: {
    page () {
      return this.getPage()(this.reqKey)
    },
    delayed () {
      return this.page.delayed
    },
    data () {
      return (this.page) ? this.page.data : null
    },
    parentPage () {
      return this.getPage()('parentData')
    },
    parentData () {
      return (this.parentPage) ? this.parentPage.data : {}
    },
    prev () {
      return (this.page) ? this.page.prev : null
    },
    next () {
      return (this.page) ? this.page.next : null
    },
    total () {
      return (this.page) ? this.page.total : null
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
    },
    requesting () {
      return this.requestingPageData()(this.reqKey)
    },
    error () {
      return (this.page) ? this.page.error : null
    }
  },
  methods: {
    ...mapActions([
      'fetchRouteData'
    ]),
    ...mapGetters([
      'dataKey',
      'getSavedSort',
      'getSavedQ',
      'getPage',
      'requestingPageData',
      'pageError'
    ]),
    isArray (val) {
      return Array.isArray(val)
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
</style>
