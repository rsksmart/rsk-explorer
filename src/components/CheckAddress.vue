  <template lang="pug">
  .check-address
    h2 Check address
    .address {{address}}
    //- Address
    template(v-if='!isAddress')
      .error
        p {{messages.IS_NOT_ADDRESS}}
    .txt-box(v-else)
      .valid(v-if="isValid")
        h3 {{messages.VALID_ADDRESS}}
      .invalid.error(v-else)
        h3.error {{messages.INVALID_ADDRESS}}
      //-Checksum
      .checksum
        //-h3(:class="checkClass") Checksum
        p
          span {{messages.CHECKSUM_IS}} &nbsp;
          strong(:class="checkClass") {{(checksumValid) ? messages.VALID:messages.INVALID }}&nbsp;
          span {{messages.FOR_NET}}:&nbsp;
          strong {{netName}} ({{chainId}})
    .txt-box(v-if='!isValid && isAddress')
      h3.brand {{messages.PROCEED}}
      p {{messages.PA_MESSAGE}}
      p
        a(:href='unchecksummedPath') {{messages.IGNORE}} {{messages.GOTO_ADDRESS}}
      .networks.txt-box(v-if='Object.keys(networks).length')
        h3 {{messages.NETWORKS}}
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
      const { address, chainId } = this
      return isValidChecksumAddress(address, chainId)
    },
    isValid () {
      const { address, chainId } = this
      return isValidAddress(address, chainId)
    },
    checkSummed () {
      return toChecksumAddress(this.address)
    },
    isCheckSummed () {
      const { checksummed, address } = this
      return checksummed === address
    },
    networks () {
      const { chainId, address } = this
      const nets = searchChecksummedNetworks(address)
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
