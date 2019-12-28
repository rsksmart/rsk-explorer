<template lang="pug">
  .big-field
    textarea.field(disabled='true' :rows='rows') {{value}}
    .decode(v-if='decoded')
      .small
        label.inline show as:
        select.small(v-model='field')
          option(v-for='val,field in decoded') {{field}}
</template>
<script>
import { decodeField } from '../lib/js/decodeField'
export default {
  name: 'big-field',
  props: {
    data: {},
    options: {
      type: Object
    }
  },
  data () {
    return {
      field: 'raw'
    }
  },
  created () {
    let { decoded } = this
    // select rlp if is available
    if (decoded.rlp) this.field = 'rlp'
  },
  computed: {
    opts () {
      return this.options || {}
    },
    decode () {
      let { decode } = this.opts
      return decode
    },
    decoded () {
      return (this.decode) ? decodeField(this.data) : null
    },
    value () {
      let { decoded, field, data } = this
      return (decoded && field) ? decoded[field] || data : data
    },
    rows () {
      return Array.isArray(this.value) ? this.value.length + 2 : 1
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/vars.styl'
  @import '../lib/styl/mixins.styl'

  .big-field
    display flex
    .decode
      align-self flex-end
    textarea
      padding 0
      font-size 0.75em
      font-family $monospace-font

    .field
      raw()
      width 100%
      max-width 100%
      min-height 3em
      background none
      color $color
      border none
      margin 0 0 2em 0

      &:disabled
        color $txt-color
</style>
