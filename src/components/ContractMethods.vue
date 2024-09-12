<template>
  <div class="methods-list" :key="`contract-methods-${contractType}-${methodsType}`">
    <h3 class="methods-category-title capitalize">{{ title }} ({{ methods.length }})</h3>
    <div class="method" v-for="(method, index) in methods" :key="index">
      <accordion :title="method.name" :index="index">
        <!-- Inputs -->
        <div v-if="method.inputs">
          <div class="method-input" v-for="(input, i) in method.inputs" :key="i">
            <div class="label">
              <p>{{ input.name || '&lt;input&gt;' }}</p>
              <span class="type">({{ input.type }})</span>
            </div>
            <input :id="`${methodsType}-method-${method.name}-${`input-${input.name || i }` }`" class="method-input-field" type="text" v-model="method.interactionData.inputs[i]" :placeholder="input.name || i">
          </div>
        </div>
        <div class="interaction-type-selector-form">
          <form class="interaction-type-options" v-if="methodsType === INTERACTION_METHOD_TYPES.write">
            <label class="interaction-type-option">
              <input v-model="method.interactionData.interactionMode" type="radio" name="interaction-type" :value="INTERACTION_METHOD_TYPES.simulation" checked>
              <span>Simulate (call)</span>
            </label>
            <label class="interaction-type-option">
              <input v-model="method.interactionData.interactionMode" type="radio" name="interaction-type" :value="INTERACTION_METHOD_TYPES.write">
              <span>Transact (send)</span>
            </label>
          </form>
          <button :class="['button', disableCalls || method.interactionData.requested ? 'disabled' : 'enabled']" @click="executeMethod(method, method.interactionData.inputs, method.interactionData.interactionMode)" :disabled="disableCalls || method.interactionData.requested">{{ method.name }}</button>
        </div>
        <!-- Result -->
        <div v-if="showOutputs && method.outputs && method.interactionData.outputs.length" class="result">
          <label class="label">
            <p>result</p>
            <span v-if="method.outputs.length" class="type">({{ method.outputs.map(output => output.type).join(', ') }})</span>
          </label>
          <div v-for="(output, i) in method.outputs" :key="i">
            <div class="method-output" v-if="method.outputs[i]">
              <p class="method-output-value">{{ method.interactionData.outputs[i] ?? 'result' }}</p>
            </div>
          </div>
        </div>
        <p v-if="method.interactionData.message.content" :class="`interaction-message ${method.interactionData.message.style}`">
          <span>{{ method.interactionData.message.content }}</span>
          <span v-if="method.interactionData.hash.content">
            <span class="message-info">Hash: </span>
            <a :href="`${siteUrl}tx/${method.interactionData.hash.content}`" target="_blank" class="method-output-hash">{{ method.interactionData.hash.content }}</a>
          </span>
        </p>
      </accordion>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Accordion from './controls/Accordion.vue'
import { INTERACTION_METHOD_TYPES } from '../config/entities/lib/contractInteraction'

export default {
  name: 'contract-methods',
  components: {
    Accordion
  },
  props: {
    title: {
      type: String,
      required: true
    },
    methods: {
      type: Array,
      required: true
    },
    contractType: {
      type: String,
      required: true
    },
    methodsType: {
      type: String,
      required: true
    },
    disableCalls: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      showOutputs: true,
      INTERACTION_METHOD_TYPES
    }
  },
  computed: {
    ...mapGetters(['networkName']),
    isNetworkmainnet () {
      return this.networkName === 'mainnet'
    },
    siteUrl () {
      return this.isNetworkmainnet ? process.env.VUE_APP_DOMAIN_MAINNET : process.env.VUE_APP_DOMAIN_TESTNET
    }
  },
  methods: {
    executeMethod (method, inputs, interactionMode) {
      this.$emit('handle-interaction', method, inputs, this.contractType, interactionMode)
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.button {
  margin: 12px 0;
  color: $pink_900;
  border: none;
  border: 1px solid $pink_900;
  border-radius: 12px;
  padding: 5px 10px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.enabled:hover {
  opacity: .9;
}

.enabled:active {
  background-color: #000;
}

.capitalize {
  text-transform: capitalize;
}

.disabled {
  border: 1px solid #5f5f5f;
  color: #5f5f5f;
  cursor: default;
}

.methods-list {
  flex: 1;
  width: 100%;
}

.methods-category-title {
  margin-bottom: 20px;
}

.method {
  margin-bottom: 10px;
  background-color: $newbw_800;
  border-radius: 8px;
}

.method-name {
  margin-bottom: 10px;
}

.method-input {
  margin: 10px 0;
  justify-content: space-between;
  gap: 3px;
  width: 100%;
}
.method-input .label {
  flex: 1;
}

.label {
  display: inline-flex;
  gap: 2px;
  align-items: center;
  color: #fff;
}

.type {
  font-style: italic;
  font-size: 12px;
}

.method-input-field {
  display: block;
  height: 32px;
  flex: 7;
  margin: 3px 0;
  width: 100%;
  padding: 6px;
  border-radius: 8px;
  box-sizing: border-box;
  outline: none;
  background-color: $newbw_800;
  border: 1px solid #6d6d6d;
  color: #ffffff;
  transition: background-color 0.3s ease;
}

.method-input-field:focus {
  border: 1px solid #b5b5b5;
}

.method-output {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.method-output-value {
  padding: 12px;
  border-radius: 8px;
  background-color: rgba(18, 18, 18, 0.7);
  color: #fff;
  display: flex;
  align-items: center;
  overflow: auto;
}

.interaction-message {
  padding: 5px;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.message-info {
  color: #ccc;
}

.message-success {
  color: $cyan_300;
  opacity: .9;
}

.method-output-hash {
  color: white;
  opacity: .8;
  &:hover {
    opacity: 1;
  }
}

.message-error {
  color: $red_500;
}

.result {
  margin-bottom: 10px;
}

.interaction-type-selector-form {
  margin-top: 10px;
}

.interaction-type-options {
  display: flex;
  gap: 20px;
}

.interaction-type-option {
  display: flex;
  gap: 5px;
  align-items: center;
  cursor: pointer;
}
</style>
