<template lang="pug">
  .ctrl-search
    .input
      input.search-input(type="search" @change="change" v-model="value" :placeholder="placeholder" :class="cssClass")
      button.link(@click="clear" v-if="value")
        icon(name="close")
      button.link(@click="change")
        icon(name="search")

</template>
<script>
export default {
  name: 'ctrl-search',
  props: ['placeholder', 'cssClass'],
  data () {
    return {
      value: ''
    }
  },
  methods: {
    clear () {
      this.value = ''
    },
    change (event) {
      let value = this.value
      this.$emit('change', value, event)
      this.clear()
    }
  }
}
</script>
<style lang="stylus">
  @import '../../lib/styl/vars.styl'
  @import '../../lib/styl/mixins.styl'

  .ctrl-search
    .input
      display flex
      align-items center
      background none
      border-style solid

      button
        display flex
        margin 0 0.5em 0 0

      input.search-input
        border none
        background none
        text-align center
        padding 0
        box-shadow none
        font-size 0.75em
        margin 0 0.5em 0 0
</style>
