<template>
  <div class="section">
    <div class="error" v-if="error">
      <h2>{{ error.error || 'ERROR' }}</h2>
    </div>
    <template v-if="!error">
      <div class="messages" v-if="msgs">
        <message v-for="(msg, key) in messages" :message="msg" :key="key" :data="data" :parentData="parentData"></message>
      </div>
    </template>

    <!-- Component -->
    <div v-if="component && data">
      <implementation-address-field v-if="data.address && data.type" :data="parentData"/>
      <component :is="component" :data="data" :type="dataType" :parentData="parentData" :delayed="delayed"></component>
    </div>
    <!-- Generic render -->
    <template v-else>
      <template v-if="isTable">
        <data-table :page="page" :type="dataType" :sort="sort" :parentData="parentData"></data-table>
        <div v-if="data.length === 0" class="data-empty">
          <div class="empty">0x <icon name="tokens"/></div>
          <p class="info">There are currently no {{ reqKey }}</p>
        </div>
      </template>
      <template v-else>
        <data-item :data="data" :type="dataType" :parentData="parentData" :delayed="delayed"></data-item>
      </template>
    </template>

    <paginator v-if="isTable" :options="pageOptions" :link="0"></paginator>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import ToolTip from './ToolTip'
import DataTable from '@/components/General/DataTable'
import DataItem from './DataItem'
import Paginator from './Paginator'
import Spinner from './Spinner'
import Message from './Message'
import ImplementationAddressField from './ImplementationAddressField.vue'
export default {
  name: 'data-section',
  components: {
    DataTable,
    DataItem,
    ToolTip,
    Paginator,
    Spinner,
    Message,
    ImplementationAddressField
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
