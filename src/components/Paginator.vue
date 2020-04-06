<template lang="pug">
  .pages(v-if='next || prev || pages')
    button.page-button(v-if='prev' @click='goToPage(prevIndex,$event)')
      icon(name='arrow-left')
    div(v-else)
    ul.page-numbers(v-if='pages.length > 1')
      li(v-if='prevPage')
        button(@click='goToPage(prevPage,$event)')
          icon.link(name='triangle-arrow-left')
      li.link(v-for='p in pages' :class='(p.page===page) ? "selected":""' @click='goToPage(p)')
        small {{p.page}}
      li(v-if='nextPage')
        button(@click='goToPage(nextPage,$event)')
          icon.link(name='triangle-arrow-right')
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
    nextPage () {
      const aPage = this.findPage(this.page + 1)
      return aPage || this.nextIndex
    },
    prevPage () {
      const pPage = this.findPage(this.page - 1)
      return pPage || this.prevIndex
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
      const { pages, next } = this
      const p = pages[pages.length - 1]
      const page = p.page + 1
      this.goToPage({ page, next })
    },
    goPrev (event) {
      let { prev, page } = this
      page--
      this.goToPage({ prev, page }, event)
    },

    goToPage ({ next, prev, page }, event) {
      const key = this.key
      const nextKey = this.nextKey()(key)
      const prevKey = this.prevKey()(key)
      const pageKey = this.pageKey()(key)
      const query = { [nextKey]: next, [prevKey]: prev, [pageKey]: page }
      this.updateRouterQuery({ query, key })
    },
    findPage (page) {
      const { pages } = this
      const index = pages.findIndex(p => p.page === page)
      return (index > -1) ? pages[index] : null
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
      padding 0.0625em 0.125em
      border-radius $border-radius
      border-color $soft-border

  .page-button
    .svg-icon *
      fill $dark
</style>
