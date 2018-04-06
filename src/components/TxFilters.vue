<template lang="pug">
  .filters
    small Show only transactions of type:&nbsp;
    ul.inline.dark
      li.col( v-for='val,name in txFilters')
        input(type='checkbox' v-model='filterValues' :value='name' :id='name' @change='update')
        label(:for='name') 
          small {{name}}
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'tx-filters',
  props: ['q', 'type', 'action'],
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
  created () {
    this.filterValues = this.q.txType || []
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

