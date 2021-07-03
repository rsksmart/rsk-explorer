<template lang="pug">
.ctrl-switch-values.row
  small.label(:class='formatCss(optA)') {{optA}}
  ctrl-switch(:value="value === optB" @change='changeFormat' :square='true' css='enabled')
  small.label(:class='formatCss(optB)') {{optB}}
</template>
<script>
import CtrlSwitch from './CtrlSwitch'
export default {
  name: 'ctrl-switch-values',
  components: { CtrlSwitch },
  props: {
    selected: null,
    values: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      value: this.selected || this.values[0]
    }
  },
  computed: {
    optA () {
      return this.values[0]
    },
    optB () {
      return this.values[1]
    }
  },
  methods: {
    changeFormat () {
      const { optA, optB, value } = this
      this.value = (value === optA) ? optB : optA
      this.$emit('change', this.value)
    },
    formatCss (value) {
      return (value === this.value) ? ['brand', 'bold'] : 'disabled'
    }
  }
}
</script>
<style lang="stylus">
  .ctrl-switch-values
    .switch
      margin 0 0.5em
</style>
