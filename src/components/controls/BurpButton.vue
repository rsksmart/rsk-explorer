<template lang="pug">
  button.burp-button.link(:title='title' @click.passive='click' @touchend.stop='click')
    icon(v-if='icon' :name='icon')
    span(v-if='text') {{text}}
    slot
    .message(:class='(animate) ? "anim":"" ') {{message}}
</template>
<script>
export default {
  name: 'burp-button',
  props: ['text', 'icon', 'message', 'title'],
  data () {
    return {
      animate: false,
      timer: undefined
    }
  },
  methods: {
    click (event) {
      this.animate = true
      this.$emit('click', event)
      // restart animation
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.animate = false
      }, 600)
    }
  }
}
</script>
<style lang="stylus">
  .burp-button
    position relative
    display flex
    flex-flow row nowrap
    justify-content center
    align-items center

    .svg-icon,.icon
      width 1.25em
      height @width

    .message
      position absolute
      z-index 10
      bottom 0
      opacity 0
      width auto
      white-space nowrap

    .anim
      animation-duration 0.5s
      animation-name rise-message
      animation-timing-function ease-in-out
      opacity 0

      @keyframes rise-message
        0%
          opacity 0

        75%
          transform translateY(-1em)

        80%
          opacity 1

        100%
          opacity 0
          transform translateY(-6em)
</style>
