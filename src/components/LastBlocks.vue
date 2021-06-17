<template lang="pug">
  .blocks-wrapper(v-show='blocks.length')
    h2.title
      router-link(:to='entity.listLink')
        icon(:name='entity.icon')
        span &nbsp; {{pageTitle}}
    .blocks(v-if='blocks.length')
      .pending-msg.box(v-if='pending')
        button.txt-center.info(@click='updateBlocks')
          em there {{pending > 1 ? 'are':'is'}}&nbsp;
            strong.badge {{ pending }}&nbsp;
          em new {{pending > 1 ? 'blocks':'block'}}, click here to update the list
      template(v-for='block,index in blocks')
        block-box(v-if='index <= 10' :block='block')
    .msg(v-else)
      h2 Requesting blocks
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
  .last-block
    .box
      background transparent
      border none
      box-shadow none
      margin 0
      padding 0
</style>
