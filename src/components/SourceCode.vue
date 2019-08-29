<template lang="pug">
  .source-code
    pre(v-hljs)
      code(:class='language') {{code}}
    //-highlight-code(:lang='language' :code='code')
</template>
<script>
import hljs from '../directives/hljs'
export default {
  name: 'source-code',
  props: ['code', 'language'],
  directives: {
    hljs
  },
  computed: {
    parsedCode () {
      let { code } = this
      if (typeof code === 'string') {
        code = code.split('\n')
      }
      return code
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/vars.styl'
  @import '../lib/styl/rsk-hljs.styl'

  .source-code
    background $darkness-odd

    code
      font-size 0.75rem
      color $gray
      margin 2em

    .line-number
      font-size 0.75rem
      margin 0 4em 0 0
      color $darkness

    .line
      margin 0 4em 0.25em 1em

      &:hover
        background $darkness-even
</style>
