<template lang="pug">
  .blocks-page
    h2 Blocks
    templte(v-if='data' v-for='block in data')
      block-box(:block='block')

</template>
<script>
import common from '../mixins/common'
import BlockBox from './BlockBox.vue'
export default {
  name: 'blocks',
  components: {
    BlockBox
  },
  props: ['data'],
  mixins: [common],
  methods: {
    isArray (val) {
      return Array.isArray(val)
    }

  }

}
</script>
<style lang="stylus">
  .blocks-page
    h2 
      display flex
      flex 1 1 100%
    min-width 100%
    display flex
    flex-flow row wrap
    .block-box 
      display inline-flex
</style>


