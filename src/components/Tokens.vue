<template lang="pug">
  #tokens
    h2 erc20 tokens
    template(v-for='token in tokens')
      .box
        ul
          li {{ token.name }}
          li {{ token.shortName }}
          li 
            router-link(:to='"/tokens/" + token._id + "/events"') Events
          li 
            router-link(:to='"/tokens/" + token._id + "/accounts"') Accounts
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
