<template lang="pug">
  .search
    button.color1
      icon(name='search')
    
    input(name="search" 
      type='search'
      id="search"
      :placeholder="placeholder"
      @change='search' 
      v-model='searchValue'
      :class='searchBoxClass'
      )
    
    //-transition(name='msgtrans')
      .search-msg(v-if='msg')
        .small
          small.soft {{ msg }}
</template>
<script>
import * as ethUtils from '../lib/js/ethUtils'
import { mapState } from 'vuex'
import { ROUTES as r } from '../config/types'
export default {
  name: 'search-box',
  data () {
    return {
      searchValue: '',
      msg: '',
      msgTimeout: null
    }
  },
  computed: {
    ...mapState({
      lastBlocks: state => state.backend.lastBlocks
    }),
    searchBoxClass () {
      return (this.msg) ? 'margin-less' : ''
    },
    placeholder () {
      return this.msg || 'Search'
    }
  },
  methods: {
    isBlock (number) {
      number = parseInt(number)
      return number > -1
    },
    ephemeralMessage (msg, duration) {
      duration = duration || 5000
      let vm = this
      this.msg = msg
      if (this.msgTimeout) clearTimeout(this.msgTimeout)
      this.msgTimeout = setTimeout(() => {
        vm.msg = null
        vm.msgTimeout = null
      }, duration)
    },
    search (event) {
      let value = this.searchValue
      value = value.toLowerCase()
      if (value) {
        value = String(value).replace(/[\W_]+/g, '')
        let tests = {
          address: (ethUtils.isAddress(value)) ? `/${r.address}/` : null,
          tx: (ethUtils.isTx(value)) ? `/${r.transaction}/` : null,
          block: (this.isBlock(value)) ? `/${r.block}/` : null
        }
        let links = Object.values(tests).filter(l => l)
        // fix to show all posible matches:
        let link = (links.length) ? links[0] + value : null
        if (link) {
          this.searchValue = ''
          this.$router.push(link)
        } else {
          this.searchValue = ''
          this.ephemeralMessage(`Please type: address, block number or tx hash`)
        }
      }
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/mixins.styl'

  .margin-less
    margin-bottom 0

  .search-msg
    flex-centered()
    flex-flow column wrap
    transition all 0.5s ease
    flex 0 1 100%
    opacity 1
    position relative
    margin-bottom -2em

  .search
    flex-flow row wrap

    button
      margin 0 0.5rem 0 0

    input
      text-align center

  .msg-trans
    will-change opacity

  .msgtrans-enter-active
    opacity 0

  .msgtrans-leave-to
    transition all 0.5s ease
    transform translateY(-1em)
    opacity 0
</style>

