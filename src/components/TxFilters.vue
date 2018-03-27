<template lang="pug">
  .filters
    p Show transactions of type:
    ul.inline.dark
      li.col( v-for='val,name in txFilters')
        input(type='checkbox' v-model='filterValues' :value='name' :id='name')
        label(:for='name') {{name}}
    button.btn.dark(@click='test') test    
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'tx-filters',
  data () {
    return {
      txFilters: {
        remasc: false,
        bridge: false,
        normal: true
      },
      filterValues: ['normal']
    }
  },
  computed: {
    txType () {
      let query = this.$route.query
      let txType = (query) ? query.txType : null
      txType = (txType) ? txType.split(',') : ['normal']
      return txType
    }
  },
  created () {
    if (this.txType) this.filterValues = this.txType
  },
  methods: {
    ...mapActions({ getData: 'fetchPageData' }),
    test () {
      let query = Object.assign({}, this.$route.query)
      query.txType = this.filterValues.toString()
      this.$router.push({ query })
    }
  }
}
</script>

