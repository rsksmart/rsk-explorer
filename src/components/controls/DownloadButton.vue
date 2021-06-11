<template lang="pug">
  .download-button
    burp-button(:icon='iconName' v-bind='{message,title,text}' @click='download' :class='css' )
      slot()
</template>
<script>
import { downloadText } from '../../lib/js/io'
import BurpButton from './BurpButton'
import icons from '../../config/icons'
export default {
  name: 'download-button',
  components: {
    BurpButton
  },
  props: {
    value: String, // use value OR target
    target: Object, // DOM node
    text: String,
    title: String,
    fileName: String,
    fileType: {
      type: String,
      required: true
    },
    message: {
      type: String,
      default: ''
    },
    css: {},
    icon: {
    }
  },
  computed: {
    iconName () {
      return (undefined === this.icon) ? icons.download : this.icon
    }
  },
  methods: {
    download (event) {
      const { target, fileName, fileType } = this
      const text = (target) ? target.value : this.value
      downloadText(text, fileName, fileType)
      this.$emit('download')
    }
  }
}
</script>
