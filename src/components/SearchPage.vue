<template lang="pug">
  .search-page.page
    h2.title Search
    spinner(v-if='isSearching')
    .result(v-else)
      ul.results(v-if='results.length')
        li(v-for="result in results")
          a(:href='result.link') {{result.name}}
      .not-found(v-if='!results.length && !isSearching')
        p The search didn't match any element
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Spinner from './Spinner.vue'
import Message from './Message'
export default {
  name: 'search-page',
  props: ['value'],
  components: {
    Spinner,
    Message
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
