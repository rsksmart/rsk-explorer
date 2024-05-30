<template>
  <div class="methods-list">
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
            <input class="method-input-field" type="text" v-model="method.interactionData.inputs[i]" :placeholder="input.name || i">
          </div>
        </div>
        <button :class="['button', disableCalls || method.interactionData.requested ? 'disabled' : 'enabled']" @click="contractCall(method.name, method.interactionData.inputs)" :disabled="disableCalls">{{ method.name }}</button>
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
        <p class="method-output-message" v-if="method.interactionData.message.content" :class="`interaction-message ${method.interactionData.message.style} message-success`">
          <span v-if="method.interactionData.hash?.content">
            {{ method.interactionData.message.content }}
            <a :href="`${siteUrl}tx/${method.interactionData?.hash.content}`" target="_blank" class="method-output-hash">
              {{ method.interactionData.hash.content }}
            </a>
          </span>
          <span v-else>{{ method.interactionData?.message.content }}</span>
        </p>
      </accordion>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Accordion from './controls/Accordion.vue'
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
      showOutputs: this.methodsType === 'read'
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
    contractCall (methodName, inputs) {
      this.$emit('contract-interaction-handler', methodName, inputs)
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
</style>
