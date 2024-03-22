<template>
  <aside class="sidebar" :class="getMenuToggle ? 'show': 'hide'">
    <button class="btn-close" @click="handleClick">
      <img src="@/assets/svg/close-icon.svg" alt="">
    </button>
    <div class="sidebar-container">
      <div class="sidebar-body">
        <div class="navbar-logo">
          <img src="@/assets/svg/logo.svg" alt="">
        </div>
        <div class="navigation">
          <router-link to="/" class="link-home" @click="handleClick">
            <img class="home-icon default" src="@/assets/svg/home-icon.svg" alt="home-icon">
            <img class="home-active" src="@/assets/svg/home-active.svg" alt="home-icon">
            <span>Home</span>
          </router-link>
          <router-link to="/blocks" class="link-blocks"
            :class="PAGE_NAME.BLOCKS.some((v) => $route.name?.includes(v)) ? activeClasses : ''">
            <img class="base-icon" src="@/assets/svg/block-icon.svg" alt="block-icon">
            <img class="active-icon" src="@/assets/svg/block-active.svg" alt="block-icon">
            <span>Blocks</span>
          </router-link>
          <router-link to="/txs" class="link-txs"
            :class="PAGE_NAME.TXS.some((v) => $route.name?.includes(v)) ? activeClasses : ''">
            <img class="base-icon" src="@/assets/svg/tx-icon.svg" alt="transaction-icon">
            <img class="active-icon" src="@/assets/svg/tx-active.svg" alt="transaction-icon">
            <span>Transactions</span>
          </router-link>
          <router-link to="/addresses" class="link-address"
            :class="PAGE_NAME.ADDRESSES.some((v) => $route.name?.includes(v)) ? activeClasses : ''">
            <img class="base-icon" src="@/assets/svg/address-icon.svg" alt="address-icon">
            <img class="active-icon" src="@/assets/svg/address-active.svg" alt="address-icon">
            <span>Addresses</span>
          </router-link>
          <router-link to="/tokens" class="link-tokens"
            :class="PAGE_NAME.TOKENS.some((v) => $route.name?.includes(v)) ? activeClasses : ''">
            <img class="base-icon" src="@/assets/svg/token-icon.svg" alt="token-icon">
            <img class="active-icon" src="@/assets/svg/token-active.svg" alt="token-icon">
            <span>Tokens</span>
          </router-link>
          <router-link to="/apps" class="link-apps" :class="$route.name === 'Apps' ? activeClasses : ''">
            <icon name="apps" />
            <span>Apps</span>
          </router-link>
          <a target="_blank" :href="isNetworkmainnet ? DOMAIN_STATS_MAINNET : DOMAIN_STATS_TESTNET">
            <img src="@/assets/svg/stats-icon.svg" alt="stats-icon">
            <span>Statistics</span>
          </a>
        </div>
      </div>
    </div>
  </aside>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { DOMAIN_STATS_TESTNET, DOMAIN_STATS_MAINNET } from '../../config/network'
import { PAGE_NAME } from '@/config/types'

export default {
  data () {
    return {
      PAGE_NAME,
      DOMAIN_STATS_MAINNET,
      DOMAIN_STATS_TESTNET,
      activeClasses: 'router-link-exact-active router-link-active'
    }
  },
  computed: {
    ...mapGetters(['getMenuToggle']),
    ...mapGetters(['networkName']),
    isNetworkmainnet () {
      return this.networkName === 'mainnet'
    }
  },
  watch: {
    $route () {
      if (this.getMenuToggle) this.handleClick()
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
