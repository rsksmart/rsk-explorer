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
import { mapActions, mapState } from 'vuex'
export default {
  name: 'tx-filters',
  props: ['q', 'type', 'action'],
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
    update () {
      let q = Object.assign({}, this.q)
      q.txType = this.filterValues
      this.updateRouterQuery({ q })
    }
  }
}
</script>

