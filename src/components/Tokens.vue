<template lang="pug">
  #tokens
    h2 erc20 tokens
    template(v-if='tokens.length')
      template(v-for='token in tokens')
        .token.box 
          data-item(type='token' :data='token' )
          //-ul.plain
            li 
              h2 {{ token.name }}
            //-li {{ token.shortName }}
            li {{token.address}}
            li 
              router-link(:to='"/tokens/" + token._id + "/events"') 
                span Events: {{token.Events}}
            li 
              router-link(:to='"/tokens/" + token._id + "/accounts"') Accounts
    template(v-else)
      h1.big.gray There are no tokens yet
</template>
<script>
import { mapState } from 'vuex'
import dataMixin from '../mixins/dataMixin'
import DataItem from '../components/DataItem'
export default {
  name: 'Tokens',
  components: {
    DataItem
  },
  mixins: [
    dataMixin
  ],
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
    display flex
    min-width 18em
    flex 1
    h2, .items.box
      margin 0
    .items.box
      padding .5em
      box-shadow none
</style>



