<template>
  <!-- Contract Interaction -->
  <div class="contract-interaction section">
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
            <tool-tip :text="this.signerAddress" :trim="false" :hideCopy="false" />
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
          :isBridge="isBridge"
          :key="`read-${methodsKey}`"
        />
        <ContractMethods
          v-else
          title="Write Methods"
          :methods="contractAbi.writeMethods"
          @contract-interaction-handler="sendTransaction"
          methodsType="write"
          :isBridge="isBridge"
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
import { bridge, ALLOWED_BRIDGE_METHODS, METHOD_TYPES, isAllowedMethod, removeNonFunctionFragmentsFromAbi } from '../config/entities/lib/bridge'
import { isAddress } from 'ethers/lib/utils'

export default {
  name: 'contract-interaction',
  components: {
    ContractMethods,
    ToolTip
  },
  props: ['data'],
  data () {
    const ABI_CATEGORIES = {
      CONTRACT_CONSTRUCTOR: 'contractConstructor',
      EVENTS: 'events',
      READ_METHODS: 'readMethods',
      WRITE_METHODS: 'writeMethods'
    }

    return {
      PAGE_COLORS,
      ALLOWED_BRIDGE_METHODS,
      ABI_CATEGORIES,
      contractAbi: {
        [ABI_CATEGORIES.CONTRACT_CONSTRUCTOR]: null,
        [ABI_CATEGORIES.EVENTS]: [],
        [ABI_CATEGORIES.READ_METHODS]: [],
        [ABI_CATEGORIES.WRITE_METHODS]: []
      },
      contractInstances: {
        [METHOD_TYPES.read]: null,
        [METHOD_TYPES.write]: null,
        simulation: null
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
    contractAddress () {
      return this.data.address
    },
    isBridge () {
      return this.data.address === bridge.address
    },
    abi () {
      if (this.isBridge) return bridge.abi

      return (this.data.verification) ? this.data.verification.abi : null
    },
    getFragmentsRegistrator () {
      const { isBridge, ABI_CATEGORIES, contractAbi } = this

      const registerAbiFragment = (fragment, category) => {
        const abiFragment = { ...fragment }

        if (!Object.values(ABI_CATEGORIES).includes(category)) {
          throw new Error(`Error parsing contract abi. Unknown category: ${JSON.stringify(category)} for abi fragment ${JSON.stringify(abiFragment)}`)
        }

        if (category === ABI_CATEGORIES.CONTRACT_CONSTRUCTOR) {
          contractAbi[ABI_CATEGORIES.CONTRACT_CONSTRUCTOR] = abiFragment
        } else if (category === ABI_CATEGORIES.EVENTS) {
          contractAbi[ABI_CATEGORIES.EVENTS].push(abiFragment)
        } else if (category === ABI_CATEGORIES.READ_METHODS || category === ABI_CATEGORIES.WRITE_METHODS) {
          this.$set(abiFragment, 'interactionData', {
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
            requested: false,
            callType: 'call'
          })

          contractAbi[category].push(abiFragment)
        }
      }

      const registrator = Object.freeze({
        register: (fragment) => {
          // bridge register
          if (isBridge) {
            const { type, name } = fragment

            // Constructor: none
            if (type === 'event') {
              registerAbiFragment(fragment, ABI_CATEGORIES.EVENTS)
            } else if (type === 'function') {
              if (isAllowedMethod(name, METHOD_TYPES.read)) {
                registerAbiFragment(fragment, ABI_CATEGORIES.READ_METHODS)
              } else if (isAllowedMethod(name, METHOD_TYPES.write)) {
                registerAbiFragment(fragment, ABI_CATEGORIES.WRITE_METHODS)
              }
            }

            return
          }

          // default register
          const { type, stateMutability } = fragment

          if (type === 'constructor') {
            registerAbiFragment(fragment, ABI_CATEGORIES.CONTRACT_CONSTRUCTOR)
          } else if (type === 'event') {
            registerAbiFragment(fragment, ABI_CATEGORIES.EVENTS)
          } else if (type === 'function') {
            if (stateMutability === 'view' || stateMutability === 'pure') {
              registerAbiFragment(fragment, ABI_CATEGORIES.READ_METHODS)
            } else if (stateMutability === 'nonpayable' || stateMutability === 'payable') {
              registerAbiFragment(fragment, ABI_CATEGORIES.WRITE_METHODS)
            }
          }
        }
      })

      return registrator
    },
    abiWithSimulationMethods () {
      const { abi, getSimulationFragmentMethods } = this

      return [...abi, ...getSimulationFragmentMethods()]
    }
  },
  methods: {
    async determineProxy () {
      // This temporal guard is required until support for Proxies interaction is added.

      // --- //
      // Extra check to ensure it really is a proxy. Required until false ERC1967 contract positives are removed from db. (rsk-contract-parser bug)
      const IMPLEMENTATION_SLOT = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'
      const isProxy = this.data.type === 'contract' && this.data.contractInterfaces && this.data.contractInterfaces.includes('ERC1967')
      const implementationSlotValue = await this.jsonRpcProvider.getStorageAt(this.data.address, IMPLEMENTATION_SLOT)

      if (isProxy) {
        const notAProxy = BigNumber.from(implementationSlotValue).isZero()

        if (notAProxy) {
          // then remove false positive
          const contractInterfaces = this.data.contractInterfaces || []
          const curatedInterfaces = contractInterfaces.filter(v => v !== 'ERC1967')

          this.data.contractInterfaces = curatedInterfaces.length ? curatedInterfaces : undefined
        } else {
          this.isProxy = true
        }
      }
      // --- //
      return this.data.contractInterfaces && this.data.contractInterfaces.includes('ERC1967')
    },
    setContractAbi () {
      const { getFragmentsRegistrator, abi } = this

      abi.forEach(getFragmentsRegistrator.register)
    },
    setReadContractInstance () {
      const { contractAddress, abi, jsonRpcProvider } = this
      const contractInstance = new ethers.Contract(contractAddress, abi, jsonRpcProvider)
      this.$set(this.contractInstances, METHOD_TYPES.read, contractInstance)
    },
    async setWriteContractInstance () {
      const { contractAddress, abi, setSimulationContractInstance } = this
      const signer = await this.browserProvider.getSigner()
      const signerAddress = await signer.getAddress()
      const contractInstance = new ethers.Contract(contractAddress, abi, signer)

      this.$set(this.contractInstances, METHOD_TYPES.write, contractInstance)
      this.$set(this, 'signer', signer)
      this.$set(this, 'signerAddress', signerAddress)

      setSimulationContractInstance()
    },
    setSimulationContractInstance () {
      const { contractAddress, getSimulationFragmentMethods, jsonRpcProvider } = this
      const contractInstance = new ethers.Contract(contractAddress, getSimulationFragmentMethods(), jsonRpcProvider)

      this.$set(this.contractInstances, 'simulation', contractInstance)
    },
    getReadContractInstance () {
      return this.contractInstances[METHOD_TYPES.read]
    },
    getWriteContractInstance () {
      return this.contractInstances[METHOD_TYPES.write]
    },
    getSimulationContractInstance () {
      return this.contractInstances.simulation
    },
    isWriteMethod (name) {
      const { ABI_CATEGORIES } = this
      if (!name) throw new Error(`Invalid method name provided: ${JSON.stringify(name)}`)

      return this.contractAbi[ABI_CATEGORIES.WRITE_METHODS].some(method => method.name === name)
    },
    getSimulationFragment (fragment) {
      if (!fragment || !fragment.name) throw new Error(`Error while creating simulation fragment. Invalid fragment provided: ${JSON.stringify(fragment)}`)

      const { name } = fragment
      const { isWriteMethod } = this

      // only
      if (isWriteMethod(name)) {
        return {
          ...fragment,
          constant: true,
          stateMutability: 'view' // what about 'pure'? maybe use a selector?
        }
      }

      return fragment
    },
    getSimulationFragmentMethods () {
      const { abi, isWriteMethod, getSimulationFragment } = this

      const fragments = []

      removeNonFunctionFragmentsFromAbi(abi).forEach(fragment => {
        if (isWriteMethod) {
          fragments.push(getSimulationFragment(fragment))
        }
      })

      return fragments
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
    validateInputs (inputs, method) {
      const nonEmptyInputs = inputs.filter(input => input !== '' && input !== undefined && input !== null)
      const inputsDefinitions = method.inputs

      if (nonEmptyInputs.length !== inputsDefinitions.length) {
        throw new Error(`Invalid number of parameters for "${method.name}". Got ${nonEmptyInputs.length} expected ${inputsDefinitions.length}!`)
      }

      inputs.forEach((input, index) => {
        const type = inputsDefinitions[index].type
        const invalidAddress = type === 'address' && !isAddress(input)
        const invalidBoolean = type === 'bool' && !this.isValidBoolean(input)
        const invalidArray = type.includes('[]') && (!input.startsWith('[') || !input.endsWith(']'))
        const invalidTuple = type === 'tuple' && (!input.startsWith('[') || !input.endsWith(']')) // behaves like array
        const invalidInteger = (type.startsWith('uint') || type.startsWith('int')) && isNaN(parseInt(input))

        if (invalidAddress) {
          throw new Error(`Invalid address provided: ${input}`)
        } else if (invalidInteger) {
          throw new Error(`Invalid integer provided: ${input}`)
        } else if (invalidBoolean) {
          throw new Error(`Invalid boolean provided: ${input}`)
        } else if (invalidArray) {
          throw new Error(`Invalid array provided: ${input}`)
        } else if (invalidTuple) {
          throw new Error(`Invalid tuple provided: ${input}`)
        }
      })
    },
    formatInputs (inputs, inputsDefinitions) {
      const formattedInputs = inputsDefinitions.map((input, index) => {
        const { type } = input
        const isAddress = type === 'address'
        const isBoolean = type === 'bool'
        const isArray = type.includes('[]')
        const isTuple = type === 'tuple'
        const isInteger = type.startsWith('uint') || type.startsWith('int')

        if (isAddress) {
          return this.normalizeAddress(inputs[index])
        } else if (isInteger) {
          return this.formatBigNumber(inputs[index])
        } else if (isBoolean) {
          return inputs[index]
        } else if (isArray) {
          return this.parseArrayFromString(inputs[index])
        } else if (isTuple) {
          return this.parseArrayFromString(inputs[index]) // behaves like array
        } else {
          return inputs[index]
        }
      })

      return formattedInputs
    },
    updateMethodOutputs (result, method) {
      const outputDefinitions = method.outputs
      const multipleOutputs = outputDefinitions.length > 1
      const singleOutput = outputDefinitions.length === 1

      if (multipleOutputs) {
        outputDefinitions.forEach((_, index) => {
          this.$set(method.interactionData.outputs, index, result[index])
        })

        this.$set(method.interactionData, 'message', { content: null, style: 'message-info' })
      } else if (singleOutput) {
        this.$set(method.interactionData.outputs, 0, result)
        this.$set(method.interactionData, 'message', { content: null, style: 'message-info' })
      } else {
        this.$set(method.interactionData, 'message', { content: 'This method does not return any values.', style: 'message-info' })
      }
    },
    async contractCall (methodName, inputs) {
      const {
        contractAbi,
        ABI_CATEGORIES,
        getReadContractInstance,
        validateInputs,
        formatInputs,
        updateMethodOutputs
      } = this
      const method = contractAbi[ABI_CATEGORIES.READ_METHODS].find(m => m.name === methodName)
      const inputsDefinitions = method.inputs

      try {
        validateInputs(inputs, method)

        this.$set(method, 'interactionData', {
          ...method.interactionData,
          requested: true,
          message: {
            content: 'Calling contract...',
            style: 'message-info'
          }
        })

        const contract = getReadContractInstance()
        const args = formatInputs(inputs, inputsDefinitions)
        const result = await contract[methodName](...args)

        updateMethodOutputs(result, method)
      } catch (error) {
        console.error(error)

        this.$set(method, 'interactionData', {
          ...method.interactionData,
          outputs: [],
          message: {
            content: error.message,
            style: 'message-error'
          }
        })
      }

      this.$set(method.interactionData, 'requested', false)
    },
    async sendTransaction (methodName, inputs, callType) {
      const {
        contractAbi,
        ABI_CATEGORIES,
        getWriteContractInstance,
        getSimulationContractInstance,
        formatInputs,
        updateMethodOutputs,
        validateInputs
      } = this
      const method = contractAbi[ABI_CATEGORIES.WRITE_METHODS].find(m => m.name === methodName)

      try {
        validateInputs(inputs, method)

        this.$set(method, 'interactionData', {
          ...method.interactionData,
          requested: true,
          message: {
            content: callType === 'call' ? 'Calling contract...' : 'Sending transaction...',
            style: 'message-success'
          },
          hash: {
            content: null,
            style: 'message-info'
          }
        })

        const inputsDefinitions = method.inputs
        const args = formatInputs(inputs, inputsDefinitions)

        if (callType === 'call') {
          // simulate
          const contract = getSimulationContractInstance()
          const result = await contract[methodName](...args)

          updateMethodOutputs(result, method)
        } else {
          // transact
          const contract = getWriteContractInstance()
          const tx = await contract[methodName](...args)

          this.$set(method, 'interactionData', {
            ...method.interactionData,
            message: {
              content: 'Transaction sent. Waiting for confirmation... (estimated time: 30 secs)',
              style: 'message-success'
            },
            hash: {
              content: tx.hash,
              style: 'message-info'
            }
          })

          await tx.wait() // tx receipt

          this.$set(method.interactionData, 'message', {
            content: 'Transaction confirmed.',
            style: 'message-success'
          })
        }
      } catch (error) {
        console.error(error)

        this.$set(method.interactionData, 'message', {
          content: error.message,
          style: 'message-error'
        })
      }

      this.$set(method.interactionData, 'requested', false)
    },
    parseArrayFromString (str) {
      if (!str.startsWith('[') || !str.endsWith(']')) throw new Error('Value must be a valid array')

      return JSON.parse(str)
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
    this.setReadContractInstance()

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
