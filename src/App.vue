<template>
  <div class="wrapper" id="app">
    <div class="top-page" v-if="topMsg">
      <message class="top-msg" :message="topMsg"></message>
    </div>
    <container />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Message from './components/Message.vue'
import './icons'
import Container from './components/Container/Container.vue'
export default {
  name: 'app',
  components: {
    Message,
    Container
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
      return null
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
