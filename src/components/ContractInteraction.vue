<template>
  <!-- Contract Interaction -->
  <div v-if="loading">
    <Loader type="section" :fixed="false" />
  </div>
  <div v-else class="contract-interaction section">
    <div v-if="isProxy && !implementation.verified" class="unverified-implementation-msg">
      <p class="text-orange-900">{{ implementation.unverifiedMsg }}</p>
      <a class="implementation-address-link" :href="`${siteUrl()}address/${getImplementationAddress()}`" target="_blank">
        <span class="text-white-400">Implementation address:</span>
        <span>{{ getImplementationAddress() }}</span>
        <icon class="small" name="link-external" />
      </a>
    </div>
    <div v-else>
      <div class="wallet-connect-container">
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
          <button v-if="!this.metamaskConnected" class="btn btn-connect" @click="connectToMetamask">Connect to Metamask</button>
          <div v-else>
            <p class="metamask-title">Metamask Connected!</p>
            <span>Address:
              <tool-tip :text="this.signerAddress" :trim="false" :hideCopy="false" />
            </span>
            <div class="accounts-changed-message-container" v-if="accountsChanged">
              <p class="text-white-100">Current account changed to <span class="underline">{{ currentAccount }}</span>.</p>
              <p class="text-white-400">Click the button below if you want to interact with this new account.</p>
              <button class="btn" @click="updateInteractionAccount">Use new account</button>
            </div>
          </div>
        </div>
      </div>
      <div class="methods-container">
        <div class="btn-content">
          <button
            v-if="isProxy"
            class="btn"
            :style="getMethodsHeaderTabStyle(METHOD_TABS_IDS.readProxy)"
            @click="updateCurrentMethodsView(METHOD_TABS_IDS.readProxy)"
          >
            Read Proxy
          </button>
          <button
            v-if="isProxy"
            class="btn"
            :style="getMethodsHeaderTabStyle(METHOD_TABS_IDS.writeProxy)"
            @click="updateCurrentMethodsView(METHOD_TABS_IDS.writeProxy)"
          >
            Write Proxy
          </button>
          <button
            class="btn"
            :style="getMethodsHeaderTabStyle(METHOD_TABS_IDS.readContract)"
            @click="updateCurrentMethodsView(METHOD_TABS_IDS.readContract)"
          >
            Read Contract
          </button>
          <button
            class="btn"
            :style="getMethodsHeaderTabStyle(METHOD_TABS_IDS.writeContract)"
            @click="updateCurrentMethodsView(METHOD_TABS_IDS.writeContract)"
          >
            Write Contract
          </button>
        </div>
        <div class="methods-content">
          <ContractMethods
            v-if="isProxy && isActiveMethodsTab(METHOD_TABS_IDS.readProxy)"
            title="Read Proxy"
            :key="METHOD_TABS_IDS.readProxy"
            :contract-type="CONTRACT_TYPES.proxy"
            :methodsType="INTERACTION_METHOD_TYPES.read"
            :methods="isProxy ? proxyContractAbi.readMethods : contractAbi.readMethods"
            @handle-interaction="contractCall"
          />
          <ContractMethods
            v-else-if="isProxy && isActiveMethodsTab(METHOD_TABS_IDS.writeProxy)"
            title="Write Proxy"
            :key="METHOD_TABS_IDS.writeProxy"
            :contract-type="CONTRACT_TYPES.proxy"
            :methodsType="INTERACTION_METHOD_TYPES.write"
            :methods="proxyContractAbi.writeMethods"
            @handle-interaction="sendTransaction"
            :disableCalls="!metamaskConnected"
          />
          <ContractMethods
            v-else-if="isActiveMethodsTab(METHOD_TABS_IDS.readContract)"
            title="Read Contract"
            :key="METHOD_TABS_IDS.readContract"
            :contract-type="CONTRACT_TYPES.normal"
            :methodsType="INTERACTION_METHOD_TYPES.read"
            :methods="contractAbi.readMethods"
            @handle-interaction="contractCall"
          />
          <ContractMethods
            v-else-if="isActiveMethodsTab(METHOD_TABS_IDS.writeContract)"
            title="Write Contract"
            :key="METHOD_TABS_IDS.writeContract"
            :contract-type="CONTRACT_TYPES.normal"
            :methodsType="INTERACTION_METHOD_TYPES.write"
            :methods="contractAbi.writeMethods"
            @handle-interaction="sendTransaction"
            :disableCalls="!metamaskConnected"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { jsonRpcProvider, browserProvider, rskNetworks, envNetwork } from '../jsonRpcProvider'
import { BigNumber, ethers } from 'ethers'
import ContractMethods from './ContractMethods.vue'
import ToolTip from './General/Tooltip.vue'
import { PAGE_COLORS } from '@/config/pageColors'
import { mapActions, mapGetters } from 'vuex'
import { bridge, ALLOWED_BRIDGE_METHODS, isAllowedMethod } from '../config/entities/lib/bridge'
import { ABI_CATEGORIES, INTERACTION_METHOD_TYPES, CONTRACT_TYPES, removeNonFunctionFragmentsFromAbi } from '../config/entities/lib/contractInteraction'
import { isAddress } from 'ethers/lib/utils'
import Loader from './Loaders/Loader.vue'

export default {
  name: 'contract-interaction',
  components: {
    ContractMethods,
    ToolTip,
    Loader
  },
  props: ['data'],
  data () {
    const METHOD_TABS_IDS = {
      readProxy: 'readProxy',
      writeProxy: 'writeProxy',
      readContract: 'readContract',
      writeContract: 'writeContract'
    }

    const KEYS = {
      IMPLEMENTATION_DATA: '__implementationData'
    }

    return {
      PAGE_COLORS,
      ALLOWED_BRIDGE_METHODS,
      ABI_CATEGORIES,
      INTERACTION_METHOD_TYPES,
      CONTRACT_TYPES,
      METHOD_TABS_IDS,
      KEYS,
      currentMethodsViewSelector: METHOD_TABS_IDS.readContract,
      proxyContractAbi: {
        [ABI_CATEGORIES.contractConstructor]: null,
        [ABI_CATEGORIES.events]: [],
        [ABI_CATEGORIES.readMethods]: [],
        [ABI_CATEGORIES.writeMethods]: []
      },
      contractAbi: {
        [ABI_CATEGORIES.contractConstructor]: null,
        [ABI_CATEGORIES.events]: [],
        [ABI_CATEGORIES.readMethods]: [],
        [ABI_CATEGORIES.writeMethods]: []
      },
      contractInstances: {
        [CONTRACT_TYPES.proxy]: {
          [INTERACTION_METHOD_TYPES.read]: null,
          [INTERACTION_METHOD_TYPES.write]: null,
          [INTERACTION_METHOD_TYPES.simulation]: null
        },
        [CONTRACT_TYPES.normal]: {
          [INTERACTION_METHOD_TYPES.read]: null,
          [INTERACTION_METHOD_TYPES.write]: null,
          [INTERACTION_METHOD_TYPES.simulation]: null
        }
      },
      jsonRpcProvider: jsonRpcProvider(),
      metamaskConnected: false,
      showMetamaskNotInstalledMsg: false,
      installMetamaskMsg: 'MetaMask extension is not installed. Please install it first:',
      metamaskExtensionUrl: 'https://metamask.io/download/',
      disclaimerMsg: 'Please take note that this is a beta version feature and is provided on an "as is" and "as available" basis. Rootstock Explorer does not give any warranties and will not be liable for any loss, direct or indirect through continued use of this feature.',
      browserProvider: browserProvider(),
      signer: null,
      signerAddress: null,
      networkChanged: false,
      accountsChanged: false,
      currentAccount: null,
      isProxy: null,
      implementation: {
        address: null,
        data: null,
        verified: false,
        unverifiedMsg: 'Implementation contract is not verified. Please verify it to enable interactions.'
      },
      loading: true
    }
  },
  computed: {
    contractAddress () {
      return this.data.address
    },
    isBridge () {
      return this.data.address === bridge.address
    }
  },
  methods: {
    ...mapActions(['fetchData']),
    ...mapGetters(['isRequesting', 'getPage']),
    validateMethodsTabId (methodsTabId) {
      if (!this.METHOD_TABS_IDS[methodsTabId]) throw new Error(`Invalid methods tab id provided: ${methodsTabId}`)
    },
    getMethodsHeaderTabStyle (methodsTabId) {
      const { validateMethodsTabId, currentMethodsViewSelector } = this
      validateMethodsTabId(methodsTabId)

      const backgroundColor = currentMethodsViewSelector === methodsTabId ? PAGE_COLORS[this.$route.name].cl : ''

      return { backgroundColor }
    },
    updateCurrentMethodsView (methodsTabId) {
      this.validateMethodsTabId(methodsTabId)
      this.$set(this, 'currentMethodsViewSelector', methodsTabId)
    },
    isActiveMethodsTab (methodsTabId) {
      const { validateMethodsTabId, currentMethodsViewSelector } = this
      validateMethodsTabId(methodsTabId)

      return currentMethodsViewSelector === methodsTabId
    },
    getAbi () {
      const { isBridge, isProxy, getImplementationData, setVerified } = this
      let abi

      if (isBridge) { // bridge
        abi = bridge.abi
      } else if (isProxy) { // proxies
        const implementationData = getImplementationData()

        if (!implementationData.verification || !implementationData.verification.abi) {
          setVerified(false)
          console.warn(this.implementation.unverifiedMsg)
        } else {
          setVerified(true)
          abi = implementationData.verification.abi
        }
      } else { // normal contracts
        abi = this.data.verification.abi
      }

      return abi || []
    },
    fetchAddressData (address) {
      if (!isAddress(address)) throw new Error(`Address data fetch: Invalid address provided: ${address}`)

      this.fetchData({
        module: 'addresses',
        action: 'getAddress',
        key: this.KEYS.IMPLEMENTATION_DATA,
        params: { address }
      })
    },
    isRequestingImplementationAddressData () {
      return this.isRequesting()(this.KEYS.IMPLEMENTATION_DATA)
    },
    getImplementationDataFromStore () {
      const responseData = this.getPage()(this.KEYS.IMPLEMENTATION_DATA)

      if (!responseData.data.address) throw new Error('Invalid response data:', { responseData })

      return responseData.data
    },
    setImplementationData (data) {
      this.$set(this.implementation, 'data', data)
    },
    getImplementationData () {
      return this.implementation.data
    },
    getImplementationAddress () {
      return this.implementation.address
    },
    cloneElement (element) {
      if (!element) throw new Error('Invalid value provided')
      if (ethers.BigNumber.isBigNumber(element)) return ethers.BigNumber.from(element)

      return JSON.parse(JSON.stringify(element))
    },
    registerAbiFragment (fragment, category, contractAbiContext) {
      const { ABI_CATEGORIES, cloneElement } = this
      const validCategory = ABI_CATEGORIES[category]
      const validcontractAbiContext = Object.values(ABI_CATEGORIES).every(category => {
        return typeof contractAbiContext === 'object' && Object.prototype.hasOwnProperty.call(contractAbiContext, category)
      })

      if (!validCategory) throw new Error(`Unknown category: ${category} for abi fragment:`, fragment)

      if (!validcontractAbiContext) {
        console.log('Invalid contractAbiContext:', contractAbiContext)
        throw new Error('Invalid contract abi context provided')
      }

      const abiFragment = cloneElement(fragment)

      if (category === ABI_CATEGORIES.contractConstructor) {
        contractAbiContext[ABI_CATEGORIES.contractConstructor] = abiFragment
      } else if (category === ABI_CATEGORIES.events) {
        contractAbiContext[ABI_CATEGORIES.events].push(abiFragment)
      } else if (category === ABI_CATEGORIES.readMethods || category === ABI_CATEGORIES.writeMethods) {
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
          interactionMode: INTERACTION_METHOD_TYPES.read
        })

        contractAbiContext[category].push(abiFragment)
      }
    },
    getFragmentsRegistrator (contractAbiContext) {
      const { isBridge, ABI_CATEGORIES, registerAbiFragment, getFragmentCategory } = this

      const registrator = Object.freeze({
        register: (fragment) => {
          const { type, name } = fragment

          // bridge custom register
          if (isBridge) {
            // Constructor: none
            if (type === 'event') {
              registerAbiFragment(fragment, ABI_CATEGORIES.events, contractAbiContext)
            } else if (type === 'function') {
              if (isAllowedMethod(name, INTERACTION_METHOD_TYPES.read)) {
                registerAbiFragment(fragment, ABI_CATEGORIES.readMethods, contractAbiContext)
              } else if (isAllowedMethod(name, INTERACTION_METHOD_TYPES.write)) {
                registerAbiFragment(fragment, ABI_CATEGORIES.writeMethods, contractAbiContext)
              }
            }

            return
          }

          // default register
          registerAbiFragment(fragment, getFragmentCategory(fragment), contractAbiContext)
        }
      })

      return registrator
    },
    getCategoriesMappers () {
      const categoriesMappers = {
        // constructor
        // event
        // function
        // fallback (not required)
        // receive (not required)
        // error (not required)
        constructor: (fragment) => ABI_CATEGORIES.contractConstructor,
        event: (fragment) => ABI_CATEGORIES.events,
        function: (fragment) => {
          const { stateMutability } = fragment
          const read = stateMutability === 'view' || stateMutability === 'pure'
          const write = stateMutability === 'nonpayable' || stateMutability === 'payable'

          if (read) {
            return ABI_CATEGORIES.readMethods
          } else if (write) {
            return ABI_CATEGORIES.writeMethods
          } else {
            console.warn(`Unknown method type '${stateMutability}' for fragment:`, fragment)
            throw new Error(`Unknown method type provided: '${stateMutability}'`)
          }
        }
      }

      return categoriesMappers
    },
    getFragmentCategory (fragment) {
      const { getCategoriesMappers } = this
      if (!fragment || !fragment.type) throw new Error(`Invalid fragment provided: ${fragment}`)

      const categoriesMapper = getCategoriesMappers()
      const categoryMapper = categoriesMapper[fragment.type]

      return categoryMapper(fragment)
    },
    async isProxyContract () {
      const isProxy = this.data.type === 'contract' && this.data.contractInterfaces && this.data.contractInterfaces.includes('ERC1967')

      if (!isProxy) {
        this.$set(this, 'isProxy', false)
        return this.isProxy
      }

      // --- //
      // Extra check to ensure it really is a proxy. Required until false ERC1967 contract positives are removed from db. (rsk-contract-parser bug)
      const IMPLEMENTATION_SLOT = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'
      const implementationSlotValue = await this.jsonRpcProvider.getStorageAt(this.data.address, IMPLEMENTATION_SLOT)
      const falsePositive = BigNumber.from(implementationSlotValue).isZero()

      if (falsePositive) {
        // then remove false positive
        const contractInterfaces = this.data.contractInterfaces || []
        const curatedInterfaces = contractInterfaces.filter(v => v !== 'ERC1967')

        this.data.contractInterfaces = curatedInterfaces.length ? curatedInterfaces : undefined
        this.$set(this, 'isProxy', false)

        return this.isProxy
      }
      // --- //

      this.$set(this, 'isProxy', true)
      this.$set(this.implementation, 'address', this.parseImplementationAddress(implementationSlotValue))

      return this.isProxy
    },
    parseImplementationAddress (slotValue) {
      const address = `0x${slotValue.slice(-40)}`

      if (!isAddress(address)) throw new Error(`Slot does not contain an address: ${slotValue}`)

      return address
    },
    setContractAbi (contractAbiContext, abi) {
      const { getFragmentsRegistrator } = this
      const registrator = getFragmentsRegistrator(contractAbiContext)

      removeNonFunctionFragmentsFromAbi(abi).forEach(registrator.register)
    },
    createContract (address, abi, signerOrProvider) {
      return new ethers.Contract(address, abi, signerOrProvider)
    },
    async setContractInstance (address, abi, contractInstanceType, methodsType, useSigner) {
      const { CONTRACT_TYPES, INTERACTION_METHOD_TYPES, contractInstances, createContract } = this

      const validAddress = address && isAddress(address)
      const validAbi = abi && Array.isArray(abi)

      if (!validAddress) throw new Error(`Invalid address provided: ${address}`)
      if (!validAbi) throw new Error(`Invalid ABI provided: ${methodsType}`)
      if (!CONTRACT_TYPES[contractInstanceType]) throw new Error(`Unknown contract type: ${contractInstanceType}`)
      if (!INTERACTION_METHOD_TYPES[methodsType]) throw new Error(`Unknown methods type: ${methodsType}`)

      let contractInstance
      let context
      const proxyContractInstances = contractInstances[CONTRACT_TYPES.proxy]
      const normalContractInstances = contractInstances[CONTRACT_TYPES.normal]
      const newSigner = this.browserProvider.getSigner()
      const newSignerAddress = await newSigner.getAddress()

      this.$set(this, 'signer', newSigner)
      this.$set(this, 'signerAddress', newSignerAddress)

      // constract instance creation
      if (methodsType === INTERACTION_METHOD_TYPES.write) {
        // write contracts
        contractInstance = createContract(address, abi, this.signer)
      } else {
        // read and simulation contracts
        if (useSigner) {
          // when user connects its wallet
          contractInstance = createContract(address, abi, this.signer)
        } else {
          // when no wallet is connected
          contractInstance = createContract(address, abi, this.jsonRpcProvider)
        }
      }

      // context assignment
      const proxyInstance = contractInstanceType === CONTRACT_TYPES.proxy
      const normalInstance = contractInstanceType === CONTRACT_TYPES.normal

      if (proxyInstance) {
        context = proxyContractInstances
      } else if (normalInstance) {
        context = normalContractInstances
      }

      this.$set(context, methodsType, contractInstance)
    },
    isWriteMethod (method) {
      const { ABI_CATEGORIES, filterAbiMethodsByName, contractAbi } = this

      if (!method || !method.name) throw new Error(`Invalid method provided: ${method}`)

      // Just checking contractAbi is enough for all cases
      const ocurrences = filterAbiMethodsByName(contractAbi[ABI_CATEGORIES.writeMethods], method.name)

      return ocurrences.length >= 1
    },
    filterAbiMethodsByName (methods, methodName) {
      if (!Array.isArray(methods)) throw new Error(`Invalid methods array provided: ${methods}`)

      return methods.filter(method => method.name === methodName)
    },
    getSimulationFragmentFromWriteMethod (fragment) {
      const { cloneElement } = this
      if (!fragment || !fragment.name) throw new Error(`Error while creating simulation fragment. Invalid fragment provided: ${fragment}`)

      return {
        ...cloneElement(fragment),
        constant: true,
        stateMutability: 'view' // what about 'pure'? should be even considered?
      }
    },
    getSimulationFragmentMethods (abi) {
      const { isWriteMethod, getSimulationFragmentFromWriteMethod } = this

      if (!Array.isArray(abi)) throw new Error(`Invalid abi provided: ${abi}`)

      return removeNonFunctionFragmentsFromAbi(abi)
        .filter(isWriteMethod)
        .map(getSimulationFragmentFromWriteMethod)
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
    async updateInteractionAccount () {
      try {
        await this.connectToMetamask(true)
      } catch (error) {
        console.error('Error while updating interactions account')
        console.error(error)
      }
    },
    async setProxyContracts (useSigner) {
      try {
        const { contractAddress, getAbi, getSimulationFragmentMethods, getImplementationAddress, setContractInstance } = this
        const abi = getAbi()
        const simulationsAbi = getSimulationFragmentMethods(abi)
        const proxyAddress = contractAddress
        const implementationAddress = getImplementationAddress()
        const { proxy, normal } = CONTRACT_TYPES
        const { read, write, simulation } = INTERACTION_METHOD_TYPES

        // load read contracts
        await setContractInstance(proxyAddress, abi, proxy, read, useSigner)
        await setContractInstance(implementationAddress, abi, normal, read, useSigner)

        // load write contracts
        await setContractInstance(proxyAddress, abi, proxy, write)
        await setContractInstance(implementationAddress, abi, normal, write)

        // load simulations
        await setContractInstance(proxyAddress, simulationsAbi, proxy, simulation, useSigner)
        await setContractInstance(implementationAddress, simulationsAbi, normal, simulation, useSigner)
      } catch (error) {
        console.error('Error while creating proxy contract instances')
        console.error(error)
      }
    },
    async setContracts (useSigner) {
      try {
        const { contractAddress, getAbi, setContractInstance, getSimulationFragmentMethods } = this
        const abi = getAbi()
        const { normal } = CONTRACT_TYPES
        const { read, write, simulation } = INTERACTION_METHOD_TYPES

        // load read contract
        await setContractInstance(contractAddress, abi, normal, read, useSigner)

        // load write contract
        await setContractInstance(contractAddress, abi, normal, write)

        // load simulation
        await setContractInstance(contractAddress, getSimulationFragmentMethods(abi), normal, simulation, useSigner)
      } catch (error) {
        console.error('Error while creating contract instances')
        console.error(error)
      }
    },
    async connectToMetamask (isAccountOrNetworkSwitch) {
      if (!isAccountOrNetworkSwitch) {
        // prompt user confirmation
        const userConfirmation = confirm(this.disclaimerMsg)

        if (!userConfirmation) return
      }

      const {
        connectToRskNetwork,
        isProxy,
        setProxyContracts,
        setContracts,
        setAccountsChanged,
        setMetamaskConnected
      } = this

      localStorage.setItem('metamaskAutoconnect', false)

      if (window.ethereum) {
        try {
          await connectToRskNetwork()
          setMetamaskConnected(true)

          const useSigner = true
          if (isProxy) {
            await setProxyContracts(useSigner)
          } else {
            await setContracts(useSigner)
          }

          setAccountsChanged(false)
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
          throw new Error(`Invalid array format provided. Wrap the values with []: ${input}`)
        } else if (invalidTuple) {
          throw new Error(`Invalid tuple format provided. Wrap the values with []: ${input}`)
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
    validateCallParams (method, contractType, methodsType) {
      const { CONTRACT_TYPES, INTERACTION_METHOD_TYPES } = this

      if (!method || !method.name) throw new Error(`Invalid method: ${method}`)
      if (!CONTRACT_TYPES[contractType]) throw new Error(`Invalid contract type: ${contractType}`)
      if (!INTERACTION_METHOD_TYPES[methodsType]) throw new Error(`Invalid methods type: ${methodsType}`)
    },
    getContractInstance (contractType, methodsType) {
      const { contractInstances, CONTRACT_TYPES, INTERACTION_METHOD_TYPES } = this

      if (!CONTRACT_TYPES[contractType]) throw new Error(`Invalid interaction method type provided: ${contractType}`)
      if (!INTERACTION_METHOD_TYPES[methodsType]) throw new Error(`Invalid interaction method type provided: ${contractType}`)

      return contractInstances[contractType][methodsType]
    },
    async contractCall (method, inputs, contractType, methodsType) {
      const { validateCallParams, validateInputs, formatInputs, updateMethodOutputs, getContractInstance } = this

      validateCallParams(method, contractType, methodsType)

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

        const contract = getContractInstance(contractType, methodsType)
        const methodName = method.name
        const inputsDefinitions = method.inputs
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
    async sendTransaction (method, inputs, contractType, methodsType) {
      const { validateCallParams, INTERACTION_METHOD_TYPES, getContractInstance, formatInputs, updateMethodOutputs, validateInputs } = this

      validateCallParams(method, contractType, methodsType)

      try {
        validateInputs(inputs, method)

        this.$set(method, 'interactionData', {
          ...method.interactionData,
          requested: true,
          hash: {
            content: null,
            style: 'message-info'
          }
        })

        const methodName = method.name
        const contract = getContractInstance(contractType, methodsType)
        const inputsDefinitions = method.inputs
        const args = formatInputs(inputs, inputsDefinitions)
        const isSimulation = methodsType === INTERACTION_METHOD_TYPES.simulation

        if (isSimulation) {
          this.$set(method, 'interactionData', {
            ...method.interactionData,
            message: {
              content: 'Calling contract...',
              style: 'message-success'
            }
          })

          const result = await contract[methodName](...args)

          updateMethodOutputs(result, method)
        } else {
          // transact
          this.$set(method, 'interactionData', {
            ...method.interactionData,
            message: {
              content: 'Sending transaction...',
              style: 'message-success'
            }
          })

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
    },
    setLoading (bool) {
      this.$set(this, 'loading', bool)
    },
    setVerified (bool) {
      this.$set(this.implementation, 'verified', bool)
    },
    handleAccountsChanged (accounts) {
      console.log('Warning: User changed accounts')
      this.setAccountsChanged(true)
      this.setCurrentAccount(accounts[0])
    },
    setAccountsChanged (bool) {
      this.$set(this, 'accountsChanged', bool)
    },
    setCurrentAccount (address) {
      this.$set(this, 'currentAccount', address)
    },
    setMetamaskConnected (bool) {
      this.$set(this, 'metamaskConnected', bool)
    }
  },
  async mounted () {
    const {
      INTERACTION_METHOD_TYPES,
      isProxyContract,
      isRequestingImplementationAddressData,
      getImplementationAddress,
      fetchAddressData,
      getImplementationDataFromStore,
      setImplementationData,
      updateCurrentMethodsView,
      setContractAbi,
      proxyContractAbi,
      contractAbi,
      setContractInstance,
      contractAddress,
      setLoading
    } = this

    setLoading(true)

    const isProxy = await isProxyContract()

    if (isProxy) {
      updateCurrentMethodsView(this.METHOD_TABS_IDS.readProxy)
      fetchAddressData(getImplementationAddress())

      const waitTime = 1000
      // const startTime = Date.now()
      while (isRequestingImplementationAddressData()) {
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }

      setImplementationData(getImplementationDataFromStore())
    }

    const abi = this.getAbi() // all fragments, for contract instances
    const abiMethods = removeNonFunctionFragmentsFromAbi(abi) // function fragments, for methods interaction

    if (isProxy) {
      const proxyAddress = contractAddress
      const implementationAddress = getImplementationAddress()

      setContractAbi(proxyContractAbi, abiMethods)
      setContractAbi(contractAbi, abiMethods)
      setContractInstance(proxyAddress, abi, CONTRACT_TYPES.proxy, INTERACTION_METHOD_TYPES.read)
      setContractInstance(implementationAddress, abi, CONTRACT_TYPES.normal, INTERACTION_METHOD_TYPES.read)
    } else {
      setContractAbi(contractAbi, abi)
      setContractInstance(contractAddress, abi, CONTRACT_TYPES.normal, INTERACTION_METHOD_TYPES.read)
    }

    if (window.ethereum) {
      window.ethereum.on('chainChanged', this.handleChainChanged)
      window.ethereum.on('accountsChanged', this.handleAccountsChanged)
    }

    setLoading(false)

    // Note: Metamask autoconnection only triggers after switching to an rsk network
    const metamaskAutoconnect = localStorage.getItem('metamaskAutoconnect') === 'true'
    if (metamaskAutoconnect) await this.connectToMetamask(true)
  },
  beforeDestroy () {
    if (window.ethereum) {
      window.ethereum.removeListener('chainChanged', this.handleChainChanged)
      window.ethereum.removeListener('accountsChanged', this.handleAccountsChanged)
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
  .wallet-connect-container {
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

  .unverified-implementation-msg {
    margin-top: 20px;
  }

  .implementation-address-link {
    color: #bbb;
    transition: color 0.3s ease;
    display: flex;
    gap: 5px;
  }

  .accounts-changed-message-container {
    margin-top: 20px;

    .btn {
      margin-top: 10px;
      font-size: 12px;
      border: 1px solid $newbw_700;
      padding: 8px;
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

.underline {
  text-decoration: underline;
}
}
</style>
