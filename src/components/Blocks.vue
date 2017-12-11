<template lang="pug">
  .blocks-wrapper
    h2.title blocks
    pending-blocks(v-if='pending')
    .blocks(v-if='blocks.length')
      ul(v-for='block in blocks')
        li 
          block(:block='block')
          
    .msg(v-else)
      h1 requesting blocks      
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import Block from './Block.vue'
import PendingBlocks from './PendingBlocks.vue'
export default {
  name: 'Blocks',
  components: {
    Block,
    PendingBlocks
  },
  computed: {
    ...mapState({
      blocks: state => state.backend.blocks
    }),
    ...mapGetters({
      pending: 'pendingBlocks'
    })
  }
}
</script>
