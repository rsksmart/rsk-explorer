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
      .messages(v-if='msgs')
        message(v-for='msg,key in msgs' :message='msg' :key='key' :data='data')
      //- Header
      .page-header(v-if='mainContent')
        .tabs
          .tabs-titles
            template(v-for='tab in mainContentTabs')
              button.btn.tab-title.link(v-if='tab.name' @click='setActiveContentTab(tab.name)'
               :class='tabTitleCss(isActiveContentTab(tab))')
                span.title {{tab.name}} {{ (undefined !== tab.total) ? `(${tab.total})` : '' }}
        data-section( v-if='activeContentTab'
          :component='activeContentTab.component' :reqKey='reqKey' :module='module'
          :dataType='activeContentTab.dataType || dataType' :action='action')
      .page(v-if='data')
        data-section(v-if='!tabs && !activeContentTab' :module='module' :dataType='dataType'
          :reqKey='reqKey' :component='component' :action='action')
        .tabs(v-if='tabs && data')
          .tabs-titles
            template(v-for='tab in tabs')
              template(v-if='renderTab(tab)')
                template(v-if='requestingPageData()(tab.name)')
                  button.btn.tab-title.link
                    loading-circle(:size='10')
                    span.title {{tab.name}}
                template(v-else)
                  button.btn.tab-title.link(@click='setTab(tab.name)' :class='tabTitleCss(isActiveTab(tab))')
                    span.title {{tab.name}}
                      small.small ({{ getPageTotal()(tab.name) }})

          template(v-for='tab in tabs')
            data-section.tab-content(v-if='isActiveTab(tab)'
              :module='tab.module' :dataType='tab.dataType' :reqKey='tab.name' :action='tab.action' :msgs='tab.msgs')
            spinner(v-if='requestingPageData()(tab.name)')

</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import Spinner from './Spinner.vue'
import LoadingCircle from './LoadingCircle.vue'
import DataSection from './DataSection'
import ErrorPage from './ErrorPage'
import Message from './Message'
export default {
  name: 'data-page',
  components: {
    Spinner,
    DataSection,
    ErrorPage,
    Message,
    LoadingCircle
  },
  props: [
    'module',
    'dataType',
    'action',
    'component',
    'title',
    'mainContent',
    'headType',
    'tabs',
    'rKey',
    'msgs'
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
      query: 'getQuery',
      getActiveTab: 'getActiveTab',
      getActiveContentTab: 'getActiveContentTab'
    }),
    error () {
      return this.pageError()(this.reqKey)
    },
    updateError () {
      return this.page.updateError
    },
    page () {
      return this.getPage()(this.reqKey) || {}
    },
    delayed () {
      return this.page.delayed || {}
    },
    data () {
      return this.page.data
    },
    pageTitle () {
      if (undefined === this.title) return this.$route.name
      let title = this.title
      if (title) {
        let data = this.data || {}
        return (typeof title === 'function') ? title(data) : title
      }
      return ''
    },
    reqKey () {
      if (this.rKey) return this.rKey
      return (this.tabs) ? 'parentData' : 'data'
    },
    requesting () {
      return this.requestingPageData()(this.reqKey)
    },
    activeTab () {
      let tab = (this.tabs.length) ? this.tabs[0].name : null
      return this.getActiveTab || tab
    },
    activeContentTab () {
      let tabs = this.mainContent || []
      if (!tabs.length) return
      let tabName = this.getActiveContentTab || tabs[0].name
      let tab = tabs.find(tab => tab.name === tabName)
      return tab
    },
    mainContentTabs () {
      let tabs = this.mainContent || []
      tabs = tabs.map(tab => {
        let render = tab.render
        render = (render && typeof render === 'function') ? render(this.data) : render
        tab.render = render
        let count = tab.count
        if (count && typeof count === 'function') tab.total = count(this.data)
        return tab
      })
      return tabs.filter(tab => { return (undefined !== tab.render) ? tab.render : true })
    }
  },
  methods: {
    ...mapActions([
      'fetchRouteData'
    ]),
    ...mapGetters([
      'requestingPageData',
      'getPage',
      'getPageTotal',
      'pageError'
    ]),
    setTab (tab) {
      this.updateRouterQuery('tab', tab)
    },
    setActiveContentTab (name) {
      this.updateRouterQuery('cTab', name)
    },
    isActiveContentTab (tab) {
      return this.activeContentTab.name === tab.name
    },
    updateRouterQuery (key, value) {
      let query = Object.assign({}, this.$route.query)
      query[key] = value
      this.$router.push({ query })
    },
    renderTab (tab) {
      const render = tab.render
      if (typeof render === 'function') return render(this.data)
      return (undefined === render) ? true : render
    },
    getData () {
      let module = this.module
      let tabs = this.tabs
      let action = this.action
      let key = this.reqKey
      if (module && action) {
        this.fetchRouteData({ action, module, key }).then(() => {
          if (tabs) {
            for (let tab of tabs) {
              tab.module = tab.module || module
              tab.key = tab.key || tab.name
              this.fetchRouteData(tab)
            }
          }
        })
      }
    },
    isActiveTab (tab) {
      return this.activeTab === tab.name
    },
    tabTitleCss (active) {
      return (active) ? ['active'] : []
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

  .page, .section
    will-change opacity
    animation-name page-anim
    animation-duration 0.5s
    animation-timing-function ease-in
    opacity 1

    @keyframes page-anim
      0%
        opacity 0

      100%
        opacity 1

  .page-header
    margin-bottom 2em

  .messages
    font-size 0.9em
    text-align center
</style>
