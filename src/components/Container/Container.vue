<template>
  <div class="content-explorer">
    <Navbar />
    <main class="content-view">
      <Sidebar />
      <div class="content-view-body">
        <connection-status v-if="!connected"></connection-status>
        <router-view />
      </div>
    </main>
    <Footer />
  </div>
</template>
<script>
import Footer from '@/components/General/Footer.vue'
import Navbar from '../Navigations/Navbar.vue'
import Sidebar from '../Navigations/Sidebar.vue'
import ConnectionStatus from '@/components/ConnectionStatus.vue'
import { mapState } from 'vuex'

export default {
  components: {
    Navbar,
    Sidebar,
    ConnectionStatus,
    Footer
  },
  computed: {
    ...mapState({
      connected: state => state.socketConnected,
      errors: state => state.socketErrors,
      route: state => state.route,
      menuItems: state => state.menuItems,
      content: state => state.content,
      net: state => state.backend.systemSettings.net
    })
  }
}
</script>
