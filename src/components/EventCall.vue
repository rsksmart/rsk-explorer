<template lang="pug">
  .event-call(v-if='data')
    ul.event
      li.event-name {{name}}
        ul.args(v-if='inputs')
          template(v-for='arg in inputs')
            li.type {{arg.type}}
            li.index(v-if='arg.indexed') indexed
            li.name {{arg.name}}
</template>
<script>
export default {
  name: 'event-call',
  props: ['data'],
  computed: {
    name () {
      return this.data.name
    },
    inputs () {
      return this.data.inputs
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/vars.styl'
  @import '../lib/styl/mixins.styl'

  .event-call
    margin 0
    display flex
    .index
      font-size .8em

    li.event-name
      font-weight 600
      color $info

    ul
      raw()
      font-size .9em
      list-style none
      align-items flex-end
      font-style italic
      font-weight normal
      margin 0
      padding 0
      flex-flow row wrap
      li
        color gray

    ul,li
      margin 0 0.25em 0 0
      display flex

      &:last-child:after
        font-weight 600

    .args
      &::before
        content '('

      &::after
        content ')'

      .type
        color $info
        &:after
          content ''

      .name
        font-size 0.9em
        color $txt-color

        &:after
          content ','
          font-size 1em

        &:last-child:after
          content none
</style>
