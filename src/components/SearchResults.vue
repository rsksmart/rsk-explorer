<template lang="pug">
  .search-results
    h2 Search
    .results(v-if='searchResults')
      pre {{searchResults}}
</template>
<script>
export default {
  name: 'search-results',
  props: ['value', 'searchResults']
}
</script>
