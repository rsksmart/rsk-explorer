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
                <span class="title">{{ app.title }}</span>
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
import Tooltip from '../components/General/Tooltip.vue'
export default {
  components: { Tooltip },
  data () {
    return {
      apps: [
        {
          title: 'Dollar on Chain (DOC)',
          address: '0xCB46c0ddc60D18eFEB0E586C17Af6ea36452Dae0',
          description: 'DOC Decentralized bitcoin backed stablecoin.',
          url: 'https://github.com/money-on-chain/stable-protocol-interface/releases'
        },
        {
          title: 'tRIF',
          address: '0x19F64674D8A5B4E652319F5e239eFd3bc969A1fE',
          description: 'RIF is short for Rootstock Infrastructure Framework. It\'s a service layer built on top of the Rootstock blockchain, offering open, decentralized tools and technologies. With RIF, developers can create scalable DeFi products quickly and easily.',
          url: 'https://rif.technology/'
        },
        {
          title: 'Sovryn',
          address: '0x75bBf7f4D77777730ee35b94881B898113a93124',
          description: 'Secure bitcoin technology that allows you to do more with your bitcoin while having more control over your funds. Bitcoin-backed stablecoins, 0% interest loans, trading, and more with no middlemen.',
          url: 'https://sovryn.com/'
        },
        {
          title: 'RIF US Dollar (USDRIF)',
          address: '0x8dbf326e12a9fF37ED6DDF75adA548C2640A6482',
          description: 'RIF US Dollar is a fully crypto collateralized stablecoin. 1:1 pegged to US Dollar guaranteed by the smart contract.',
          url: 'https://github.com/money-on-chain/stable-protocol-interface/releases'
        },
        {
          title: 'PagoLinea (Pesos Argentinos)',
          address: '0x7841953feC095B459EF080db4Bd0D7201968A34E',
          description: 'Blockchain Wallet for multiples services.',
          url: 'https://pagolinea.com/'
        },
        {
          title: 'PagoLinea (Pesos Colombianos)',
          address: '0x4307ad39DFEf5063990928BFbf61Fa905A07D823',
          description: 'Blockchain Wallet for multiples services.',
          url: 'https://pagolinea.com/'
        },
        {
          title: 'PagoLinea (USD)',
          address: '0x5313a79e9658147a6cc6fbF7f5F50c7a5df93445',
          description: 'Blockchain Wallet for multiples services.',
          url: 'https://pagolinea.com/'
        },
        {
          title: 'Tropykus',
          address: '0xDe2DC0AeA8fC8Ce567F5F48344Ed44b89d6186B7',
          description: 'Savings and loans for Latam.',
          url: 'https://tropykus.com/'
        }
      ]
    }
  }
}
</script>
