<template>
  <div class="filters">
    <small>Filter by type:&nbsp;&nbsp;</small>
    <ul class="filter-content">
      <li class="item" v-for="(val, name) in txFilters" :key="name">
        <label class="checkbox-container">
          <input type="checkbox" v-model="filterValues" :value="name" @change="update" class="custom-checkbox">
          <span class="checkmark" :style="{ backgroundColor: !filterValues ? PAGE_COLORS[$route.name].cl :''}"></span>
          <span class="label">{{ name }}</span>
        </label>
      </li>
    </ul>
</div>

</template>
<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { PAGE_COLORS } from '@/config/pageColors'

export default {
  name: 'tx-filters',
  props: ['q', 'module', 'action', 'reqKey'],
  data () {
    return {
      txFilters: {},
      filterValues: [],
      PAGE_COLORS
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
