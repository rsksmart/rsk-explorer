<template lang="pug">
  .filters
    small Filter by type:&nbsp;&nbsp;
    ul.inline.dark
      li.col( v-for='val,name in txFilters')
        label
          input(type='checkbox' v-model='filterValues' :value='name' @change='update')
          span.label {{name}}
</template>
<script>
import { mapActions, mapState, mapGetters } from 'vuex'
export default {
  name: 'tx-filters',
  props: ['q', 'module', 'action', 'reqKey'],
  data () {
    return {
      txFilters: {},
      filterValues: []
    }
  },
  created () {
    this.filterValues = this.q.txType || []
    const filters = this.txFilters
    const types = this.txTypes
    Object.keys(types).forEach(v => { filters[types[v]] = (v === 'default') })
  },
  computed: {
    ...mapState({
      txTypes: state => state.backend.systemSettings.txTypes
    })
  },
  methods: {
    ...mapActions(['updateRouterQuery']),
    ...mapGetters(['removePaginationFromRoute', 'qKey']),
    update () {
      const key = this.reqKey
      const qKey = this.qKey()(key)
      const q = Object.assign({}, this.q)
      q.txType = this.filterValues
      let query = { [qKey]: q }
      query = this.removePaginationFromRoute()('data', query)
      this.updateRouterQuery({ query, key })
    }
  }
}
</script>
