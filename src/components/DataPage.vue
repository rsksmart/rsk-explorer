<template lang="pug">
  .data-page.centered
    h2.title(v-if='pageTitle') {{pageTitle}}
    spinner(v-if='(requesting && !error && !delayed.fields) || delayed.registry')
    error-page(v-if='error' :error='error')
    .update-error(v-if='updateError')
      h3
        span Update Error:&nbsp;
        small {{updateError.error}}
    template(v-if='!error')
      .messages(v-if='pageMessages')
        message(v-for='msg,key in pageMessages' :message='msg' :key='key' :data='data')
      //- Header
      .page-header(v-if='mainContent')
        item-navigator(v-if='!isTable' :next='next' :prev='prev' :total='total' :regKey='dataKey()(dataType)')

        .tabs
          .tabs-titles(v-if='page.data')
            template(v-for='tab in mainContentTabs')
              button.btn.tab-title(v-if='tab.name' @click='setActiveContentTab(tab.name,$event)'
               :class='tabTitleCss(isActiveContentTab(tab))')
                span.title {{ tab.name }} {{ (undefined !== tab.total) ? `(${tab.total})` : '' }}
                icon(v-if='tab.buttonIcon' :name='tab.buttonIcon')
            export-controls(v-if='data' :data='page.data' :type='dataType')
        data-section( v-if='activeContentTab'
          :component='activeContentTab.component' :reqKey='reqKey' :module='module'
          :dataType='activeContentTab.dataType || dataType' :action='action' :updateOnNewBlock='updateOnNewBlock' @update='updateSection')
      .page(v-if='data')
        data-section(v-if='!tabs && !activeContentTab' :module='module' :dataType='dataType'
          :reqKey='reqKey' :component='component' :action='action' :updateOnNewBlock='updateOnNewBlock' @update='updateSection')
        .tabs(v-if='tabs && data && !hideTabs')
          //- Tabs titles
          .tabs-titles(v-if='page.data')
            template(v-for='tab in tabs')
              template(v-if='renderTab(tab)')
                template(v-if='isRequesting()(tab.name)')
                  button.btn.tab-title
                    loading-circle(:size='10')
                    span.title {{ getTabTitle(tab) }}
                template(v-else)
                  button.btn.tab-title(@click='setTab(tab.name,$event)' :class='tabTitleCss(isActiveTab(tab))')
                    span.title {{ getTabTitle(tab) }}
                      small.small(v-if='tabsTotals[tab.name] !== null') &nbsp; ({{ tabsTotals[tab.name] }})

          template(v-for='tab in tabs')
            template(v-if='isActiveTab(tab)')
              spinner(v-if='isRequesting()(tab.name)')
              data-section.tab-content(v-else :module='tab.module' :dataType='tab.dataType'
              :reqKey='tab.name' :action='tab.action' :msgs='tab.msgs')

</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { plainObjectChanges } from '../lib/js/utils'
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
    $route: 'onRouteChange'
  },
  computed: {
    ...mapGetters({
      getActiveTab: 'getActiveTab',
      getActiveContentTab: 'getActiveContentTab',
      routeParams: 'getRouterParams'
    }),
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
      return this.getPage()(this.reqKey) || {}
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
      return this.page.data
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
    onRouteChange (to, from) {
      if (to.path === from.path) {
        // check for query changes
        const diff = plainObjectChanges(to.query, from.query)
        const keys = Object.keys(diff)
        // dont fetch
        if (!keys.length) return
        if (keys.length === 1 && keys[0].slice(0, 2) === '__') return
      }
      this.getData()
    },

    async getData () {
      let { module, tabs, action, params } = this
      const key = this.reqKey
      if (!module || !action) return
      await this.fetchRouteData({ action, params, module, key })
      if (tabs) {
        const active = this.activeTab
        if (active) {
          await this.fetchTab(active)
          tabs = tabs.filter(tab => tab.name !== active)
        }
        for (const tab of tabs) {
          this.fetchTab(tab.name)
        }
      }
    },

    async fetchTab (tabName) {
      const tab = Object.assign({}, this.getTab(tabName))
      let params = tab.params
      params = (params && typeof params === 'function') ? params(this.routeParams) : params
      params = params || {}
      params.count = true // WIP get totals in first request only
      tab.params = params
      tab.count = true
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
    text-transform uppercase
    color white
    // align-self flex-start

  .page-header
    margin-bottom 2em

  .messages
    font-size 0.9em
    text-align center
</style>
