<template>
  <div class="methods-list">
    <h3 class="methods-category-title capitalize">{{ title }} ({{ methods.length }})</h3>
    <div class="method" v-for="(method, index) in methods" :key="index">
      <button :class="['button', disableCalls ? 'disabled' : 'enabled']" @click="contractCall(method.name, method.interactionData.inputs)" :disabled="disableCalls">{{ method.name }}</button>
      <!-- Inputs -->
      <div v-if="method.inputs">
        <div class="method-input" v-for="(input, i) in method.inputs" :key="i">
          <label class="label">
            <p>{{ input.name || '&lt;input&gt;' }}</p>
            <span class="type">({{ input.type }})</span>
          </label>
          <input class="method-input-field" type="text" v-model="method.interactionData.inputs[i]" :placeholder="input.name || i">
        </div>
      </div>
      <!-- Result -->
      <div class="divider"></div>
      <div v-if="showOutputs && method.outputs">
        <label class="label">
          <p>result</p>
          <span v-if="method.outputs.length" class="type">({{ method.outputs.map(output => output.type).join(', ') }})</span>
        </label>
        <div v-for="(output, i) in method.outputs" :key="i">
          <div class="method-output">
            <p class="method-output-value">{{ method.interactionData.outputs[i] ?? 'result' }}</p>
          </div>
        </div>
      </div>
      <p class="method-output-message" v-if="method.interactionData.message.content" :class="`interaction-message ${method.interactionData.message.style}`">{{ method.interactionData.message.content }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'contract-methods',
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
  methods: {
    contractCall (methodName, inputs) {
      this.$emit('contract-interaction-handler', methodName, inputs)
    }
  }
}
</script>

<style scoped>

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

.enabled:hover {
  background-color: #222;
}

.enabled:active {
  background-color: #000;
}

.capitalize {
  text-transform: capitalize;
}

.disabled {
  background-color: #999;
  color: #ccc;
  cursor: default;
}

.methods-list {
  flex: 1;
  min-width: 500px;
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
  border-radius: 4px;
  background-color: #444;
  color: #ccc;
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
  color: #0d0;
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
