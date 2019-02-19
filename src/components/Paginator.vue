<template lang="pug">
  .pages(v-if='next || prev || pages')
    button.page-button(v-if='prev' @click='goToPage(prevIndex,$event)')
      icon(name='arrow-left')
    div(v-else)  
    ul.page-numbers(v-if='pages.length > 1')
      li.link(v-for='p in pages' :class='(p.page===page) ? "selected":""' @click='goToPage(p)')
        small {{p.page}}
    button.page-button(v-if='nextIndex' @click='goToPage(nextIndex,$event)')
      icon(name='arrow-right')
    div(v-else)
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import common from '../mixins/common'
export default {
  name: 'paginator',
  props: ['options', 'link'],
  mixins: [
    common
  ],
  data () {
    return {
      editPage: false
    }
  },
  computed: {
    prev () {
      return this.options.prev
    },
    next () {
      return this.options.next
    },
    nextIndex () {
      let { next, nextPage } = this.options
      next = (next) ? { next } : null
      return (this.pages.length) ? nextPage : next
    },
    prevIndex () {
      let { prev, prevPage } = this.options
      prev = (prev) ? { prev } : null
      return (this.pages.length) ? prevPage : prev
    },
    total () {
      return this.options.total
    },
    page () {
      return this.options.page
    },
    pages () {
      return this.options.pages || []
    },
    perPage () {
      return this.options.limit
    },
    key () {
      return this.options.key || 'page'
    }
  },
  methods: {
    ...mapActions(['updateRouterQuery']),
    ...mapGetters(['nextKey', 'prevKey', 'pageKey']),

    goNext (event) {
      console.log(this.options)
      let { pages, next } = this
      let p = pages[pages.length - 1]
      let page = p.page + 1
      this.goToPage({ page, next })
    },
    goPrev (event) {
      let { prev, page } = this
      page--
      this.goToPage({ prev, page }, event)
    },

    goToPage ({ next, prev, page }, event) {
      let key = this.key
      let nextKey = this.nextKey()(key)
      let prevKey = this.prevKey()(key)
      let pageKey = this.pageKey()(key)
      let query = { [nextKey]: next, [prevKey]: prev, [pageKey]: page }
      this.updateRouterQuery({ query })
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/vars.styl'
  @import '../lib/styl/mixins.styl'

  input.page
    width 3em

  .pages
    width 100%
    display flex
    margin 1em
    justify-content space-evenly

  ul.page-numbers
    display flex
    flex-flow row nowrap
    color $color
    list-style none

    li
      margin 0 0.25em
      min-width 1em
      flex-centered()
    li.selected
      padding .0625em .125em
      border-radius $border-radius
      border-color $soft-border

  .page-button
    .svg-icon *
      fill $dark
</style>
