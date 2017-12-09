
<template lang="pug">
  #app
    h1 connected {{connected}}
    p {{errors}}
    router-view
</template>


<script>
import { mapState } from 'vuex'
export default {
  name: 'app',
  computed: {
    ...mapState({
      connected: state => state.socketConnected,
      errors: state => state.socketErrors
    })
  }
}
</script>


