<template>
  <!-- Contract Interaction -->
  <div v-if="verification" class="contract-interaction section">
    <!-- TODO -->
    <!-- OK - Decide if apikey and json rpc call should be made directly or through explorer api (what do we win by coupling the jsonrpc calls to the explore api?) -->
    <!-- Add contract methods: title + input (if required) + result -->
    <!-- Add ethers to enable metamask wallet connection (required for sending txs (writes)) -->
    <!-- Connect to explorer API for requests -->
    <!-- Talk with Carlos about UI/UX -->
    <h3>Dev</h3>
    <button class="btn" @click="state">Component state</button>
    <button class="btn" @click="printAddressData">Address data</button>
    <button class="btn" @click="printJsonProvider">Json Provider</button>
    <button class="btn" @click="printRawContractABI">Raw Contract ABI</button>
    <button class="btn" @click="printParsedContractABI">Parsed Contract ABI</button>
    <button class="btn" @click="logContractInstance">contractInstance</button>
    <br><br><br>
    <div class="methods-container">
      <ContractMethods title="Read Methods" :methods="contractAbi.readMethods" :methodsCategory="CATEGORIES.READ_METHODS" @contract-call="contractCall" />
      <ContractMethods title="Write Methods" :methods="contractAbi.writeMethods" :methodsCategory="CATEGORIES.WRITE_METHODS" @contract-call="contractCall" />
    </div>
  </div>
</template>

<script>
import { jsonRpcProvider } from '../jsonRpcProvider'
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

    const contractInstance = null

    return {
      CATEGORIES,
      contractAbi,
      contractInstance
    }
  },
  computed: {
    jsonRpcProvider () {
      return jsonRpcProvider
    },
    getData () {
      return this.data
    },
    verification () {
      return this.getData.verification || {}
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
    printAddressData () {
      console.log(this.getData)
    },
    printJsonProvider () {
      console.log({ url: process.env.JSON_RPC_PROVIDER, instance: this.jsonRpcProvider })
    },
    printRawContractABI () {
      console.log(this.data.verification.abi)
    },
    printParsedContractABI () {
      const { contractConstructor, events, readMethods, writeMethods } = this.contractAbi
      console.log('Constructor:', contractConstructor)
      console.log('Events:', events)
      console.log('ReadMethods:', readMethods)
      console.log('WriteMethods:', writeMethods)
    },
    logContractInstance () {
      console.log(this.getContractInstance())
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
    setContractInstance () {
      const provider = this.jsonRpcProvider
      const contractAddress = this.data.verification.address
      const contractAbi = this.abi
      const contractInstance = new ethers.Contract(contractAddress, contractAbi, provider)

      this.$set(this, 'contractInstance', contractInstance)
    },
    getContractInstance () {
      if (!this.contractInstance) this.setContractInstance()

      return this.contractInstance
    },
    async contractCall (methodName, inputs, methodsCategory) {
      console.log({ methodName, inputs, methodsCategory })
      const methodIndex = this.contractAbi[methodsCategory].findIndex(m => m.name === methodName)
      const method = this.contractAbi[methodsCategory][methodIndex] || this.contractAbi.writeMethods[methodIndex]
      this.$set(method.interactionData, 'message', { content: 'calling contract...', style: 'message-info' })

      console.log({ methodName, inputs, method })

      try {
        const contractInstance = this.getContractInstance()
        const args = inputs

        // inputs validations
        if (inputs.length < method.inputs.length) throw new Error(`Invalid number of parameters for "${methodName}". Got ${inputs.length} expected ${method.inputs.length}!`)

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
        const result = await contractInstance[methodName](...args)
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
        console.log(error.message)

        this.$set(method.interactionData, 'outputs', [])
        this.$set(method.interactionData, 'message', { content: error.message, style: 'message-error' })
      }
    },
    state () {
      console.dir(this.$data, { depth: null })
    },
    validateString (value) {
      if (typeof value !== 'string') throw new Error('Invalid string')
    },
    normalizeAddress (address) {
      this.validateString(address)
      return address.toLowerCase()
    },
    isValidBoolean (text) {
      this.validateString(text)

      return /^(true|false|1|0)$/i.test(text)
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
}

.methods-container {
  display: flex;
  flex-direction: row;
  width: 90%;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
}

</style>
