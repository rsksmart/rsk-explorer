<template lang="pug">
  .big-field
    textarea.field(disabled='true' :rows='rows' :class='css') {{value}}
    .decode(v-if='decoded')
      .small
        label.inline show as:
        select.small(v-model='fieldType')
          option(v-for='val,field in decoded') {{field}}
</template>
<script>
import { decodeField } from '../lib/js/decodeField'
export default {
  name: 'big-field',
  props: {
    data: {},
    field: {},
    options: {
      type: Object
    }
  },
  data () {
    return {
      fieldType: 'raw'
    }
  },
  created () {
    const { decoded } = this
    // select rlp if is available
    if (decoded && decoded.rlp) {
      this.fieldType = 'rlp'
    }
  },
  computed: {
    opts () {
      return this.options || {}
    },
    decode () {
      const { decode } = this.opts
      return decode
    },
    decoded () {
      return (this.decode) ? decodeField(this.data) : null
    },
    value () {
      const { decoded, fieldType, data } = this
      return (decoded && fieldType) ? decoded[fieldType] || data : data
    },
    rows () {
      return Array.isArray(this.value) ? this.value.length + 2 : 1
    },
    css () {
      if (!this.field) return
      let { css } = this.field
      css = Array.isArray(css) ? css : [css]
      css.unshift('txt-color')
      return css
    }
  }
}
</script>
<style lang="stylus">

  .big-field
    display flex

    .decode
      margin-left 10px

    textarea
      padding 0
      font-size 0.75em
      font-family $monospace-font
      color inherit

    .field
      raw()
      width 100%
      max-width 100%
      min-height 3em
      background none
      color $color
      border none
      margin 0 0 2em 0
</style>
