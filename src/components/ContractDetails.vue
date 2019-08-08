<template lang="pug">
  .contract-details
    .section
      .verify(v-if='!verification')
        a.btn(@click='verifyContract') Verify Contract
      .abi(v-if='abi' )
        h3 Contract ABI
          .source-code
            highlight-code(lang='json' :code='JSON.stringify(abi,null,2)')
</template>
<script>
import SourceCode from './SourceCode'
import { ROUTES } from '../config/types'
export default {
  name: 'contract-details',
  components: { SourceCode },
  props: ['data'],
  computed: {
    verification () {
      return this.data.verification
    },
    result () {
      let { verification } = this
      return (verification) ? verification.result : {}
    },

    abi () {
      return this.result.abi
    }
  },
  methods: {
    verifyContract () {
      const { address } = this.data
      const path = `/${ROUTES.verifyContract}/${address}`
      this.$router.push({ path })
    }
  }
}
</script>
<style lang="stylus">
  .abi
    display flex
    position relative
    width 900px

    *
      font-weight normal
</style>


