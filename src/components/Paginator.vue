<template>
  <div class="pages" v-if='next || prev || pages'>
    <button class="page-button" v-if='prev' @click='goToPage(prevIndex,$event)'>
      <icon name='triangle-arrow-left'></icon>
    </button>
    <div v-else></div>
    <ul class="page-numbers" v-if='pages.length > 1'>
      <button v-if='prevPage' class="prev-page" @click='goToPage(prevPage,$event)'>
        <icon class="link" name='arrow-left'></icon>
      </button>
      <li class="link" v-for='(p, i) in pages'
        :style='{ backgroundColor: (p.page===page) ? PAGE_COLORS[$route.name].cl : "" } '
        @click='goToPage(p)' :key="`${i}`">
        <small>{{ p.page }}</small>
      </li>
      <button v-if='nextPage' class="next-page" @click='goToPage(nextPage,$event)'>
        <icon class="link" name='triangle-arrow-right'></icon>
      </button>
    </ul>
    <button class="page-button" v-if='nextIndex' @click='goToPage(nextIndex,$event)'>
      <icon name='arrow-right'></icon>
    </button>
    <div v-else></div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import common from '../mixins/common'
import { PAGE_COLORS } from '@/config/pageColors'

export default {
  name: 'paginator',
  props: ['options', 'link'],
  mixins: [
    common
  ],
  data () {
    return {
      editPage: false,
      PAGE_COLORS
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
