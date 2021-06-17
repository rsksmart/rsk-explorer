<template lang="pug">
  .message(:class='msg.type')
    icon(v-if='msg.icon' :name='msg.icon')
    span.title(v-if='msg.title') {{msg.title}}
    small.txt {{msg.txt | txt-template(data)}}
    a.button.link(v-if='msg.link' :href="msg.link.to") {{msg.link.name}}

</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'message',
  props: ['message', 'data', 'parentData'],
  computed: {
    ...mapState({
      messages: state => state.messages
    }),
    msg () {
      let { message, messages } = this
      if (typeof message === 'function') message = message(this.data, this.parentData)
      return messages[message] || message
    }
  }
}
</script>
<style lang="stylus">
  .message
    .title
      font-weight 600
      margin 0 0.5em 0 0.25em
</style>
