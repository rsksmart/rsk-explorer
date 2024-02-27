<template>
  <div class="apps-view">
    <h1>Apps</h1>
    <div class="apps-content">
      <div class="apps-item bg-secondary" v-for="(app, i) in apps" :key="i">
        <div class="img-content">
          <div class="item-img">
            <img src="@/assets/svg/block-icon.svg" alt="">
          </div>
        </div>
        <div class="item-content">
          <div class="item-header">
            <div class="item-center">
              <a :href="app.url" target="_blank" rel="noopener noreferrer">
                <span class="title">{{ app.name }}</span>
                <icon name="triangle-arrow-right" />
              </a>
            </div>
            <div class="flex item-center address">
              <icon name="miner" class="icon-miner" />
              <tooltip :text="app.address"  />
            </div>
          </div>
          <div class="item-description">
            {{ app.description }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Tooltip from '../components/General/Tooltip.vue'
import data from '@/resources/apps.json'

export default {
  components: { Tooltip },
  data () {
    return {
      apps: []
    }
  },
  computed: {
    ...mapGetters(['networkName']),
    isNetworkmainnet () {
      return this.networkName === 'mainnet'
    }
  },
  created () {
    this.apps = this.isNetworkmainnet ? data.apps.mainnet : data.apps.testnet
  }
}
</script>
