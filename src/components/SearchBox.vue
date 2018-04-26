<template lang="pug">
  .search
      //-icon(name='search')
      input(name="search" type='search'  id="search" placeholder="Search" @change='search' v-model='searchValue')
</template>
<script>
import * as ethUtils from '../lib/js/ethUtils'
import { mapState } from 'vuex'
import { ROUTES as r } from '../config/types'
export default {
  name: 'search-box',
  data () {
    return {
      searchValue: ''
    }
  },
  computed: {
    ...mapState({
      lastBlocks: state => state.backend.lastBlocks
    })
  },
  methods: {
    isBlock (number) {
      number = parseInt(number)
      return number > -1 && number <= this.lastBlocks[0].number
    },
    search (event) {
      let value = this.searchValue
      if (value) {
        let tests = {
          address: (ethUtils.isAddress(value)) ? `/${r.addresses}/` : null,
          tx: (ethUtils.isTx(value)) ? `/${r.transactions}/` : null,
          block: (this.isBlock(value)) ? `/${r.blocks}/` : null
        }
        let links = Object.values(tests).filter(l => l)
        // fix to show all posible matches:
        let link = (links.length) ? links[0] + value : null
        if (link) {
          this.$router.push(link)
        } else {
          this.searchValue = ''
        }
      }
    }
  }
}
</script>

