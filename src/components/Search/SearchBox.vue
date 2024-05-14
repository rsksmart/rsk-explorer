<template>
  <div class="search">
    <ctrl-search
      @change="search"
      @result="onResult"
      @input="onInput"
      :results="results"
      :loading="isLoading"
      :placeholder="placeholder"
      :cssClass="searchBoxClass">
    </ctrl-search>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import CtrlSearch from './CtrlSearch.vue'
export default {
  name: 'search-box',
  components: {
    CtrlSearch
  },
  data () {
    return {
      value: undefined,
      msg: 'Search by address, block, tx, token name, rns domain',
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
      requesting: 'requestingSearches',
      searched: 'searchedValue',
      types: 'searchedTypes'
    }),
    ...mapGetters([
      'getSearchedResults',
      'searchPathChanged',
      'isSearchPage'
    ]),
    results () {
      const { getSearchedResults, isSearchPage, searched, value } = this
      return (!isSearchPage && value === searched) ? getSearchedResults : []
    },
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
      const link = this.getSearchLink()({ type, value })
      if (!link) return
      this.clearRequests()
    },
    setValue (value) {
      this.value = value
      if (this.isSearchPage) {
        history.pushState({}, document.title, value)
      }
    },
    onResult ({ event, value }) {
      this.setValue(value)
    },
    onInput ({ event, value }) {
      this.clearRequests()
      if (!value || value.length < 2) return
      this.setValue(value)
      this.fetchSearch({ value })
    },
    async search ({ value, event }) {
      await this.prepareSearch({ value })
      value = this.searched
      const { types } = this
      if (types.length === 1) {
        const type = types[0]
        return this.goTo({ type, value })
      } else {
        await this.searchTypes({ types, value })
        await this.waitForResults()
        const { results } = this
        // redirect when there is only one result
        if (results && results.length === 1) {
          return this.goTo(results[0])
        }
      }
    },
    waitForResults () {
      const vm = this
      return new Promise((resolve) => {
        return vm.createTimeout(() => {
          if (vm.isLoading) resolve(vm.waitForResults())
          else resolve(vm.results)
        })
      })
    },
    createTimeout (cb) {
      const { requestingTimeout } = this
      if (requestingTimeout) clearTimeout(requestingTimeout)
      this.requestingTimeout = setTimeout(cb, 200)
    }
  }
}
</script>
