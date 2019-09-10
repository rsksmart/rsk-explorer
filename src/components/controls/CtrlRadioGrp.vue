<template lang="pug">
  .radios
    .radio-grp(v-for='value,label in group')
      label
        input.inline(type='radio' :name='name' :value='value' @change='change(value)' :checked='selected===value')
        span.label {{label}}
</template>
<script>
export default {
  name: 'ctrl-radio-grp',
  props: {
    name: {
      type: String,
      required: true
    },
    values: {
      type: Object
    },
    selected: {}
  },
  data () {
    return {
      group: {
        yes: true,
        no: false
      }
    }
  },
  created () {
    let { values } = this
    if (values) this.group = values
  },
  methods: {
    change (value) {
      this.$emit('change', value)
    }
  }
}
</script>
<style lang="stylus">
  @import '../../lib/styl/vars.styl'
  @import '../../lib/styl/mixins.styl'
  $size = 2em

  radioSym($w)
    content ''
    display block
    width $w
    height @width
    border-radius 50%
    box-shadow $inset-sh
    transition all .5s ease-out

  radioSymCenter()
    $s = .85em
    radioSym($s)
    $pos = ( ($size - $s)/2 )
    position absolute
    top $pos
    left $pos
    width $s
    height @width
    box-sizing border-box

  .radio-grp
    display inline-flex
    justify-content center
    align-items center
    flex 1
    margin 0 1em 0 0

    .label
      margin 0 0.5em
      color gray

    label
      position relative
      display flex

    input[type='radio']
      appearance none
      padding 0
      border none
      background none

      &:before
        radioSym($size)
        background $forms-ctrls-bg

      &:after
        radioSymCenter()
        background gray
        // border gray solid 1px
        box-shadow none

        
      &:focus
        border-radius 50%
      
      &:checked
        border none

      &:checked:before
        background $color !important

      &:checked:after
        transition all .5s ease-in
        radioSymCenter()
        background $white
        box-shadow $tip-sh
        border none
      
      &:hover:before
        background $gray
      &:hover:after
        background white  
</style>
