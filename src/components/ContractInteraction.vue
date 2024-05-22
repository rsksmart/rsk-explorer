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
      <div class="methods-list">
        <h3 class="methods-category-title capitalize">Read Methods ({{ contractAbi.readMethods.length }})</h3>
        <div class="method" v-for="(method, index) of contractAbi.readMethods" :key="index">
          <button class="method-name button" @click="contractCall(method.name, method.interactionData.inputs)">{{ method.name }}</button>
          <!-- Inputs -->
          <div v-if="method.inputs && method.inputs.length > 0">
            <div class="method-input" v-for="(input, i) of method.inputs" :key="i">
              <label class="label">
                <p>{{ input.name || '&lt;input&gt;' }}</p>
                <span class="type">({{ input.type }})</span>
              </label>
              <input class="method-input-field" type="text" v-model="method.interactionData.inputs[i]" :placeholder="input.name || i">
            </div>
          </div>
          <!-- Result -->
          <div class="divider"></div>
          <div v-if="method.outputs && method.outputs.length > 0">
            <label class="label">
              <p>result</p>
              <span class="type">({{ method.outputs.map(output => output.type).join(', ') }})</span>
            </label>
            <div v-for="(output, i) of method.outputs" :key="i">
              <div class="method-output">
                <p class="method-output-value">{{ method.interactionData.outputs[i] ?? 'result' }}</p>
              </div>
            </div>
            <p class="method-output-message" v-if="method.interactionData.message.content" :class="`interaction-message ${method.interactionData.message.style}`">{{ method.interactionData.message.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { jsonRpcProvider } from '../jsonRpcProvider'
import { ethers } from 'ethers'

export default {
  name: 'contract-interaction',
  components: {},
  props: ['data'],
  data () {
    return {
      contractInstance: null,
      contractAbi: {
        contractConstructor: null,
        events: [],
        readMethods: [],
        writeMethods: []
        /*
          example:
          contractAbi: {
            contractConstructor: ...,
            events: [...],
            readMethods: [
              ... other methods ...
              {
                name: 'method name',
                type: 'function',
                stateMutability: 'view',
                inputs: [
                  ... other inputs ...
                  {
                    internalType: uint256
                    name: ""
                    type: uint256
                  }
                  ... other inputs ...
                ],
                outputs: [
                  ... other outputs ...
                  {
                    internalType: uint256
                    name: ""
                    type: uint256
                  }
                  ... other outputs ...
                ],
                interactionData: {
                  inputs: [inputValue1, inputValue2, ...]
                  outputs: [outputValue1, outputValue2, ...]
                  message: {
                    content: null | result message
                    style: 'message-error' | 'message-info'
                  }
                }
              }
              ... other methods ...
            ],
            writeMethods: [...]
          }
        */
      }
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
    abi () {
      return this.verification ? this.verification.abi : []
    },
    parsedAbi () {
      // categories definition and validation
      const CATEGORIES = {
        CONTRACT_CONSTRUCTOR: 'contractConstructor',
        EVENTS: 'events',
        READ_METHODS: 'readMethods',
        WRITE_METHODS: 'writeMethods'
      }

      const parsedAbi = {
        [CATEGORIES.CONTRACT_CONSTRUCTOR]: null,
        [CATEGORIES.EVENTS]: [],
        [CATEGORIES.READ_METHODS]: [],
        [CATEGORIES.WRITE_METHODS]: []
      }

      const addToCategory = (value, category) => {
        if (!Object.values(CATEGORIES).includes(category)) throw new Error(`Error parsing contract abi. Unknown category ${category} for value ${JSON.stringify(value)}`)

        if (category === CATEGORIES.CONTRACT_CONSTRUCTOR) {
          parsedAbi[CATEGORIES.CONTRACT_CONSTRUCTOR] = value
        } else if (category === CATEGORIES.EVENTS) {
          parsedAbi[category].push(value)
        } else if (category === CATEGORIES.READ_METHODS || category === CATEGORIES.WRITE_METHODS) {
          this.$set(value, 'interactionData', {
            inputs: [],
            outputs: [],
            message: {
              content: null,
              style: 'message-info'
            }
          })

          parsedAbi[category].push(value)
        }
      }

      // parse abi
      this.abi.forEach(value => {
        const { type, stateMutability } = value

        if (type === 'constructor') {
          addToCategory(parsedAbi[CATEGORIES.CONTRACT_CONSTRUCTOR], CATEGORIES.CONTRACT_CONSTRUCTOR)
        } else if (type === 'event') {
          addToCategory(value, CATEGORIES.EVENTS)
        } else if (type === 'function') {
          if (stateMutability === 'view') {
            addToCategory(value, CATEGORIES.READ_METHODS)
          } else if (stateMutability === 'nonpayable') {
            addToCategory(value, CATEGORIES.WRITE_METHODS)
          }
        }
      })

      return parsedAbi
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
    async contractCall (methodName, inputs) {
      const methodIndex = this.contractAbi.readMethods.findIndex(m => m.name === methodName)
      const method = this.contractAbi.readMethods[methodIndex]
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
          /*
            OK bool (uint8 restricted to values 0 and 1 in EVM. Can be 0, 1, true, false)
            OK uint8, uint16, uint24... uint256 = uint
            OK int8, int16, int24... int256 = int
            OK address == uint160 (type: "address", internalType: "address payable")
            OK address payable == uint160 (type: "address", internalType: "address payable")
            OK bytes1, bytes2, bytes3... bytes32
            OK string
            OK (not required) enum (https://docs.soliditylang.org/en/latest/types.html#enums)
            OK Custom types (based on underlying types: https://docs.soliditylang.org/en/latest/types.html#user-defined-value-types)
          */
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

.button {
  background-color: #555;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.button:hover {
  background-color: #222;
}

.button:active {
  background-color: #000;
}

.capitalize {
  text-transform: capitalize;
}

.methods-container {
  display: flex;
  flex-direction: row;
  width: 90%;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
}

.methods-list {
  flex: 1;
  max-width: 500px;
}

.methods-category-title {
  margin-bottom: 20px;
}

.method {
  margin-bottom: 20px;
  background-color: #333;
  padding: 10px;
  border-radius: 8px;
}

.method-name {
  margin-bottom: 10px;
}

.method-input {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 100%;
}

.label {
  display: flex;
  gap: 2px;
  align-items: center;
}

.type {
  font-style: italic;
  font-size: 12px;
}

.method-input-field {
  width: 100%;
  padding: 6px;
  border: 1px solid transparent;
  border-radius: 4px;
  box-sizing: border-box;
  outline: none;
  background-color: #444;
  color: #ffffff;
  transition: background-color 0.3s ease;
}

.method-input-field:focus {
  background-color: #555;
}

.method-output {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.method-output-value {
  padding: 4px;
  border: 1px solid #fff;
  border-radius: 4px;
  background-color: #444;
  color: #ccc;
  display: flex;
  align-items: center;
}

.interaction-message {
  padding: 5px;
}

.message-info {
  color: #ccc;
}

.message-error {
  color: #f00;
}

.divider {
  height: 1px;
  background-color: #888;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 10px;
}

</style>
