<template lang="pug">
  .search
      //-icon(name='search')
      input(name="search" type='search'  id="search" placeholder="Search" @change='search' v-model='searchValue')
</template>
<script>
import * as ethUtils from '../lib/js/ethUtils'
import { mapState } from 'vuex'
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
    search (event) {
      let value = this.searchValue
      if (value) {
        let isTx = ethUtils.isTx(value)
        let isAddress = ethUtils.isAddress(value)
        let link
        if (isAddress) {
          link = '/accounts/'
        } else if (isTx) {
          link = '/transactions/'
        } else {
          let lastBlock = this.lastBlocks[0].number
          value = Number(value)

          if (Number.isInteger(value) && value < lastBlock) {
            link = '/blocks/'
          }
        }
        if (link) {
          link += value
          this.$router.push(link)
        } else {
          this.searchValue = ''
        }
      }
    }
  }
}
</script>

