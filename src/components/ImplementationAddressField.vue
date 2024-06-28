<!-- This whole Component is a workaround to display the implementation address of a proxy contract -->
<!-- TODO: Refactor it to be used as a separate section inside the address view -->
<template>
  <div class="implementation-address-field-container" v-if="isERC1967Contract">
    <span v-if="implementationAddress" class="text-orange-900">
      This contract is a ERC1967 Proxy. Implementation address:
      <a
        class="implementation-address-link"
        :href="`${siteUrl}address/${implementationAddress}`"
        target="_blank"
      >
        {{ implementationAddress }}
      </a>
    </span>
    <span class="implementation-address-msg" v-else>
      <div class="loader">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
    </div>
    </span>
  </div>
</template>
<script>
import { jsonRpcProvider } from '../jsonRpcProvider'
import { mapGetters } from 'vuex'

export default {
  name: 'implementation-address-field',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      jsonRpcProvider: jsonRpcProvider(),
      implementationAddress: null,
      fieldValue: null,
      isERC1967Contract: null
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
      this.isERC1967Contract = this.data.type === 'contract' && this.data.contractInterfaces && this.data.contractInterfaces.includes('ERC1967')
      let implementationAddress

      if (this.isERC1967Contract) {
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

<style lang="scss">
@import '../styles/_variables.scss';

.implementation-address-field-container {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
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
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
}

.dot {
  width: 10px;
  height: 10px;
  margin: 0 5px;
  border-radius: 50%;
  background-color: $cyan_300;
  animation: bounce 0.6s infinite alternate;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  to {
    transform: translateY(-10px);
  }
}
</style>
