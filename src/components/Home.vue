<template lang="pug">
  #home
    h1 Home
    button(@click='test') test
    blocks
</template>
<script>
import Blocks from './Blocks.vue'
export default {
  name: 'Home',
  components: {
    Blocks
  },
  methods: {
    test () {
      this.$store.commit('SOCKET_EMIT', { event: 'data', data: { type: 'blocks' } })
    }
  }

}
</script>
