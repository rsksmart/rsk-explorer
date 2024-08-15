<template>
  <div class="search-page page">
    <spinner v-if="isSearching" :height="300" :width="300" :border="5" />
    <template v-else>
      <h2 class="title">Search</h2>
      <div class="result">
        <ul class="results" v-if="results.length">
          <li v-for="result in results" :key="result.id">
            <a :href="result.link">{{ result.name }}</a>
          </li>
        </ul>
        <ul class="results" v-else-if="types.length">
          <li>
            <a :href="linkToSearch">{{ currentType }} {{ searched }}</a>
          </li>
        </ul>
        <div class="not-found" v-if="!results.length && !isSearching && !types.length">
          <p>The search didn't match any element</p>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Spinner from './Loaders/Spinner.vue'
export default {
  name: 'search-page',
  props: ['value'],
  components: {
    Spinner
  },
  created () {
    const { value, searched, search } = this
    if (searched !== value) search(value)
  },
  computed: {
    ...mapGetters({
      results: 'getSearchedResults',
      searched: 'searchedValue',
      requesting: 'requestingSearches',
      types: 'searchedTypes',
      searchedTypes: 'searchedTypes',
      currentType: 'searchedType',
      linkToSearch: 'linkToSearch'
    }),
    isSearching () {
      return this.requesting.length
    }
  },
  methods: {
    ...mapActions([
      'fetchSearch',
      'prepareSearch',
      'searchTypes'
    ]),
    ...mapGetters([
      'getPage',
      'getSearchLink'
    ]),
    goTo ({ type, value }) {
      this.getSearchLink()({ type, value })
    },
    async search (value) {
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
