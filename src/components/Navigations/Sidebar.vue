<template>
  <aside class="sidebar">
    <div class="sidebar-container">
      <div class="sidebar-body">
        <div class="sidebar-logo">
          <img src="@/assets/svg/logo.svg" alt="">
        </div>
        <div class="navigation">
          <router-link to="/" class="link-home">
            <img class="home-icon default" src="@/assets/svg/home-icon.svg" alt="home-icon">
            <img class="home-active" src="@/assets/svg/home-active.svg" alt="home-icon">
            Home
          </router-link>
          <router-link to="/blocks" class="link-blocks" :class="$route.name === 'Block' ? activeClasses : ''">
            <img class="base-icon" src="@/assets/svg/block-icon.svg" alt="block-icon">
            <img class="active-icon" src="@/assets/svg/block-active.svg" alt="block-icon">
            Blocks
          </router-link>
          <router-link to="/txs" class="link-txs"
            :class="$route.name === 'Internal transaction' || $route.name === 'Transaction' || $route.name === 'Event' ? activeClasses : ''">
            <img class="base-icon" src="@/assets/svg/tx-icon.svg" alt="transaction-icon">
            <img class="active-icon" src="@/assets/svg/tx-active.svg" alt="transaction-icon">
            Transactions
          </router-link>
          <router-link to="/addresses" class="link-address" :class="$route.name === 'Address' ? activeClasses : ''">
            <img class="base-icon" src="@/assets/svg/address-icon.svg" alt="address-icon">
            <img class="active-icon" src="@/assets/svg/address-active.svg" alt="address-icon">
            Adresses
          </router-link>
          <router-link to="/tokens" class="link-tokens" :class="$route.name === 'Token' || $route.name === 'Token Account' ? activeClasses : ''">
            <img class="base-icon" src="@/assets/svg/token-icon.svg" alt="token-icon">
            <img class="active-icon" src="@/assets/svg/token-active.svg" alt="token-icon">
            Tokens
          </router-link>
          <router-link to="/">
            <img src="@/assets/svg/stats-icon.svg" alt="stats-icon">
            Statictics
          </router-link>
        </div>
      </div>
    </div>
  </aside>
</template>
<script>
export default {
  data () {
    return {
      activeClasses: 'router-link-exact-active router-link-active'
    }
  }
}
</script>
