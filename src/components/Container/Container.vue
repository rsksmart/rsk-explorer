<template>
  <div class="content-explorer">
    <Navbar />
    <div class="content-view">
      <Sidebar />
      <div class="content-view-body">
        <connection-status v-if="!connected"></connection-status>
        <router-view />
      </div>
    </div>
  </div>
</template>
<script>
import Navbar from '../Navigations/Navbar.vue'
import Sidebar from '../Navigations/Sidebar.vue'
import ConnectionStatus from '@/components/ConnectionStatus.vue'
import { mapState } from 'vuex'

export default {
  components: {
    Navbar,
    Sidebar,
    ConnectionStatus
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
