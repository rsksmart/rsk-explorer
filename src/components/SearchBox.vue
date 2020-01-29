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
import { mapState, mapGetters, mapActions } from 'vuex'
import CtrlSearch from './controls/CtrlSearch'
// oconst RESULTS_LENGTH = 10
export default {
  name: 'search-box',
  components: {
    CtrlSearch
  },
  data () {
    return {
      msg: `Search by: address / block / tx / name`,
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
      results: 'getSearchedResults',
      requesting: 'requestingSearches',
      searchedValue: 'searchedValue',
      types: 'searchedTypes'
    }),
    searchBoxClass () {
      return (this.msg) ? 'margin-less' : ''
    },
    placeholder () {
      return this.msg || 'Search'
    },
    isLoading () {
      return this.requesting.length
    }
  },
  methods: {
    ...mapActions([
      'clearSearchedResults',
      'fetchSearch',
      'prepareSearch',
      'searchTypes'
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
    goTo ({ type, value }) {
      let link = this.getSearchLink()({ type, value })
      if (!link) return
      this.clearRequests()
      this.$router.push(link)
    },
    goToSearchPage (value) {
      // let link = `/${r.search}/${value}`
      // return this.$router.push(link)
    },
    onResult ({ event, value }) {
      if (value) this.clearRequests()
    },
    onInput ({ event, value }) {
      this.clearRequests()
      if (!value || value.length < 2) return
      this.fetchSearch({ value })
    },
    async search ({ value, event }) {
      await this.prepareSearch({ value })
      value = this.searchedValue
      let { types } = this
      if (!types || !types.length) {
        return this.goToSearchPage(value)
      } else if (types.length === 1) {
        let type = types[0]
        return this.goTo({ type, value })
      } else {
        await this.searchTypes({ types, value })
        await this.waitForResults()
        let { results } = this
        // redirect when result once
        if (results) {
          if (results.length === 1) return this.goTo(results[0])
        } else {
          this.goToSearchPage(value)
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
