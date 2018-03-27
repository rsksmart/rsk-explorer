<template lang="pug">
  .pages 
    button.page-button(v-if='prev' @click='goToPage(prev)')
      icon(name='arrow-left')
    div(v-else)
    span.page-numbers {{ page }} 
     small / 
     small {{ pages }}
    button.page-button(v-if='next' @click='goToPage(next)')
      icon(name='arrow-right')
    div(v-else)
</template>
<script>
export default {
  name: 'paginator',
  props: ['options', 'link'],

  computed: {
    prev () {
      if (this.page > 1) return this.page - 1
    },
    next () {
      if ((this.page * this.perPage) <= this.total) {
        return parseInt(this.page) + 1
      }
    },
    total () {
      return this.options.total
    },
    page () {
      return this.options.page || 1
    },
    pages () {
      return this.options.pages
    },
    perPage () {
      return this.options.perPage
    }
  },
  methods: {
    goToPage (page) {
      let query = Object.assign({}, this.$route.query)
      query.page = page
      this.$router.push({ query })
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/vars.styl'

  .pages
    display flex
    padding 1em
    margin 1em
    justify-content space-evenly

  .page-numbers
    color $color

  .page-button
    .svg-icon *
      fill $dark
</style>
