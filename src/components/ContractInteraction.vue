<template>
  <!-- Contract Interaction -->
  <div v-if="verification" class="contract-interaction section">
    <!-- TODO -->
    <!-- OK - Decide if apikey and json rpc call should be made directly or through explorer api (what do we win by coupling the jsonrpc calls to the explore api?) -->
    <!-- Add contract methods: title + input (if required) + result -->
    <!-- Add ethers to enable metamask wallet connection (required for sending txs (writes)) -->
    <!-- Connect to explorer API for requests -->
    <!-- Talk with Carlos about UI/UX -->
    <!-- <h3>Dev</h3>
    <button class="btn" @click="state">Component state</button>
    <button class="btn" @click="printAddressData">Address data</button>
    <button class="btn" @click="printJsonProvider">Json Provider</button>
    <button class="btn" @click="printRawContractABI">Raw Contract ABI</button>
    <button class="btn" @click="printParsedContractABI">Parsed Contract ABI</button>
    <br><br><br> -->
    <button class="btn" @click="connectToMetamask">Connect to Metamask</button>
    <div v-if="this.signer && this.signer.address">
      <p style="color: #0b0;">Metamask Connected!</p>
      <span>Address: {{ this.signer.address }}</span>
    </div>
    <br><br><br>
    <div class="methods-container">
      <ContractMethods title="Read Methods" :methods="contractAbi.readMethods" @contract-interaction-handler="contractCall" methodsType="read" />
      <ContractMethods title="Write Methods" :methods="contractAbi.writeMethods" @contract-interaction-handler="sendTransaction" methodsType="write" :disableCalls="!metamaskConnected"/>
    </div>
  </div>
</template>

<script>
import { jsonRpcProvider, rskNetworks, envNetwork } from '../jsonRpcProvider'
import { ethers } from 'ethers'
import ContractMethods from './ContractMethods.vue'

export default {
  name: 'contract-interaction',
  components: {
    ContractMethods
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
      CATEGORIES,
      contractAbi,
      contractInstances: {
        readOnly: null,
        write: null
      },
      jsonRpcProvider,
      metamaskConnected: false,
      installMetamaskMsg: 'MetaMask extension is not installed. Please install it first: https://metamask.io/download/',
      browserProvider: null,
      signer: null
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
          if (stateMutability === 'view') {
            this.registerAbiFragment(fragment, CATEGORIES.READ_METHODS)
          } else if (stateMutability === 'nonpayable') {
            this.registerAbiFragment(fragment, CATEGORIES.WRITE_METHODS)
          }
        }
      })

      return this.contractAbi
    }
  },
  methods: {
    // printAddressData () {
    //   console.log(this.getData)
    // },
    // printJsonProvider () {
    //   console.log({ url: process.env.JSON_RPC_PROVIDER, instance: this.jsonRpcProvider })
    // },
    // printRawContractABI () {
    //   console.log(this.data.verification.abi)
    // },
    // printParsedContractABI () {
    //   const { contractConstructor, events, readMethods, writeMethods } = this.contractAbi
    //   console.log('Constructor:', contractConstructor)
    //   console.log('Events:', events)
    //   console.log('ReadMethods:', readMethods)
    //   console.log('WriteMethods:', writeMethods)
    // },
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
          message: {
            content: null,
            style: 'message-info'
          }
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
      const contractInstance = new ethers.Contract(contractAddress, abi, signer)
      this.$set(this.contractInstances, 'write', contractInstance)
      this.$set(this, 'signer', signer)

      console.log({ contractInstances: this.contractInstances, signer: this.signer })
    },
    getReadOnlyContractInstance () {
      if (!this.contractInstances.readOnly) this.setReadOnlyContractInstance()

      return this.contractInstances.readOnly
    },
    getWriteOnlyContractInstance () {
      return this.contractInstances.write
    },
    async addNetwork (params) {
      return window.ethereum.request({ method: 'wallet_addEthereumChain', params })
    },
    async switchNetwork (chainIdHex) {
      return window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: chainIdHex }] })
    },
    async validateNetwork (provider) {
      console.log('Trying to fetch current chain id...')
      const currentNetwork = await provider.getNetwork()
      const currentNetworkChainId = `0x${currentNetwork.chainId.toString(16)}`

      console.log('Validating network...')

      const { chainId, chainName } = rskNetworks[envNetwork]

      console.log({ rskNetworks, chainId, chainName, currentNetwork, currentNetworkChainId })

      if (currentNetworkChainId !== chainId) {
        // also check name to ensure its using RPC API url
        await this.addNetwork([rskNetworks[envNetwork]])
        await this.switchNetwork(chainId)
      }

      console.log('Network validated.')
    },
    async connectToMetamask () {
      if (window.ethereum) {
        if (this.metamaskConnected) return

        console.log('Connecting to metamask...')

        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' })

          const browserProvider = new ethers.BrowserProvider(window.ethereum)

          await this.validateNetwork(browserProvider)

          this.$set(this, 'metamaskConnected', true)
          this.$set(this, 'browserProvider', browserProvider)

          await this.setWriteContractInstance()
        } catch (error) {
          console.error('Error when connecting to metamask', error)
        }
      } else {
        console.error(this.installMetamaskMsg)
      }
    },
    async sendTransaction (methodName, inputs) {
      console.log({ methodName, inputs })
      const methodIndex = this.contractAbi[this.CATEGORIES.WRITE_METHODS].findIndex(m => m.name === methodName)
      const method = this.contractAbi[this.CATEGORIES.WRITE_METHODS][methodIndex]
      this.$set(method.interactionData, 'message', { content: 'Sending transaction...', style: 'message-info' })

      console.log({ methodName, inputs, method })

      try {
        await this.validateNetwork(this.browserProvider)
        const contract = this.contractInstances.write
        const args = inputs

        if (!contract) throw new Error('Connect to metamask first')

        // inputs validations
        if (inputs.length < method.inputs.length) throw new Error(`Invalid number of parameters for "${methodName}". Got ${inputs.length} expected ${method.inputs.length}!`)

        method.inputs.forEach((input, index) => {
          const { type } = input

          if (type === 'address') {
            args[index] = this.normalizeAddress(args[index])
          } else if (type === 'bool') {
            throw new Error('Invalid boolean input (possible values: true, false, 1, 0)')
          } else if (type.startsWith('uint') || type.startsWith('int')) {
            args[index] = this.formatBigNumber(args[index])
          }
        })

        // Error: missing r
        // random error with ethers and metamask: https://github.com/ethers-io/ethers.js/issues/4513#:~:text=yes.%20It%20is%20a%20random%20error.%20I%20would%20be%20great%20at%20least%20if%20we%20can%20catch%20it.
        // Possible way to reproduce it: https://github.com/ethers-io/ethers.js/issues/4513#:~:text=yes.%20that%20is%20the%20way%20to%20reproduce%20the%20error.%20send%20the%20same%20transaction%20two%20times%20in%20a%20row
        // If issue persists, downgrade to ethers v5
        const tx = await contract[methodName](...args)
        this.$set(method.interactionData, 'message', { content: 'Transaction sent. Waiting for confirmation...', style: 'message-info' })
        console.log('Transaction sent. Waiting for confirmation...', tx)

        const receipt = await tx.wait()
        this.$set(method.interactionData, 'message', { content: `Transaction confirmed. Hash: ${tx.hash}`, style: 'message-info' }) // TODO: add button for explorer tx in new tab according to network
        console.log('Transaction confirmed. Receipt:', receipt)
      } catch (error) {
        console.error(error)

        this.$set(method.interactionData, 'message', { content: error.message, style: 'message-error' })
      }
    },
    async contractCall (methodName, inputs) {
      console.log({ methodName, inputs })
      const methodIndex = this.contractAbi[this.CATEGORIES.READ_METHODS].findIndex(m => m.name === methodName)
      const method = this.contractAbi[this.CATEGORIES.READ_METHODS][methodIndex]
      this.$set(method.interactionData, 'message', { content: 'calling contract...', style: 'message-info' })

      console.log({ methodName, inputs, method })

      try {
        // inputs validations
        if (inputs.length < method.inputs.length) throw new Error(`Invalid number of parameters for "${methodName}". Got ${inputs.length} expected ${method.inputs.length}!`)
        console.log('contractCall: validating network...')
        await this.validateNetwork(this.jsonRpcProvider)

        const contract = this.getReadOnlyContractInstance()
        const args = inputs

        method.inputs.forEach((input, index) => {
          const { type } = input

          if (type === 'address') {
            // normalize non checksummed addresses
            args[index] = this.normalizeAddress(args[index])
          } else if (type === 'bool') {
            if (!this.isValidBoolean(args[index])) throw new Error('Invalid boolean input (possible values: true, false, 1, 0)')
          }
        })

        // Note: When function has multiple outputs, ethers returns result as a proxy
        const result = await contract[methodName](...args)
        console.log('Result:', result)

        if (method.outputs.length > 1) {
          method.outputs.forEach((_, index) => {
            console.log({ index, result: result[index] })
            this.$set(method.interactionData.outputs, index, result[index])
          })
        } else {
          // single output
          this.$set(method.interactionData.outputs, 0, result)
        }

        this.$set(method.interactionData, 'message', { content: null, style: 'message-info' })
        console.log({ method })
      } catch (error) {
        console.error(error)

        this.$set(method.interactionData, 'outputs', [])
        this.$set(method.interactionData, 'message', { content: error.message, style: 'message-error' })
      }
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
      return ethers.toBigInt(num)
    }
  },
  mounted () {
    this.setContractAbi()
  }
}
</script>

<style>
.contract-interaction {
  color: #fff;
  width: 100%;
}

.methods-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
}

</style>
