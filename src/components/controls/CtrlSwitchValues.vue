<template>
  <div class="ctrl-switch-values">
    <small class="label first-leter-uppercase"
      :style="{ color: selected === optA ? PAGE_COLORS[$route.name].cl : '' }">{{ optA }}</small>
    <ctrl-switch :value="value === optB" @change="changeFormat" :square="true" css="enabled"></ctrl-switch>
    <small class="label first-leter-uppercase"
      :style="{ color: selected === optB ? PAGE_COLORS[$route.name].cl : '' }"
    >{{ optB }}</small>
  </div>
</template>
<script>
import CtrlSwitch from './CtrlSwitch'
import { PAGE_COLORS } from '@/config/pageColors'

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
      value: this.selected || this.values[0],
      PAGE_COLORS
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
    }
  }
}
</script>
