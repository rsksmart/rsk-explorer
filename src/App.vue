
<template lang="pug">
  .wrapper
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
          p Copyright © 2015-2017 RSK Labs. All rights reserved.
          p RSK Public Key (1310 29B2 D95E 815A 48DA B443 FD4F DAFD 7D17 4BB2)
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
      menuItems: state => state.menuItems
    }),
    ...mapGetters({
      appSize: 'getSize'
    }),
    bigMenu () {
      return this.isRoute('home')
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
      return (entity) ? entity.icon || null : null
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

  .brand
    cursor pointer

  .w-trans
    transition opacity 1s ease
    opacity 1

  .head-trans-enter-active
    opacity 0
</style>



