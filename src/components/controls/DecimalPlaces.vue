<template lang="pug">
  .decimal-places
    input( :value='decimals' @change='updateDecimals' size="2")
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'decimal-places',
  computed: {
    ...mapState({
      decimals: state => state.config.decimalPlaces
    })
  },
  methods: {

    ...mapActions(['updateDecimalPlaces']),
    updateDecimals (event) {
      const { value } = event.target
      return this.updateDecimalPlaces(value)
    }
  }
}
</script>
