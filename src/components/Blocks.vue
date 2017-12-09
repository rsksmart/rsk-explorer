<template lang="pug">
  .blocks
    ul(v-for='block in blocks')
      li {{block.number}}
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'Blocks',
  computed: {
    ...mapState({
      blocks: state => state.backend.lastBlocks
    })
  }
}
</script>
