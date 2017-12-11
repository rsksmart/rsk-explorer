<template lang="pug">
  #tokens
    h2 erc20 tokens
    template(v-for='token in tokens')
      .box
        p {{token}}
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'Tokens',
  data () {
    return {

    }
  },
  computed: {
    ...mapState({
      tokens: state => state.backend.tokens
    })
  }

}
</script>
