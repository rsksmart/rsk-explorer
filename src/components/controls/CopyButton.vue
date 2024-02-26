<template>
  <div class="copy-button">
    <textarea v-if="value" :ref="refName" class="hidden-ctrl" v-model="value"></textarea>
    <burp-button :icon="iconName" :message="message || 'copied!'" :title="title" :text="text" @click="copy" :class="css">
      <slot></slot>
    </burp-button>
  </div>
</template>
<script>
import { copyText } from '../../lib/js/io'
import BurpButton from './BurpButton'
import icons from '../../config/icons'
export default {
  name: 'copy-button',
  components: {
    BurpButton
  },
  // use value (string) or target(dom node)
  props: ['value', 'target', 'text', 'title', 'message', 'css', 'icon'],
  data () {
    return {
      refName: 'copyTarget'
    }
  },
  computed: {
    iconName () {
      return (undefined === this.icon) ? icons.copy : this.icon
    },
    targetNode () {
      const { refName, target } = this
      return (target) || this.$refs[refName]
    }
  },
  methods: {
    copy (event) {
      copyText(this.targetNode, { class: 'hidden-ctrl' })
      this.$emit('copy')
    }
  }
}
</script>
