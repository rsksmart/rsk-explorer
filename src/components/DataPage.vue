<template>
  <div class="data-page centered">
    <h2 class="title" v-if="titleDescription">{{ titleDescription }}</h2>
    <spinner v-if="(requesting && !error && !delayed.fields) || delayed.registry"></spinner>
    <error-page v-if="error" :error="error"></error-page>
    <div class="update-error" v-if="updateError">
      <h3>
        <span>Update Error:&nbsp;</span>
        <small>{{ updateError.error }}</small>
      </h3>
    </div>
    <template v-if="!error">
      <div class="messages" v-if="pageMessages">
        <message v-for="(msg, key) in pageMessages" :message="msg" :key="key" :data="data"></message>
      </div>
      <!-- Header -->
      <div class="page-header" v-if="mainContent">
        <item-navigator v-if="!isTable" :next="next" :prev="prev" :total="total" :regKey="dataKey()(dataType)"></item-navigator>
        <div class="tabs">
          <div class="tabs-titles" v-if="page.data">
            <template v-for="tab in mainContentTabs">
              <button class="btn tab-title" :key="tab.name" v-if="tab.name" @click="setActiveContentTab(tab.name, $event)" :class="tabTitleCss(isActiveContentTab(tab))">
                <span class="title">{{ tab.name }} {{ (undefined !== tab.total) ? `(${tab.total})` : '' }}</span>
                <icon v-if="tab.buttonIcon" :name="tab.buttonIcon"></icon>
              </button>
            </template>
            <export-controls v-if="data" :data="page.data" :type="dataType"></export-controls>
          </div>
          <data-section v-if="activeContentTab" :component="activeContentTab.component" :reqKey="reqKey" :module="module" :dataType="activeContentTab.dataType || dataType" :action="action" :updateOnNewBlock="updateOnNewBlock" @update="updateSection"></data-section>
        </div>
      </div>
      <div class="page" v-if="data">
        <data-section v-if="!tabs && !activeContentTab" :module="module" :dataType="dataType" :reqKey="reqKey" :component="component" :action="action" :updateOnNewBlock="updateOnNewBlock" @update="updateSection"></data-section>
        <div class="tabs" v-if="tabs && data && !hideTabs">
          <!-- Tabs titles -->
          <div class="tabs-titles" v-if="page.data">
            <template v-for="(tab, i) in tabs">
              <template v-if="renderTab(tab)">
                <template v-if="isRequesting()(tab.name)">
                  <button :key="tab.dataType" class="btn tab-title">
                    <loading-circle :size="10"></loading-circle>
                    <span class="title">{{ getTabTitle(tab) }}</span>
                  </button>
                </template>
                <template v-else>
                  <button :key="`${tab.name}-${i}`" class="btn tab-title" @click="setTab(tab.name, $event)" :class="tabTitleCss(isActiveTab(tab))">
                    <span class="title">{{ getTabTitle(tab) }}
                      <small class="small" v-if="tabsTotals[tab.name] !== null">&nbsp; ({{ tabsTotals[tab.name] }})</small>
                    </span>
                  </button>
                </template>
              </template>
            </template>
          </div>
          <template v-for="(tab, i) in tabs">
            <template v-if="isActiveTab(tab)">
              <spinner :key="tab.action" v-if="isRequesting()(tab.name)"></spinner>
              <data-section :key="`${tab.module}-${i}`" class="tab-content" v-else :module="tab.module" :dataType="tab.dataType" :reqKey="tab.name" :action="tab.action" :msgs="tab.msgs"></data-section>
            </template>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import Spinner from './Spinner.vue'
import LoadingCircle from './LoadingCircle.vue'
import DataSection from './DataSection'
import ErrorPage from './ErrorPage'
import Message from './Message'
import ItemNavigator from './ItemNavigator'
import ExportControls from './ExportControls'
import common from '../mixins/common'
export default {
  name: 'data-page',
  components: {
    Spinner,
    DataSection,
    ErrorPage,
    Message,
    LoadingCircle,
    ItemNavigator,
    ExportControls
  },
  mixins: [
    common
  ],
  props: [
    'module',
    'dataType',
    'action',
    'params',
    'component',
    'title',
    'mainContent',
    'headType',
    'tabs',
    'rKey',
    'msgs',
    'updateOnNewBlock'
  ],
  created () {
    this.getData()
  },
  watch: {
    $route: 'onRouteChange',
    pageTitle (newTitle, oldTitle) {
      if (newTitle && typeof newTitle === 'string' && newTitle !== oldTitle) {
        this.storedTitle = newTitle
      }
    }
  },
  data () {
    return {
      storedTitle: '',
      isGetAddressLoaded: false
    }
  },
  computed: {
    ...mapGetters({
      getActiveTab: 'getActiveTab',
      getActiveContentTab: 'getActiveContentTab',
      routeParams: 'getRouterParams'
    }),
    titleDescription () {
      return this.pageTitle || this.storedTitle
    },
    hideTabs () {
      const active = this.activeContentTab || {}
      return active.hideTabs
    },
    query () {
      const key = this.reqKey
      return this.getQuery()(key)
    },
    error () {
      return this.pageError()(this.reqKey)
    },
    updateError () {
      return this.page.updateError
    },
    page () {
      const page = this.getPage()(this.reqKey) || {}
      return page
    },
    prev () {
      return this.page.prev || null
    },
    next () {
      return this.page.next || null
    },
    total () {
      return this.page.total || null
    },
    isTable () {
      const { data } = this.page
      return (data && Array.isArray(data))
    },
    delayed () {
      return this.page.delayed || {}
    },
    data () {
      const data = this.page.data
      return data
    },
    pageTitle () {
      if (undefined === this.title) return this.$route.name
      const title = this.title
      if (title) {
        const data = this.data || {}
        return (typeof title === 'function') ? title(data) : title
      }
      return ''
    },
    reqKey () {
      if (this.rKey) return this.rKey
      return (this.tabs) ? 'parentData' : 'data'
    },
    requesting () {
      return this.isRequesting()(this.reqKey)
    },
    activeTab () {
      const tabs = this.tabs || []
      const tab = (tabs.length) ? tabs[0].name : null
      let name = this.getActiveTab || tab
      if (!this.selectTabByName(name)) {
        name = tab
        this.setTab(name)
      }
      return name
    },
    activeContentTab () {
      const tabs = this.mainContent || []
      if (!tabs.length) return
      const tabName = this.getActiveContentTab || tabs[0].name
      const tab = tabs.find(tab => tab.name === tabName) || tabs[0]
      // reset tab if don't exist
      if (tab.name !== tabName) this.setActiveContentTab(tab.name)
      return tab
    },

    mainContentTabs () {
      const tabs = this.mainContent || []
      const { data } = this
      // execute count and render callbacks
      return tabs.filter(tab => {
        const render = (typeof tab.render === 'function') ? tab.render(data) : true
        const count = tab.count
        const icon = (typeof tab.icon === 'function') ? tab.icon(data) : tab.icon
        tab.buttonIcon = icon
        if (count && typeof count === 'function') tab.total = count(data)
        return render
      })
    },
    tabsTotals () {
      return this.tabs.reduce((v, a, i) => {
        const { name } = a
        v[name] = this.getPageTotal()(name)
        return v
      }, {})
    },
    pageMessages () {
      let { msgs, data } = this
      if (typeof msgs === 'function') msgs = msgs(data)
      return msgs
    }
  },
  methods: {
    getDataTest () {
      this.fetchTab(this.tabs[0].name)
    },
    ...mapActions([
      'fetchRouteData',
      'updateRouterQuery'
    ]),
    ...mapGetters([
      'isRequesting',
      'getPage',
      'getPageTotal',
      'pageError',
      'isRequested',
      'dataKey',
      'getQuery'
    ]),
    setTab (tab, event) {
      this.updateRouterTabQuery('__tab', tab, event)
    },
    setActiveContentTab (name, event) {
      this.updateRouterTabQuery('__ctab', name, event)
    },
    isActiveContentTab (tab) {
      const active = this.activeContentTab || {}
      return active.name === tab.name
    },
    updateRouterTabQuery (key, value, event) {
      const hash = this.getRouterHashFromEvent(event)
      const query = { [key]: value }
      this.updateRouterQuery({ query, hash, key })
    },
    renderTab (tab) {
      const render = tab.render
      const { name } = tab
      const { data, tabsTotals } = this
      if (typeof render === 'function') return render(data, tabsTotals[name])
      return (undefined === render) ? true : render
    },
    onRouteChange () {
      this.getData()
    },
    async getData () {
      await this.getParentData()
      if (this.tabs) {
        await this.fetchTab()
      }
    },
    async getParentData () {
      const { module, action, params } = this
      const key = this.reqKey
      if (!module || !action) return
      if (!this.isGetAddressLoaded || action !== 'getAddress') {
        this.isGetAddressLoaded = true
        return this.fetchRouteData({ action, params, module, key })
      }
    },
    async fetchTab () {
      const tab = Object.assign({}, this.getTab(this.activeTab))
      let params = tab.params
      params = (params && typeof params === 'function') ? params(this.routeParams) : params
      params = params || {}
      params.count = false
      tab.params = params
      tab.count = false
      if (tab) {
        const req = await this.fetchRouteData(tab)
        return req
      }
    },

    selectTabByName (name) {
      return this.tabs.find(t => t.name === name)
    },

    isActiveTab (tab) {
      return this.activeTab === tab.name
    },

    getTab (name) {
      let tab = this.selectTabByName(name)
      tab = tab || {}
      tab.key = tab.key || tab.name
      tab.module = tab.module || this.module
      return tab
    },

    tabTitleCss (active) {
      return (active) ? ['active'] : []
    },

    getTabTitle (tab) {
      let { title, name } = tab
      if (typeof title === 'function') {
        title = title(this.data)
      }
      return title || name
    },
    updateSection () {
      return this.getData()
    }
  }
}
</script>
<style lang="stylus">
  .data-page
    align-self flex-start

  .page-header
    width 100%

  .data-page h2.title
    text-transform capitalize
    // align-self flex-start

  .page-header
    margin-bottom 2em

  .messages
    font-size 0.9em
    text-align center
</style>
