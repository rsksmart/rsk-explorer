<template lang="pug">
  .check-address
    h2 Check address
    .address {{address}}
    .error(v-if='!isAddress')
        p {{messages.IS_NOT_ADDRESS}}
    div(v-else)
      .valid(v-if="isValid")
        h3 {{messages.VALID_ADDRESS}}
      .invalid.error(v-else)
        h3.error {{messages.INVALID_ADDRESS}}
      .checksum
        h3(:class="checkClass") Checksum
        p
          span {{messages.CHECKSUM_IS}} &nbsp;
          strong(:class="checkClass") {{(checksumValid) ? messages.VALID:messages.INVALID }}&nbsp;
          span {{messages.FOR_NET}}:&nbsp;
          strong {{netName}} ({{chainId}})
      .pa(v-if='!isValid && isAddress')
        h3.warn Proceed anyway
        p {{messages.PA_MESSAGE}}&nbsp;
          a.btn.btn-brand(:href='unchecksummedPath') {{messages.GOTO_UNCHECKSUMED}}
      .networks(v-if="networks.length")
        p.info {{messages.MATCH}}:
        template(v-for="net in networks")
          ul.net.plain
            li
              strong {{net.name}} ({{net.chainId}})
            li(v-if="net.explorers")
              ul.plain
                li(v-for="explorer in net.explorers")
                  a(:href="linkToAddress(explorer)" target="_blank") {{explorer}}

</template>
<script>
import { ROUTES } from '../config/types'
import { messages } from '../config/texts/checkAddress'
import { mapGetters } from 'vuex'
import {
  searchChecksummedNetworks,
  isValidChecksumAddress,
  isValidAddress,
  toChecksumAddress,
  isAddress
} from 'rsk-utils/dist/addresses'
export default {
  name: 'check-address',
  props: ['address'],
  data () {
    return Object.assign({}, { messages })
  },
  computed: {
    ...mapGetters(['chainId', 'netName']),
    isAddress () {
      return isAddress(this.address)
    },
    checksumValid () {
      let { address, chainId } = this
      return isValidChecksumAddress(address, chainId)
    },
    isValid () {
      let { address, chainId } = this
      return isValidAddress(address, chainId)
    },
    checkSummed () {
      return toChecksumAddress(this.address)
    },
    isCheckSummed () {
      let { checksummed, address } = this
      return checksummed === address
    },
    networks () {
      let { chainId, address } = this
      let nets = searchChecksummedNetworks(address)
      return nets.filter(d => `${d.chainId}` !== `${chainId}`)
    },
    checkClass () {
      return (this.checksumValid) ? 'info' : 'error'
    },
    unchecksummedPath () {
      let { address } = this
      address = address.toLowerCase()
      return `/${ROUTES.address}/${address}`
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
