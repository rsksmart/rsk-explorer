<template lang="pug">
  .menu-button.menu()
    button.btn(@click='switchMenu')
      slot(name="button")
    .menu-elements(v-show="enabled")
      slot(name="elements")
</template>
<script>
export default {
  name: 'menu-button',
  data () {
    return {
      enabled: false
    }
  },
  methods: {
    switchMenu () {
      this.enabled = !this.enabled
      if (this.enabled) {
        setTimeout(() => { this.enabled = false }, 3000)
      }
    },
    hideMenu () {
      this.enabled = false
    }
  }
}
</script>
<style lang="stylus">
@import '../../lib/styl/vars.styl'
@import '../../lib/styl/mixins.styl'

  .menu-button
    position relative

    .menu-elements
      display flex
      position absolute
      flex-flow column nowrap
      top 1.5em
      right 0
      z-index 9999
      background $bg-even
      white-space nowrap
      div
        margin-top 0.25em
</style>
