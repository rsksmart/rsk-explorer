<template lang="pug">
  .search
    ctrl-search(
      @change="search"
      @result="onResult"
      @input="onInput"
      :results="results"
      :loading="isLoading"
      :placeholder="placeholder"
      :cssClass="searchBoxClass")
</template>
<script>
import { testSearchedValue } from '../lib/js/validate'
import { mapState, mapGetters, mapActions } from 'vuex'
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
      msgTimeout: null,
      requestingTimeout: null
    }
  },
  computed: {
    ...mapState({
      lastBlocks: state => state.backend.lastBlocks
    }),
    ...mapGetters({
      lastBlock: 'lastBlock',
      net: 'bcNet',
      results: 'getSearchedResults',
      requesting: 'requestingSearches'
    }),
    searchBoxClass () {
      return (this.msg) ? 'margin-less' : ''
    },
    placeholder () {
      return this.msg || 'Search'
    },
    chainId () {
      let { net } = this
      return (net) ? net.id : undefined
    },
    isLoading () {
      return this.requesting.length
    }
  },
  methods: {
    ...mapActions([
      'clearSearchedResults',
      'fetchSearch'
    ]),
    ...mapGetters([
      'getPage',
      'getSearchLink'
    ]),
    isBlock (number) {
      number = parseInt(number)
      return number > -1
    },
    clearRequests () {
      this.clearSearchedResults()
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
    goTo ({ type, value }) {
      let link = this.getSearchLink()({ type, value })
      if (!link) return
      this.clearRequests()
      this.$router.push(link)
    },

    onResult ({ event, value }) {
      this.clearRequests()
    },
    onInput ({ event, value }) {
      this.clearRequests()
      if (!value || value.length < 3) return
      let type = 'addressByName'
      this.fetchSearch({ value, type })
    },
    search ({ value, event }) {
      value = String(value).replace(/[\W_]+/g, '')
      this.clearRequests()
      if (!value) return
      let { chainId, lastBlock } = this

      // prevents errors when the lastBlock is unknown
      lastBlock = (lastBlock) ? lastBlock.number + 2 : undefined
      let test = testSearchedValue(value, { chainId, lastBlock })
      let types = Object.keys(test).filter(k => test[k])
      if (!types || !types.length) {
        this.$router.push(`/${r.search}/${value}`)
        this.ephemeralMessage(`Please type: address, block number or tx hash`)
      } else {
        return this.searchTypes(value, types)
      }
    },
    async searchTypes (value, types) {
      if (types.length === 1) {
        let type = types[0]
        return this.goTo({ type, value })
      } else {
        for (let type of types) {
          await this.fetchSearch({ value, type })
        }
        await this.waitForResults()
        let { results } = this
        // redirect when result once
        if (results && results.length === 1) {
          return this.goTo(results[0])
        }
      }
    },
    waitForResults () {
      let vm = this
      return new Promise((resolve) => {
        return vm.createTimeout(() => {
          if (vm.isLoading) resolve(vm.waitForResults())
          else resolve(vm.results)
        })
      })
    },
    createTimeout (cb) {
      let { requestingTimeout } = this
      if (requestingTimeout) clearTimeout(requestingTimeout)
      this.requestingTimeout = setTimeout(cb, 200)
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
