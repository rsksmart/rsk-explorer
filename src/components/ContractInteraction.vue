<template>
  <!-- Contract Interaction -->
  <div v-if="verification" class="contract-interaction section">
    <div v-if="!isProxy" class="flex-container">
      <div v-if="this.showMetamaskNotInstalledMsg">
        <p class="metamask-connection-message">{{ installMetamaskMsg }}</p>
        <a class="metamask-link" :href="metamaskExtensionUrl" target="_blank">{{ metamaskExtensionUrl }}</a>
        <p></p>
      </div>
      <div v-if="this.metamaskConnected && this.networkChanged">
        <p class="metamask-connection-message">Warning: Network change detected. It's strongly recommended to reload the page to prevent loss of funds or unexpected behaviors.</p>
        <button class="btn btn-reload" @click="reloadPage">Reload page</button>
      </div>
      <div>
        <button v-if="!this.signer" class="btn btn-connect" @click="connectToMetamask">Connect to Metamask</button>
        <div v-if="this.signer && this.signerAddress">
          <p class="metamask-title">Metamask Connected!</p>
          <span>Address:
            <tool-tip :text="this.signerAddress" :trim="false" :link="contractInteractionTabUrl" :hideCopy="false" />
          </span>
        </div>
      </div>
    </div>
    <div v-if="!isProxy" class="methods-container">
      <div class="btn-content">
        <button
          class="btn"
          :style="{ backgroundColor: readMethods ? PAGE_COLORS[$route.name].cl : ''}"
          @click="selectMethods(true)"
        >
          Read Methods
        </button>
        <button
          class="btn"
          :style="{ backgroundColor: !readMethods ? PAGE_COLORS[$route.name].cl : ''}"
          @click="selectMethods(false)"
        >
          Write Methods
        </button>
      </div>
      <div class="methods-content">
        <ContractMethods
          v-if="readMethods"
          title="Read Methods"
          :methods="contractAbi.readMethods"
          @contract-interaction-handler="contractCall"
          methodsType="read"
          :key="`read-${methodsKey}`"
        />
        <ContractMethods
          v-else
          title="Write Methods"
          :methods="contractAbi.writeMethods"
          @contract-interaction-handler="sendTransaction"
          methodsType="write"
          :disableCalls="!metamaskConnected"
          :key="`write-${methodsKey}`"
        />
      </div>
    </div>
    <!-- TODO: remove ALL "isProxy" guards after contract interaction with proxies are implemented -->
    <div v-else style="background-color: #252525; padding: 10px;">
      <h2 style="color: #ffffff; margin-bottom: 10px;">Coming Soon!</h2>
      <p style="color: #ffffff; font-weight: bold;">This contract seems to be a proxy. Proxy contract interactions will be available soon!</p>
    </div>
  </div>
</template>

<script>
import { jsonRpcProvider, browserProvider, rskNetworks, envNetwork } from '../jsonRpcProvider'
import { BigNumber, ethers } from 'ethers'
import ContractMethods from './ContractMethods.vue'
import ToolTip from './General/Tooltip.vue'
import { PAGE_COLORS } from '@/config/pageColors'
import { mapGetters } from 'vuex'

export default {
  name: 'contract-interaction',
  components: {
    ContractMethods,
    ToolTip
  },
  props: ['data'],
  data () {
    const CATEGORIES = {
      CONTRACT_CONSTRUCTOR: 'contractConstructor',
      EVENTS: 'events',
      READ_METHODS: 'readMethods',
      WRITE_METHODS: 'writeMethods'
    }
    const contractAbi = {
      [CATEGORIES.CONTRACT_CONSTRUCTOR]: null,
      [CATEGORIES.EVENTS]: [],
      [CATEGORIES.READ_METHODS]: [],
      [CATEGORIES.WRITE_METHODS]: []
    }
    return {
      PAGE_COLORS,
      CATEGORIES,
      contractAbi,
      contractInstances: {
        readOnly: null,
        write: null
      },
      jsonRpcProvider: jsonRpcProvider(),
      metamaskConnected: false,
      showMetamaskNotInstalledMsg: false,
      installMetamaskMsg: 'MetaMask extension is not installed. Please install it first:',
      metamaskExtensionUrl: 'https://metamask.io/download/',
      browserProvider: null,
      signer: null,
      signerAddress: null,
      readMethods: true,
      methodsKey: 0,
      networkChanged: false,
      isProxy: false
    }
  },
  computed: {
    getData () {
      return this.data
    },
    verification () {
      return this.data.verification || {}
    },
    contractAddress () {
      return this.data.verification.address
    },
    stringifiedAbi () {
      const { verification } = this
      const abi = (verification) ? verification.abi : null
      return (abi) ? JSON.stringify(abi, null, 2) : null
    },
    abi () {
      return JSON.parse(this.stringifiedAbi)
    },
    abiCategories () {
      return this.CATEGORIES
    },
    parsedAbi () {
      const CATEGORIES = this.abiCategories

      this.abi.forEach(fragment => {
        const { type, stateMutability } = fragment

        if (type === 'constructor') {
          this.registerAbiFragment(fragment, CATEGORIES.CONTRACT_CONSTRUCTOR)
        } else if (type === 'event') {
          this.registerAbiFragment(fragment, CATEGORIES.EVENTS)
        } else if (type === 'function') {
          if (stateMutability === 'view' || stateMutability === 'pure') {
            this.registerAbiFragment(fragment, CATEGORIES.READ_METHODS)
          } else if (stateMutability === 'nonpayable' || stateMutability === 'payable') {
            this.registerAbiFragment(fragment, CATEGORIES.WRITE_METHODS)
          }
        }
      })

      return this.contractAbi
    },
    contractInteractionTabUrl () {
      // fix to prevent signer address redirects by missclick to the copy button
      return `${this.contractAddress}?__ctab=Contract%20Interaction`
    }
  },
  methods: {
    async determineProxy () {
      // This temporal guard is required until support for Proxies interaction is added.

      // --- //
      // Extra check to ensure it really is a proxy. Required until false ERC1967 contract positives are removed from db. (rsk-contract-parser bug)
      const IMPLEMENTATION_SLOT = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'
      const isProxy = this.data.type === 'contract' && this.data.contractInterfaces && this.data.contractInterfaces.includes('ERC1967')

      let result = {
        msg: 'proxy recheck',
        originalContractInterfaces: this.data.contractInterfaces,
        implementationSlotValue: null,
        proxy: false,
        implementationAddress: null,
        curatedInterfaces: null
      }

      const implementationSlotValue = await this.jsonRpcProvider.getStorageAt(this.data.address, IMPLEMENTATION_SLOT)

      result = {
        ...result,
        implementationSlotValue
      }

      if (isProxy) {
        const notAProxy = BigNumber.from(implementationSlotValue).isZero()

        if (notAProxy) {
          // then remove false positive
          const curatedInterfaces = this.data.contractInterfaces.filter(v => v !== 'ERC1967')

          this.data.contractInterfaces = curatedInterfaces.length ? curatedInterfaces : undefined

          result = {
            ...result,
            curatedInterfaces
          }
        } else {
          this.isProxy = true

          result = {
            ...result,
            proxy: true,
            implementationAddress: `0x${implementationSlotValue.slice(-40)}`
          }
        }

        console.log(`Address ${this.data.address} is a proxy`)
      } else {
        console.log(`Address ${this.data.address} is not a proxy`)
      }

      console.log(result)
      // --- //

      return this.data.contractInterfaces && this.data.contractInterfaces.includes('ERC1967')
    },
    registerAbiFragment (value, category) {
      const CATEGORIES = this.abiCategories

      if (!Object.values(CATEGORIES).includes(category)) throw new Error(`Error parsing contract abi. Unknown category ${category} for value ${JSON.stringify(value)}`)

      if (category === CATEGORIES.CONTRACT_CONSTRUCTOR) {
        this.contractAbi[CATEGORIES.CONTRACT_CONSTRUCTOR] = value
      } else if (category === CATEGORIES.EVENTS) {
        this.contractAbi[category].push(value)
      } else if (category === CATEGORIES.READ_METHODS || category === CATEGORIES.WRITE_METHODS) {
        this.$set(value, 'interactionData', {
          inputs: [],
          outputs: [],
          hash: {
            content: null,
            style: 'message-info'
          },
          message: {
            content: null,
            style: 'message-info'
          },
          requested: false
        })

        this.contractAbi[category].push(value)
      }
    },
    setContractAbi () {
      this.$set(this, 'contractAbi', this.parsedAbi)
    },
    setReadOnlyContractInstance () {
      const { contractAddress, abi, jsonRpcProvider } = this
      const contractInstance = new ethers.Contract(contractAddress, abi, jsonRpcProvider)
      this.$set(this.contractInstances, 'readOnly', contractInstance)
    },
    async setWriteContractInstance () {
      const { contractAddress, abi } = this
      const signer = await this.browserProvider.getSigner()
      const signerAddress = await signer.getAddress()
      const contractInstance = new ethers.Contract(contractAddress, abi, signer)
      this.$set(this.contractInstances, 'write', contractInstance)
      this.$set(this, 'signer', signer)
      this.$set(this, 'signerAddress', signerAddress)
    },
    getReadOnlyContractInstance () {
      if (!this.contractInstances.readOnly) this.setReadOnlyContractInstance()

      return this.contractInstances.readOnly
    },
    getWriteOnlyContractInstance () {
      return this.contractInstances.write
    },
    async requestAddRskNetwork () {
      try {
        await window.ethereum.request({ method: 'wallet_addEthereumChain', params: [rskNetworks[envNetwork]] })
      } catch (error) {
        throw new Error('Error while adding rsk network', error)
      }
    },
    async requestRskNetworkSwitch () {
      await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: rskNetworks[envNetwork].chainId }] })
    },
    async connectToRskNetwork () {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      this.$set(this, 'browserProvider', browserProvider())

      const currentNetwork = await this.browserProvider.getNetwork()
      const currentChainId = `0x${currentNetwork.chainId.toString(16)}`
      const rskChainId = rskNetworks[envNetwork].chainId
      const sameNetwork = currentChainId === rskChainId

      if (sameNetwork) return

      try {
        await this.requestRskNetworkSwitch()
        localStorage.setItem('metamaskAutoconnect', true)
        this.reloadPage()
      } catch (error) {
        if (error.code === 4902) { // Unrecognized chain ID
          await this.requestAddRskNetwork()
          await this.requestRskNetworkSwitch()
          localStorage.setItem('metamaskAutoconnect', true)
          this.reloadPage()
        } else {
          throw new Error('Unhandled error while connecting to rsk network', error)
        }
      }
    },
    async connectToMetamask () {
      localStorage.setItem('metamaskAutoconnect', false)

      if (window.ethereum) {
        try {
          await this.connectToRskNetwork()
          this.$set(this, 'metamaskConnected', true)
          await this.setWriteContractInstance()
        } catch (error) {
          console.error('Error when connecting to metamask', error)
        }
      } else {
        this.$set(this, 'showMetamaskNotInstalledMsg', true)
        console.error(this.installMetamaskMsg)
      }
    },
    async sendTransaction (methodName, inputs) {
      const methodIndex = this.contractAbi[this.CATEGORIES.WRITE_METHODS].findIndex(m => m.name === methodName)
      const method = this.contractAbi[this.CATEGORIES.WRITE_METHODS][methodIndex]
      this.$set(method.interactionData, 'hash', { content: null, style: 'message-info' })
      this.$set(method.interactionData, 'message', { content: 'Sending transaction...', style: 'message-success' })

      try {
        const contract = this.contractInstances.write
        const args = inputs

        if (!contract) throw new Error('Connect to metamask first')

        this.validateInputs(inputs, method)

        // TODO: abstract inputs formatter
        method.inputs.forEach((input, index) => {
          const { type } = input

          if (type === 'address') {
            args[index] = this.normalizeAddress(args[index])
          } else if (type === 'bool') {
            throw new Error('Invalid boolean input (possible values: true, false, 1, 0)')
          } else if (type.startsWith('uint') || type.startsWith('int')) {
            args[index] = this.formatBigNumber(args[index])
          } else if (type.includes('[]')) {
            args[index] = this.parseArrayFromString(args[index])
          }
        })

        const tx = await contract[methodName](...args)
        this.$set(method.interactionData, 'message', { content: 'Transaction sent. Waiting for confirmation... (estimated time: 30 secs)', style: 'message-success' })
        this.$set(method.interactionData, 'hash', { content: tx.hash, style: 'message-info' })

        await tx.wait() // receipt

        this.$set(method.interactionData, 'message', { content: 'Transaction confirmed.', style: 'message-success' })
      } catch (error) {
        console.error(error)

        this.$set(method.interactionData, 'message', { content: error.message, style: 'message-error' })
      }
    },
    async contractCall (methodName, inputs) {
      const methodIndex = this.contractAbi[this.CATEGORIES.READ_METHODS].findIndex(m => m.name === methodName)
      const method = this.contractAbi[this.CATEGORIES.READ_METHODS][methodIndex]
      this.$set(method.interactionData, 'requested', true)
      this.$set(method.interactionData, 'message', { content: 'calling contract...', style: 'message-info' })

      try {
        this.validateInputs(inputs, method)

        const contract = this.getReadOnlyContractInstance()
        const args = inputs

        // TODO: abstract inputs formatter
        method.inputs.forEach((input, index) => {
          const { type } = input

          if (type === 'address') {
            // normalize non checksummed addresses
            args[index] = this.normalizeAddress(args[index])
          } else if (type === 'bool') {
            if (!this.isValidBoolean(args[index])) throw new Error('Invalid boolean input (possible values: true, false, 1, 0)')
          } else if (type.includes('[]')) {
            args[index] = this.parseArrayFromString(args[index])
          }
        })

        // Note: When function has multiple outputs, ethers returns result as a proxy
        const result = await contract[methodName](...args)

        if (method.outputs.length > 1) {
          method.outputs.forEach((_, index) => {
            this.$set(method.interactionData.outputs, index, result[index])
          })
        } else {
          // single output
          this.$set(method.interactionData.outputs, 0, result)
        }

        this.$set(method.interactionData, 'message', { content: null, style: 'message-info' })
      } catch (error) {
        console.error(error)

        this.$set(method.interactionData, 'outputs', [])
        this.$set(method.interactionData, 'message', { content: error.message, style: 'message-error' })
      }

      this.$set(method.interactionData, 'requested', false)
    },
    parseArrayFromString (str) {
      if (!str.startsWith('[') || !str.endsWith(']')) throw new Error('Value must be a valid array')

      return JSON.parse(str)
    },
    validateInputs (inputs, method) {
      const nonEmptyInputs = inputs.filter(input => input !== '' && input !== undefined && input !== null)

      if (nonEmptyInputs.length !== method.inputs.length) throw new Error(`Invalid number of parameters for "${method.name}". Got ${nonEmptyInputs.length} expected ${method.inputs.length}!`)
    },
    validateString (value) {
      if (typeof value !== 'string') throw new Error('Invalid string')
    },
    normalizeAddress (address) {
      this.validateString(address)
      return ethers.utils.getAddress(address)
    },
    isValidBoolean (text) {
      this.validateString(text)

      return /^(true|false|1|0)$/i.test(text)
    },
    formatBigNumber (num) {
      return ethers.BigNumber.from(num)
    },
    selectMethods (value) {
      this.readMethods = value
      this.methodsKey += 1
    },
    reloadPage () {
      location.reload()
    },
    handleChainChanged (chainId) {
      console.log(`Network changed to ${chainId}. It's strongly advised to reload the page...`)
      if (this.metamaskConnected) this.$set(this, 'networkChanged', true)
    },
    ...mapGetters(['networkName']),
    isNetworkmainnet () {
      return this.networkName === 'mainnet'
    },
    siteUrl () {
      return this.isNetworkmainnet ? process.env.VUE_APP_DOMAIN_MAINNET : process.env.VUE_APP_DOMAIN_TESTNET
    }
  },
  async mounted () {
    this.setContractAbi()

    await this.determineProxy()

    if (window.ethereum) window.ethereum.on('chainChanged', this.handleChainChanged)

    // Note: Metamask autoconnection only triggers after switching to an rsk network
    const metamaskAutoconnect = localStorage.getItem('metamaskAutoconnect') === 'true'
    if (metamaskAutoconnect) await this.connectToMetamask()
  },
  beforeDestroy () {
    if (window.ethereum) {
      window.ethereum.removeListener('chainChanged', this.handleChainChanged)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.contract-interaction {
  color: #fff;
  width: 100%;
  .tooltip .tooltip-text .trim-value .copy-icon svg {
    margin-top: 2px;
  }
  .flex-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .metamask-connection-message {
    color: $orange_900;
    text-decoration: underline;
    text-underline-offset: 2px;
    margin-bottom: 10px;
  }

  .metamask-link {
    color: #fff;
  }
  .btn-reload {
    border: 1px solid transparent;
    padding: 10px;
    animation: breathe 8s ease infinite;
    background-color: transparent;
    transition: color 0.3s ease;
  }
  .btn-reload:hover {
    color: $orange_900;
  }
  .btn-connect {
    border: 1px solid $newbw_700;
    padding: 10px;
  }
  .metamask-title {
    color: $cyan_300;
  }
  .methods-container {
    margin: 20px 0;
    .btn-content {
      display: flex;
      gap: 10px;
      .btn {
        font-size: 12px;
        border: 1px solid $newbw_700;
        padding: 8px;
      }
    }
    .methods-content {
      margin-top: 20px;
    }
  }

  @keyframes breathe {
  0% {
    box-shadow: 0 0 10px rgba(0, 255, 255, 0);
  }
  30% {
    box-shadow: 0 0 10px $orange_900;
  }
  70% {
    box-shadow: 0 0 10px $orange_900;
  }
  100% {
    box-shadow: 0 0 10px rgba(0, 255, 255, 0);
  }
}
}
</style>
