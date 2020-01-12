<template lang="pug">
  .search
    ctrl-search(
      @change="search"
      :placeholder="placeholder"
      :cssClass="searchBoxClass")
</template>
<script>
import { normalizeSearch, isAddress, isTxHash } from '../lib/js/utils'
import { mapState } from 'vuex'
import { ROUTES as r } from '../config/types'
import CtrlSearch from './controls/CtrlSearch'
export default {
  name: 'search-box',
  components: {
    CtrlSearch
  },
  data () {
    return {
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
    search (value, event) {
      value = normalizeSearch(value)
      if (value) {
        value = String(value).replace(/[\W_]+/g, '')

        let tests = {
          address: (isAddress(value)) ? `/${r.address}/` : null,
          tx: (isTxHash(value)) ? `/${r.transaction}/` : null,
          block: (this.isBlock(value)) ? `/${r.block}/` : null
        }
        let links = Object.values(tests).filter(l => l)
        // fix to show all posible matches:
        let link = (links.length) ? links[0] + value : null
        if (link) {
          this.$router.push(link)
        } else {
          this.ephemeralMessage(`Please type: address, block number or tx hash`)
        }
      }
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/vars.styl'
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

    ::placeholder
      color $graylight

    button
      margin 0 0.5rem 0 0
      display inline-block

  .msg-trans
    will-change opacity

  .msgtrans-enter-active
    opacity 0

  .msgtrans-leave-to
    transition all 0.5s ease
    transform translateY(-1em)
    opacity 0
</style>
