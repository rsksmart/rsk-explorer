<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-body" :class="getSearchExpand ? 'content-expand' : ''">
        <div class="navbar-logo">
          <button @click="handleClick" class="menu-toggle">
            <img src="@/assets/svg/menu-icon.svg">
          </button>
          <img src="@/assets/svg/logo.svg" alt="">
        </div>
        <div class="navbar-content">
          <SearchBox />
          <div class="content-network">
            <a :href="isNetworkmainnet ? DOMAIN_TESTNET : 'javascript:void(0)'" class="btn" :class="!isNetworkmainnet ? 'btn-active' : 'btn-go'">
              <span class="large-text">Testnet</span>
              <span class="short-text">TN</span>
              <img v-if="isNetworkmainnet" src="@/assets/svg/arrow-go.svg" alt="">
            </a>
            <a :href="isNetworkmainnet ? DOMAIN_MAINNET : 'javascript:void(0)'" class="btn" :class="isNetworkmainnet ? 'btn-active' : 'btn-go'">
              <span class="large-text">Mainnet</span>
              <span class="short-text">MN</span>
              <img v-if="!isNetworkmainnet" src="@/assets/svg/arrow-go.svg" alt="">
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
<script>
import SearchBox from '@/components/Search/SearchBox.vue'
import { mapActions, mapGetters } from 'vuex'
import { DOMAIN_MAINNET, DOMAIN_TESTNET } from '../../config/network'
export default {
  components: {
    SearchBox
  },
  data () {
    return {
      DOMAIN_MAINNET,
      DOMAIN_TESTNET
    }
  },
  computed: {
    ...mapGetters(['networkName']),
    ...mapGetters(['getSearchExpand']),
    ...mapGetters(['getMenuToggle']),
    isNetworkmainnet () {
      return this.networkName === 'mainnet'
    }
  },
  methods: {
    ...mapActions(['updateMenuToggle']),
    handleClick () {
      this.updateMenuToggle(!this.getMenuToggle)
    }
  }
}
</script>
