
<template lang="pug">
  .wrapper
    .header
      header
        .iso.plain-color
          include assets/svg/iso-logo-v.svg
        .title
          h1 rsk-explorer
        .nav
          nav.menu
            ul
              li
                router-link(to='/') home
              li 
                router-link(to='tokens') tokens
            


    .main
      template(v-if='connected')
        router-view
      template(v-else)
        h1 connecting to server  
    .footer
      footer
        p Copyright © 2015-2017 RSK Labs. All rights reserved.
        p RSK Public Key (1310 29B2 D95E 815A 48DA B443 FD4F DAFD 7D17 4BB2)
</template>


<script>
import { mapState } from 'vuex'
import './icons'
export default {
  name: 'app',
  created () {
    this.$store.dispatch('init')
  },
  computed: {
    ...mapState({
      connected: state => state.socketConnected,
      errors: state => state.socketErrors
    })
  }
}
</script>
<style lang="stylus">

  @import 'lib/styl/style.styl'
</style>



