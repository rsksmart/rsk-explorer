<template lang="pug">
  .data-page.centered
    spinner(v-if='requesting && !error')
    .error(v-if='error')
      h1 {{error.error || 'ERROR'}}
    template(v-else) 
      h2.title(v-if='pageTitle') {{pageTitle}}
      //- Header
      .page-header(v-if='headComponent')
        data-section(:component='headComponent' :reqKey='reqKey' :type='type' :dataType='headType || dataType' :action='action')
      .page(v-if='data')
        data-section(v-if='!tabs' :type='type' :dataType='dataType' :reqKey='reqKey' :component='component' :action='action')
        .tabs(v-if='tabs && data')
          .tabs-titles
            template(v-for='tab in tabs')
              template(v-if='renderTab(tab)')
                template(v-if='requestingPageData()(tab.name)')
                  //- Change it by tab spinner
                  button.btn.tab-title.link
                    span.title {{tab.name}} ...
                template(v-else)
                  button.btn.tab-title.link(@click='setTab(tab.name)' :class='tabTitleCss(tab)') 
                    span.title {{tab.name}} 
                      small.small ({{ getPageTotal()(tab.name) }})
          
          template(v-for='tab in tabs')
            data-section.tab-content(v-if='isActiveTab(tab)' 
              :type='type' :dataType='tab.dataType' :reqKey='tab.name' :action='tab.action')

</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import Spinner from './Spinner.vue'
import DataSection from './DataSection'
export default {
  name: 'data-page',
  components: {
    Spinner,
    DataSection
  },
  props: [
    'type',
    'dataType',
    'action',
    'component',
    'title',
    'headComponent',
    'headType',
    'tabs',
    'rKey'
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
      getActiveTab: 'getActiveTab'
    }),
    error () {
      return this.pageError()(this.reqKey)
    },
    page () {
      return this.getPage()(this.reqKey) || {}
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
      let query = Object.assign({}, this.$route.query)
      query.tab = tab
      this.$router.push({ query })
    },
    renderTab (tab) {
      const render = tab.render
      if (typeof render === 'function') return render(this.data)
      return (undefined === render) ? true : render
    },
    getData () {
      let type = this.type
      let tabs = this.tabs
      let action = this.action
      let key = this.reqKey
      if (type && action) {
        this.fetchRouteData({ action, type, key }).then(() => {
          if (tabs) {
            for (let tab of tabs) {
              tab.type = type
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
    tabTitleCss (tab) {
      return (this.isActiveTab(tab)) ? ['active'] : []
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
</style>

