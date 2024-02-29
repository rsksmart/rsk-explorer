<template>
  <div class="switch">
    <label class="ctrl">
      <input type="checkbox" :checked="value" @change="updateValue" :class="inputClass">
      <span class="slider" :class="ctrlClass" :style="{ backgroundColor: value ? PAGE_COLORS[$route.name].cl : ''}"></span>
    </label>
    <label class="label" v-if="label" :class="labelClass">{{ label }}</label>
  </div>
</template>
<script>
import { PAGE_COLORS } from '@/config/pageColors'
export default {
  name: 'ctrl-switch',
  props: ['label', 'value', 'square', 'enabled', 'css'],
  data () {
    return {
      PAGE_COLORS
    }
  },
  computed: {
    ctrlClass () {
      return (!this.square) ? 'round' : 'square'
    },
    labelClass () {
      return (this.value) ? '' : 'gray'
    },
    inputClass () {
      let { css, enabled } = this
      css = css || []
      css = Array.isArray(css) ? css : [css]
      if (enabled) css.push('enabled')
      return css
    }
  },
  methods: {
    updateValue (event) {
      const value = event.target.checked
      this.$emit('change', value)
    }
  }
}
</script>
