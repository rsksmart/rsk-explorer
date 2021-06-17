
<template lang="pug">
  .wrapper#app.app
    .top-page(v-if='topMsg')
      message.top-msg(:message='topMsg')
    //-.header(:class='(bigMenu) ? "big-menu" : ""')
    .header.sticky-header
      transition(name='head-trans')
        header.w-trans
          .brand(@click='goHome' @touchstart.passive='goHome')
              .logo
                include assets/svg/sovryn-logo-white.svg
              .title
                h1.logo.green
                  icon(:name='"rsk"')
                  span rsk
                  span.title-comment explorer
                sub.net.yellow {{networkName}}
          .header-content
            search-box
          .nav(:class='(menu) ? "open":""')
            .burger
              button(@click='toggleMenu')
                icon(:name='(!menu) ? "menu" : "close"')
            nav.menu(:class='(menu) ? "enabled":""')
              ul
                template(v-for='m in menuItems')
                  li(v-if='m.key !== "home" || !isRoute("home")' @click='toggleMenu')
                    router-link(:to='"/" + m.path' :title='(!m.title)?m.key:null')
                      icon.icon(v-if='m.icon' :name='getIcon(m.icon)')
                      span(v-if='m.title') {{m.title}}
    connection-status(v-if='!connected')
    .main
      router-view
    .footer
      footer
        .text
          ul.plain
            li(v-for='item in content.footer')
              template(v-if="typeof item ==='object'")
                a(v-if='item.link' :href='item.link')
                  strong {{item.text}}
              span(v-else) {{ item }}
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import ConnectionStatus from './components/ConnectionStatus.vue'
import ToolTip from './components/ToolTip.vue'
import SearchBox from './components/SearchBox.vue'
import Message from './components/Message.vue'
import './icons'
export default {
  name: 'app',
  components: {
    ConnectionStatus,
    SearchBox,
    ToolTip,
    Message
  },
  data () {
    return {
      resizeTimeout: null,
      menu: false
    }
  },
  created () {
    this.$store.dispatch('init')
  },
  mounted () {
    this.onResize()
    window.addEventListener('resize', this.resizeThrottler, false)
    window.addEventListener('focus', this.onFocus, false)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeThrottler)
    window.removeEventListener('focus', this.onFocus)
  },
  computed: {
    ...mapState({
      connected: state => state.socketConnected,
      errors: state => state.socketErrors,
      route: state => state.route,
      menuItems: state => state.menuItems,
      content: state => state.content,
      net: state => state.backend.systemSettings.net
    }),
    ...mapGetters({
      appSize: 'getSize',
      dbIsOutdated: 'dbIsOutdated'
    }),
    ...mapGetters(['networkName']),
    bigMenu () {
      return this.isRoute('home')
    },
    topMsg () {
      return (this.dbIsOutdated) ? 'DB_OUTDATED' || null : null
    }
  },
  methods: {
    ...mapActions([
      'setSize'
    ]),
    ...mapGetters({
      getEntity: 'dataEntity'
    }),
    isRoute (name) {
      return name === String(this.route.name).toLowerCase()
    },
    toggleMenu () {
      this.menu = !this.menu
    },
    goHome (event) {
      this.$router.push({ path: '/Home' }).catch(() => { })
    },
    getIcon (name) {
      if (name === 'home') return 'rsk'
      const entity = this.getEntity()(name)
      return (entity) ? entity.icon || name : name
    },
    onResize () {
      const size = {
        w: this.$el.clientWidth,
        h: this.$el.clientHeight
      }
      this.setSize(size)
    },
    resizeThrottler () {
      this.menu = false
      if (!this.resizeTimeout) {
        const vm = this
        this.resizeTimeout = setTimeout(() => {
          vm.resizeTimeout = null
          vm.onResize()
        }, 66)
      }
    },
    onFocus () {
      this.$store.dispatch('setDateInterval')
    }
  }
}
</script>
<style src="vue-d3-barchart/dist/vue-d3-barchart.css"></style>
<style lang="stylus">
@import 'lib/styl/style.styl'
@import 'lib/styl/mixins.styl'

.w-trans
  transition opacity 1s ease
  opacity 1

.head-trans-enter-active
  opacity 0

.top-page
  flex-centered()
  font-size 0.9em
  text-shadow $txt-sh
  background $darkness-odd
  border-bottom 1px solid $darkness-even

.menu
  font-size 0.9em
</style>
