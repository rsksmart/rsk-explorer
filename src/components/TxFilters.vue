<template lang="pug">
  .filters
    span Show only transactions of type:&nbsp;
    ul.inline.dark
      li.col( v-for='val,name in txFilters')
        input(type='checkbox' v-model='filterValues' :value='name' :id='name')
        label(:for='name') {{name}}
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
      filterValues: []
    }
  },
  watch: {
    filterValues (newValue) {
      let query = Object.assign({}, this.$route.query)
      query.txType = newValue
      this.$router.push({ query })
    }
  },
  created () {
    let query = this.$route.query
    this.filterValues = query.txType || ['normal']
  },
  methods: {
    ...mapActions({ getData: 'fetchPageData' }),
    update () {

    }
  }
}
</script>

