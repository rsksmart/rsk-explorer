<template lang="pug">
  .filters
    small Filter by type:&nbsp;
    ul.inline.dark
      li.col( v-for='val,name in txFilters')
        input(type='checkbox' v-model='filterValues' :value='name' :id='name' @change='update')
        label(:for='name')
          small {{name}}
</template>
<script>
import { mapActions, mapState, mapGetters } from 'vuex'
export default {
  name: 'tx-filters',
  props: ['q', 'module', 'action'],
  data () {
    return {
      txFilters: {},
      filterValues: []
    }
  },
  created () {
    this.filterValues = this.q.txType || []
    let filters = this.txFilters
    let types = this.txTypes
    Object.keys(types).forEach(v => { filters[types[v]] = (v === 'default') })
  },
  computed: {
    ...mapState({
      txTypes: state => state.backend.systemSettings.txTypes
    })
  },
  methods: {
    ...mapActions(['updateRouterQuery']),
    ...mapGetters(['removePaginationFromRoute']),
    update () {
      let q = Object.assign({}, this.q)
      q.txType = this.filterValues
      let query = { q }
      query = this.removePaginationFromRoute()('data', query)
      this.updateRouterQuery({ query })
    }
  }
}
</script>
