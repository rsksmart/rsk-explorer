<template lang="pug">
  .section
    .error(v-if='error')
      h2 {{error.error || 'ERROR'}}
    template(v-if='!error')
      .messages(v-if='msgs')
        message(v-for='msg,key in messages' :message='msg' :key='key' :data='data' :parentData='parentData')
      //- Transactions filters
      tx-filters.frame(v-if='action === "getTransactions"' :q='q' :module='module' :reqKey='reqKey')
      paginator(v-if='isTable' :options='pageOptions' :link='0')

    //- Component
    template(v-if='component && data')
        component(:is='component' :data='data' :type='dataType' :parentData='parentData' :delayed='delayed')
    //- Generic render
    template(v-else)
        template(v-if='isTable')
          data-table(:page='page' :type='dataType' :sort='sort' :parentData='parentData')
        template(v-else)
          data-item(:data='data' :type='dataType' :parentData='parentData' :delayed='delayed')

    paginator(v-if='isTable' :options='pageOptions' :link='0')

</template>
<script>
import { mapGetters } from 'vuex'
import ToolTip from './ToolTip'
import DataTable from './DataTable'
import DataItem from './DataItem'
import Paginator from './Paginator'
import TxFilters from './TxFilters'
import Spinner from './Spinner'
import Message from './Message'
export default {
  name: 'data-section',
  components: {
    DataTable,
    DataItem,
    ToolTip,
    Paginator,
    TxFilters,
    Spinner,
    Message
  },
  props: [
    'module', 'dataType', 'component', 'action', 'reqKey', 'msgs', 'updateOnNewBlock'
  ],
  data () {
    return {
      unwatch: undefined
    }
  },
  created () {
    const { updateOnNewBlock, $store, reqKey, data } = this
    const vm = this
    if (updateOnNewBlock) {
      this.unwatch = $store.watch(
        (state, getters) => getters.isResponseBlockUpdated(reqKey),
        (newValue, oldValue) => {
          if (newValue === false && oldValue === true) {
            const isCb = (typeof updateOnNewBlock === 'function')
            const update = (isCb) ? updateOnNewBlock(data || {}) : true
            if (update) vm.$emit('update')
          }
        }
      )
    }
  },
  beforeDestroy () {
    if (this.unwatch) this.unwatch()
  },
  computed: {
    page () {
      return this.getPage()(this.reqKey)
    },
    delayed () {
      return this.page?.delayed
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
    isTable () {
      return (this.data) ? this.isArray(this.data) : false
    },
    tableFields () {
      return (this.isTable) ? this.fields || Object.keys(this.data[0]) : null
    },
    pageOptions () {
      const options = this.page.pages || {}
      options.key = this.reqKey
      return options
    },
    key () {
      return this.dataKey()(this.dataType)
    },
    sort () {
      return this.getSavedSort()(this.module, this.action)
    },
    q () {
      return this.getSavedQ()(this.module, this.action)
    },
    requesting () {
      return this.isRequesting()(this.reqKey)
    },
    error () {
      return (this.page) ? this.page.error : null
    },
    messages () {
      let { msgs, data, parentData } = this
      if (typeof msgs === 'function') msgs = msgs(data, parentData)
      return msgs || []
    }
  },
  methods: {
    ...mapGetters([
      'dataKey',
      'getSavedSort',
      'getSavedQ',
      'getPage',
      'isRequesting',
      'pageError'
    ]),
    isArray (val) {
      return Array.isArray(val)
    }
  }
}
</script>
<style lang="stylus"></style>
