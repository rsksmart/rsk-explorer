<template>
  <div class="radios">
    <div class="radio-grp" v-for="(value, label) in group" :key="value">
      <label>
        <input class="inline" type="radio" :name="name" :value="value" @change="change(value)" :checked="selected === value">
        <span class="label">{{ label }}</span>
      </label>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ctrl-radio-grp',
  props: {
    name: {
      type: String,
      required: true
    },
    values: {
      type: Object
    },
    selected: {}
  },
  data () {
    return {
      group: {
        yes: true,
        no: false
      }
    }
  },
  created () {
    const { values } = this
    if (values) this.group = values
  },
  methods: {
    change (value) {
      this.$emit('change', value)
    }
  }
}
</script>
<style>
  input[type="radio"] {
  --s: 1em;
  --c: #FF71E1;

  height: var(--s);
  aspect-ratio: 1;
  border: calc(var(--s) / 8) solid #939393;
  padding: calc(var(--s) / 8);
  background: radial-gradient(farthest-side, var(--c) 94%, #0000) 50%/0 0
    no-repeat content-box;
  border-radius: 50%;
  outline-offset: calc(var(--s) / 10);
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: pointer;
  font-size: inherit;
  transition: 0.3s;
}
input[type="radio"]:checked {
  border-color: var(--c);
  background-size: 100% 100%;
}

input[type="radio"]:disabled {
  background: linear-gradient(#939393 0 0) 50%/100% 20% no-repeat content-box;
  opacity: 0.5;
  cursor: not-allowed;
}

@media print {
  input[type="radio"] {
    -webkit-appearance: auto;
    -moz-appearance: auto;
    appearance: auto;
    background: none;
  }
}

</style>
