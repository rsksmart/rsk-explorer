<template>
<div class="blocks-wrapper" v-show="blocks.length">
  <h2 class="title">
    <router-link :to="entity.listLink">
      <span>&nbsp; {{ pageTitle }}</span>
    </router-link>
  </h2>
  <div class="blocks" v-if="blocks.length">
    <div class="pending-msg box" v-if="pending">
      <button class="txt-center info" @click="updateBlocks">
        <em>there {{ pending > 1 ? 'are' : 'is' }}&nbsp;</em>
        <strong class="badge">{{ pending }}&nbsp;</strong>
        <em>new {{ pending > 1 ? 'blocks' : 'block' }}, click here to update the list</em>
      </button>
    </div>
    <template v-for="(block, index) in blocks">
      <block-box v-if="index <= 10" :block="block" :key="index"></block-box>
    </template>
  </div>
  <div class="msg" v-else>
    <h2>Requesting blocks</h2>
  </div>
</div>

</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import BlockBox from './BlockBox.vue'
import PendingBlocks from './PendingBlocks.vue'
import dataMixin from '../mixins/dataMixin'
export default {
  name: 'last-blocks',
  components: {
    BlockBox,
    PendingBlocks
  },
  mixins: [
    dataMixin
  ],
  data () {
    return {
      type: 'blocks'
    }
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
<style lang="stylus">
  .blocks-wrapper
    .blocks
      .pending-msg
        white-space pre-wrap
      .block-box
        .block:first-child
          margin-top 0 !important
</style>
