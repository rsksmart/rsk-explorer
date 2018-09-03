<template lang="pug">
  .message(:class='msg.type')
    icon(v-if='msg.icon' :name='msg.icon')
    span.title(v-if='msg.title') {{msg.title}}
    small.txt {{msg.txt}}

</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'message',
  props: ['message'],
  computed: {
    ...mapState({
      messages: state => state.messages
    }),
    msg () {
      let m = this.message
      return this.messages[m] || m
    }
  }
}
</script>
<style lang="stylus">
  .message
    .title
      font-weight bold
      margin 0 0.5em 0 0.25em
</style>
