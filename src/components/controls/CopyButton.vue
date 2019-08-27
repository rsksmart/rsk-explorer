<template lang="pug">
  .copy-button
    textarea.hidden-ctrl(v-if='value' :ref='refName') {{value}}
    burp-button(icon='copy' :message='message || "copied!"' :title='title' :text='text' @click='copy' :class='css' )
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
  props: ['value', 'target', 'text', 'title', 'message', 'css'],
  data () {
    return {
      refName: 'copyTarget'
    }
  },
  computed: {
    targetNode () {
      let { refName, target } = this
      return (target) || this.$refs[refName]
    }
  },
  methods: {
    copy (event) {
      copyText(this.targetNode, { class: 'hidden-ctrl' })
    }
  }
}
</script>
