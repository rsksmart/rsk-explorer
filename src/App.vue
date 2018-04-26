
<template lang="pug">
  .wrapper
    .header
      header
        .brand(@click='goHome' @touchstart.passive='goHome')
            .iso.plain-color
              include assets/svg/iso-logo-v.svg
            .title
              h1.logo rsk explorer
        .header-content
        search-box
        .nav
          nav.menu
            ul
              template(v-for='menu in fields')
                router-link(:to='"/" + menu' tag='li') 
                  a(:href='"/" + menu') {{menu}}
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
      menuItems: ['home', 'tokens', 'blocks', 'transactions', 'addresses']
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
      errors: state => state.socketErrors
    }),
    ...mapGetters({
      appSize: 'getSize'
    })
  },
  methods: {
    ...mapActions([
      'setSize'
    ]),
    goHome (event) {
      this.$router.push({ path: '/Home' })
    },

    onResize () {
      let size = {
        w: this.$el.clientWidth,
        h: this.$el.clientHeight
      }
      this.setSize(size)
    },
    resizeThrottler () {
      // ignore resize events as long as an actualResizeHandler execution is in the queue
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
</style>



