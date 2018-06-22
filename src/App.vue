
<template lang="pug">
  .wrapper
    .top-page(v-if='topMsg')
      .top-msg(:class='topMsg.type')
        icon(v-if='topMsg.icon' :name='topMsg.icon')
        span.title(v-if='topMsg.title') {{topMsg.title}}
        small.txt {{topMsg.txt}} 
    .header(:class='(bigMenu) ? "big-menu" : ""')
      transition(name='head-trans')
        header.w-trans
          .brand(@click='goHome' @touchstart.passive='goHome')
              .iso.plain-color
                include assets/svg/logo-alt.svg
              .title
                h1.logo rsk explorer
          .header-content
            search-box
          .nav(:class='(menu) ? "open":""')
            .burger
              button(@click='toggleMenu')
                icon(:name='(!menu) ? "menu" : "close"')
            nav.menu(:class='(menu) ? "enabled":""')
              ul
                template(v-for='path,menu in menuItems')
                  li(v-if='menu !== "home" || !isRoute("home")' @click='toggleMenu')
                    router-link(:to='"/" + path')
                      icon.icon(:name='getIcon(menu)')
                      span {{menu}}
    .main
      template(v-if='connected')
        router-view
      template(v-else)
        h1 connecting to server  
    .footer
      footer
        .logo
          .iso.plain-color
            include assets/svg/iso-logo-v.svg
        .text
          p(v-for='txt in content.footer') {{txt}}
</template>


<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import ToolTip from './components/ToolTip.vue'
import SearchBox from './components/SearchBox.vue'
import './icons'
export default {
  name: 'app',
  components: {
    SearchBox,
    ToolTip
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
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeThrottler)
  },
  computed: {
    ...mapState({
      connected: state => state.socketConnected,
      errors: state => state.socketErrors,
      route: state => state.route,
      menuItems: state => state.menuItems,
      content: state => state.content,
      messages: state => state.messages
    }),
    ...mapGetters({
      appSize: 'getSize',
      dbIsOutdated: 'dbIsOutdated'
    }),
    bigMenu () {
      return this.isRoute('home')
    },
    topMsg () {
      return (this.dbIsOutdated) ? this.messages.dbOutdated || null : null
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
      this.$router.push({ path: '/Home' })
    },
    getIcon (name) {
      if (name === 'home') return 'rsk'
      let entity = this.getEntity()(name)
      return (entity) ? entity.icon || null : name
    },
    onResize () {
      let size = {
        w: this.$el.clientWidth,
        h: this.$el.clientHeight
      }
      this.setSize(size)
    },
    resizeThrottler () {
      this.menu = false
      if (!this.resizeTimeout) {
        let vm = this
        this.resizeTimeout = setTimeout(() => {
          vm.resizeTimeout = null
          vm.onResize()
        }, 66)
      }
    }
  }
}
</script>
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
  .top-msg
    .title
      font-weight bold
      margin 0 .5em 0 .25em
</style>



