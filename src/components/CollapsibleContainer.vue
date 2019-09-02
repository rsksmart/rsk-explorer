<template lang="pug">
  .collapsible-container(:class='css')
    .header(@click='collapse')
      .title
        slot(name='header')
      button
        icon(v-if='collapsed' name='triangle-arrow-right')
        icon(v-else name='triangle-arrow-up')
    transition(name='expand')
      .content(v-if='!collapsed')
        slot

</template>
<script>
export default {
  name: 'collapsible-container',
  props: ['expanded'],
  data () {
    return {
      collapsed: true
    }
  },
  created () {
    this.collapsed = !this.expanded
  },
  computed: {
    css () {
      return (this.collapsed) ? 'collapsed' : 'expanded'
    }
  },
  methods: {
    collapse (event) {
      this.collapsed = !this.collapsed
      this.$emit('collapse', this.collapsed)
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/vars.styl'
  @import '../lib/styl/mixins.styl'

  .collapsible-container
    display flex
    flex 1 1 100%
    max-width 100%
    flex-flow column wrap
    border $frame-border

    .header
      display flex
      flex-flow row nowrap
      margin 0 1em
      link()
      flex-centered()
      justify-content space-between
      break-word()

      .title
        margin 0.25em

        div
          margin 0 1em 0 0

    .content
      display flex
      flex 1 1 100%

  .collapsed
    box-shadow $box-sh
    flex 0

  .expanded
    display flex
    border $mid-border
    background none !important

  .expand-enter-active, .expand-leave-active
    transition all .25s ease-in
    opacity 1

  .expand-enter, .expand-leave-to
    opacity 0
</style>
