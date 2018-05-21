<template lang="pug">
  .big-field
    textarea.field(disabled='true') {{data}}
</template>
<script>
export default {
  name: 'big-field',
  props: ['data']
}
</script>
<style lang="stylus">
@import '../lib/styl/vars.styl'
  .big-field
    display flex
    .field
      width 100%
      max-width 100%
      height 3em
      font-size .7em
      background none
      color $color
      border none
      resize vertical
      padding .5em
      margin 0 0 2em 0
      &:disabled
        color $txt-color
</style>
