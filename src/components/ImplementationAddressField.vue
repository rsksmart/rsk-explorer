<!-- This whole Component is a workaround to display the implementation address of a proxy contract -->
<!-- TODO: Refactor it to be used as a separate section inside the address view -->
<template>
  <div class="implementation-address-field-container">
    <span v-if="implementationAddress">
      <a class="implementation-address-link" :href="`${siteUrl}address/${implementationAddress}`" target="_blank">{{ implementationAddress }}</a>
    </span>
    <span class="implementation-address-msg" v-else>{{ fieldValue }}</span>
  </div>
</template>
<script>
import { jsonRpcProvider } from '../jsonRpcProvider'
import { mapGetters } from 'vuex'

export default {
  name: 'implementation-address-field',
  data () {
    return {
      data: this.$parent.data,
      jsonRpcProvider: jsonRpcProvider(),
      implementationAddress: null,
      fieldValue: null
    }
  },
  computed: {
    ...mapGetters(['networkName']),
    isNetworkmainnet () {
      return this.networkName === 'mainnet'
    },
    siteUrl () {
      return this.isNetworkmainnet ? process.env.VUE_APP_DOMAIN_MAINNET : process.env.VUE_APP_DOMAIN_TESTNET
    }
  },
  methods: {
    async getImplementationAddress () {
      // proxy implementation fetch
      const isERC1967Contract = this.data.type === 'contract' && this.data.contractInterfaces && this.data.contractInterfaces.includes('ERC1967')
      let implementationAddress

      if (isERC1967Contract) {
        this.$set(this, 'fieldValue', 'fetching...')
        // Retrieve ERC1967 Proxy implementation (https://eips.ethereum.org/EIPS/eip-1967)
        const IMPLEMENTATION_SLOT = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc' // storage address where the implementation address is stored
        const implementationSlotValue = await this.jsonRpcProvider.getStorageAt(this.data.address, IMPLEMENTATION_SLOT)

        if (implementationSlotValue !== '0x0') {
          implementationAddress = `0x${implementationSlotValue.slice(-40)}` // extract contract address
        } else {
          this.$set(this, 'fieldValue', 'N/A')
        }
      }

      return implementationAddress
    },
    setImplementationAddress (implementationAddress) {
      this.$set(this, 'implementationAddress', implementationAddress)
      this.$set(this, 'fieldValue', implementationAddress)
    }
  },
  async mounted () {
    const implementationAddress = await this.getImplementationAddress()

    this.setImplementationAddress(implementationAddress)

    console.log(this.implementationAddress)
  }
}
</script>

<style>
.implementation-address-field-container {
  margin-left: 76px;
}

.implementation-address-link {
  color: #bbb;
  transition: color 0.3s ease;
}

.implementation-address-link:hover {
  color: #ddd;
}

.implementation-address-msg {
  color: #bbb;
}
</style>
