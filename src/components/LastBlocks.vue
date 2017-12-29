<template lang="pug">
  .blocks-wrapper
    h2.title Blocks
    .blocks(v-if='blocks.length')
      .pending-msg.box(v-if='pending')
        button.txt-center.info(@click='updateBlocks')
          em there are 
          strong {{pending}} 
          em new blocks, click  here to update the list
      ul(v-for='block in blocks')
        li 
          block-box(:block='block')
    .msg(v-else)
      h1 Requesting blocks      
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import BlockBox from './BlockBox.vue'
import PendingBlocks from './PendingBlocks.vue'
export default {
  name: 'last-blocks',
  components: {
    BlockBox,
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
  },
  methods: {
    ...mapActions(['updateBlocks'])
  }
}
</script>

