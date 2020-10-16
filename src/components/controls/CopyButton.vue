<template lang="pug">
  .copy-button
    textarea.hidden-ctrl(v-if='value' :ref='refName') {{value}}
    burp-button(:icon='iconName' :message='message || "copied!"' :title='title' :text='text' @click='copy' :class='css' )
      slot()
</template>
<script>
import { copyText } from '../../lib/js/io'
import BurpButton from './BurpButton'
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
      return (undefined === this.icon) ? 'copy' : this.icon
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
