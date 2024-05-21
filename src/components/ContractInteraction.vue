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
          <button class="method-name button" @click="contractCall(method.name, method.interactionData.inputsValues)">{{ method.name }}</button>
          <!-- Inputs -->
          <div v-if="method.inputs && method.inputs.length > 0">
            <div class="method-input" v-for="(input, i) in method.inputs" :key="i">
              <label class="label">
                <p>{{ input.name || '&lt;input&gt;' }}</p>
                <span class="type">({{ input.type }})</span>
              </label>
              <input class="method-input-field" type="text" v-model="method.interactionData.inputsValues[i]" :placeholder="input.name || i">
            </div>
          </div>
          <!-- Result -->
          <div class="method-result">
            <label class="label">
                <p>Result</p>
                <span class="type">({{ method.outputs[0].type}})</span>
              </label>
            <p class="method-result-value">{{ method.interactionData.result ?? 'result' }}</p>
            <p class="method-result-message" v-if="method.interactionData.message">Error: {{ method.interactionData.message }}</p>
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
                  inputsValues: [inputValue1, inputValue2, ...]
                  result: null | response from rpc api
                  message: null | result message depending on result
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
            inputsValues: [],
            result: null,
            message: null
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
    async contractCall (methodName, inputsValues) {
      const methodIndex = this.contractAbi.readMethods.findIndex(m => m.name === methodName)
      const method = this.contractAbi.readMethods[methodIndex]
      this.$set(method.interactionData, 'result', 'calling contract...')
      this.$set(method.interactionData, 'message', null)

      try {
        const contractInstance = this.getContractInstance()
        const args = inputsValues

        // inputs validations
        if (inputsValues.length < method.inputs.length) throw new Error(`Invalid number of parameters for "${methodName}". Got ${inputsValues.length} expected ${method.inputs.length}!`)

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

        const result = await contractInstance[methodName](...args)

        console.log('Result:', result)

        this.$set(method.interactionData, 'result', result)
      } catch (error) {
        console.log(error.message)

        this.$set(method.interactionData, 'result', 'error')
        this.$set(method.interactionData, 'message', error.message)
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

.method-result {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.method-result-value {
  padding: 4px;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: #444;
  color: #ccc;
  display: flex;
  align-items: center;
}

.method-result-message {
  padding: 5px;
  color: #f00;
}

</style>
