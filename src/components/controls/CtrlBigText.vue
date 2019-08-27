<template lang="pug">
  .ctrl-big-text
    .header
      .title
        strong.subtitle {{title}}
      copy-button.button(v-bind='{value,css,title:copyTitle}')
      download-button.button(v-if='fileType' v-bind='{fileName,fileType,value,css, title:downloadTitle}')
    .big-text(:style='style')
      slot
      .content(v-if='!hasSlots') {{value}}
</template>
<script>
import CopyButton from './CopyButton'
import DownloadButton from './DownloadButton'
export default {
  name: 'ctrl-big-text',
  components: {
    CopyButton,
    DownloadButton
  },
  props: {
    value: {
      type: String,
      required: true
    },
    fileName: String,
    fileType: String,
    title: String,
    height: {
      type: String,
      default: '20em'
    }
  },
  computed: {
    hasSlots () {
      return this.$slots.default
    },
    style () {
      let { height } = this
      return { height }
    },
    copyTitle () {
      return (this.title) ? `Copy ${this.title}` : null
    },
    downloadTitle () {
      return (this.copyTitle) ? `Download ${this.title}` : null
    },
    css () {
      return ['small']
    }
  }
}
</script>
<style lang="stylus">
@import '../../lib/styl/vars.styl'
  @import '../../lib/styl/mixins.styl'
  .ctrl-big-text
    width 100%
    min-width 100%
    position relative

    .big-text
      border none
      border-top $soft-border
      border-bottom $soft-border
      font-size 0.75rem
      overflow-y scroll
      overflow-x auto
      overflow-wrap break-word
      width 100%
      position relative
      min-width 100%
      box-sizing border-box
      resize vertical
      font-family $monospace-font
      background $bg-odd

    .content
      padding 1em
      color gray

    .header
      box-sizing border-box
      padding 0
      margin  0 0 .25em 0
      width 100%
      display flex
      flex 1
      list-style none
      flex-flow row wrap
      justify-content flex-end
      align-items center
      div
        display flex
      .title
        flex 1
        h3
          margin 0 0 0 1em
          color $color
      .button
        flex 0
        margin 0 .5em
</style>
