<template lang="pug">
  .blocks-wrapper
    h2.title blocks
    .box
      .last-block
        h4 last block
        block(:block='lastBlocks[0]')
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
  name: 'last-blocks',
  components: {
    Block,
    PendingBlocks
  },
  computed: {
    ...mapState({
      blocks: state => state.backend.blocks,
      lastBlocks: state => state.backend.lastBlocks
    }),
    ...mapGetters({
      pending: 'pendingBlocks'
    })
  }
}
</script>
