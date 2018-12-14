<template lang="pug">
  .pages(v-if='pages && pages > 1')
    button.page-button(v-if='prev' @click='goToPage(prev,$event)')
      icon(name='arrow-left')
    div(v-else)
    .page-numbers
     span(v-if='!editPage' @click='editPage=true') {{ page }}
     input.page(v-else type='text' :value='page' @change='changePage' @blur='editPage=false')
     small /
     small.link(@click='goToPage(pages)') {{ pages }}
    button.page-button(v-if='next' @click='goToPage(next,$event)')
      icon(name='arrow-right')
    div(v-else)
</template>
<script>
import { mapActions } from 'vuex'
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
      return (this.page > 1) ? this.page - 1 : null
    },
    next () {
      if ((this.page * this.perPage) <= this.total) {
        return parseInt(this.page) + 1
      }
      return null
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
    },
    key () {
      return this.options.key || 'page'
    }
  },
  methods: {
    ...mapActions(['updateRouterQuery']),
    changePage (event) {
      this.editPage = false
      let page = event.target.value
      if (page) this.goToPage(page, event)
    },
    goToPage (page) {
      let key = this.key
      let query = (key) ? { [`page__${key}`]: page } : { page }
      this.updateRouterQuery(query)
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/vars.styl'

  input.page
    width 3em

  .pages
    width 100%
    display flex
    margin 1em
    justify-content space-evenly

  .page-numbers
    color $color

  .page-button
    .svg-icon *
      fill $dark
</style>
