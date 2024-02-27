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
        <div class="not-found" v-if="!results.length && !isSearching">
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
      types: 'searchedTypes'
    }),
    isSearching () {
      return this.requesting.length
    }
  },
  methods: {
    ...mapActions([
      'fetchSearch',
      'prepareSearch',
      'searchTypes']),
    async search (value) {
      await this.prepareSearch({ value })
      const { types } = this
      if (types.length) await this.searchTypes({ types, value })
      else await this.fetchSearch({ value })
    }
  }
}
</script>
