<template lang="pug">
  #tokens
    h2 erc20 tokens
    template(v-for='token in tokens')
      .box.token
        ul.plain
          li 
            h2 {{ token.name }}
          //-li {{ token.shortName }}
          li 
            router-link(:to='"/tokens/" + token._id + "/events"') 
              span Events: {{token.Events}}
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
<style lang="stylus">
 @import '../lib/styl/vars.styl'
  .token
    display inline-flex
    min-width 18em
    flex 1 
    padding 0em 3em 3em
</style>



