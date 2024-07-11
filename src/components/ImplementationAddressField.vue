<template>
  <!-- Todo: remove "implementationAddress" validation inside the v-if, after contract parser is fixed -->
  <div class="implementation-address-field-container" v-if="isERC1967Contract">
    <div v-if="implementationAddress">
      <span class="text-white-100">This contract is an ERC1967 Proxy.</span>
      <p>
        <a class="implementation-address-link" :href="`${siteUrl}address/${implementationAddress}`" target="_blank">
          <span class="text-white-400">Implementation address:</span>
          <span>{{ implementationAddress }}</span>
          <icon class="small" name="link-external" />
        </a>
      </p>
    </div>
    <div class="implementation-address-msg" v-else-if="!this.stopLoaderAnimation">
      <div class="loader">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { BigNumber } from 'ethers'
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
      isERC1967Contract: null,
      isUUPSProxy: false,
      isBeaconProxy: false,
      stopLoaderAnimation: false
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
    isZero (v) {
      return BigNumber.from(v).isZero()
    },
    parseAddress (v) {
      return `0x${v.slice(-40)}`
    },
    async getImplementationAddress () {
      // ERC1967 Proxy implementation retrieval (https://eips.ethereum.org/EIPS/eip-1967)

      let implementationAddress = null
      const IMPLEMENTATION_SLOT = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'
      // const BEACON_SLOT = '0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50'

      // Note: In case of ERC1967 false positives, ERC1967 interface will be manually removed from contractInterfaces (false positive stored in db due to contract parser bug)
      this.isERC1967Contract = this.data.type === 'contract' && this.data.contractInterfaces && this.data.contractInterfaces.includes('ERC1967')
      this.isUUPSProxy = false
      this.isBeaconProxy = false

      if (this.isERC1967Contract) {
        // UUPS Check
        const storedValue = await this.jsonRpcProvider.getStorageAt(this.data.address, IMPLEMENTATION_SLOT)

        if (!this.isZero(storedValue)) {
          this.isUUPSProxy = true
          implementationAddress = this.parseAddress(storedValue)
        } else {
          // TODO: Beacon check

          // ...beacon check logic

          // TODO: Remove this temporal fix after fixing contract parser bug (false positive stored in db due to contract parser bug)
          // this condition should never happen if this.isERC1967Contract = true
          if (!this.isBeaconProxy && !this.isUUPSProxy) {
            // stop loading animation and manually remove ERC1967 from contract interfaces
            this.stopLoaderAnimation = true
            this.data.contractInterfaces = [...this.data.contractInterfaces.filter(v => v !== 'ERC1967')]
            if (!this.data.contractInterfaces.length) this.data.contractInterfaces = undefined
          }
        }
      }

      return implementationAddress
    },
    setImplementationAddress (implementationAddress) {
      this.$set(this, 'implementationAddress', implementationAddress)
    }
  },
  async mounted () {
    const implementationAddress = await this.getImplementationAddress()

    this.setImplementationAddress(implementationAddress)

    console.log({ implementationAddress: this.implementationAddress })
  }
}
</script>

<style lang="scss">
@import '../styles/_variables.scss';

.implementation-address-field-container {
  display: flex;
  margin-left: 10px;
  margin-bottom: 15px;
}

.implementation-address-link {
  color: #bbb;
  transition: color 0.3s ease;
  display: flex;
  gap: 5px;
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
  background-color: $pink_900;
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
