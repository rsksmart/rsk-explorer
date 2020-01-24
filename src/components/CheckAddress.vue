<template lang="pug">
  .check-address
    .valid(v-if="isValid")
      h3 The address is valid
    .invalid.error(v-else)
      h3 Invalid address
    .test
    .networks(v-if="networks.length")
      h3 Note, the address match with these networks
      template(v-for="net in networks")
        ul.net
          li {{net.name}} ({{net.chainId}})
          li(v-if="net.explorers")
            ul
              li(v-for="explorer in net.explorers")
                a(:href="linkToAddress(explorer)" target="_blank") {{explorer}}

</template>
<script>
import { mapGetters } from 'vuex'
import { searchChecksummedNetworks, isValidChecksumAddress, isValidAddress, toChecksumAddress } from 'rsk-utils/dist/addresses'
export default {
  name: 'check-address',
  props: ['address'],
  computed: {
    ...mapGetters(['chainId']),
    checksumValid () {
      let { address, chainId } = this
      return isValidChecksumAddress(address, chainId)
    },
    isValid () {
      return isValidAddress(this.address)
    },
    checkSummed () {
      return toChecksumAddress(this.address)
    },
    isCheckSummed () {
      let { checksummed, address } = this
      return checksummed === address
    },
    networks () {
      return searchChecksummedNetworks(this.address)
    }
  },
  methods: {
    linkToAddress (baseUrl, address) {
      address = address || this.address
      return `${baseUrl}/address/${address}`
    }
  }
}
</script>
