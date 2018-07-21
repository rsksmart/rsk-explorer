<template lang="pug">
  .pages(v-if='pages && pages > 1')
    button.page-button(v-if='prev' @click='goToPage(prev)')
      icon(name='arrow-left')
    div(v-else)
    .page-numbers
     span(v-if='!editPage' @click='editPage=true') {{ page }}
     input.page(v-else type='text' :value='page' @change='changePage' @blur='editPage=false')
     small /
     small.link(@click='goToPage(pages)') {{ pages }}
    button.page-button(v-if='next' @click='goToPage(next)')
      icon(name='arrow-right')
    div(v-else)
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'paginator',
  props: ['options', 'link', 'tab'],
  data () {
    return {
      editPage: false
    }
  },
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
    ...mapActions(['updateRouterQuery']),
    changePage (event) {
      this.editPage = false
      let page = event.target.value
      if (page) this.goToPage(page)
    },
    goToPage (page) {
      let query = Object.assign({}, this.$route.query)
      let tab = this.tab
      query.page = page
      if (tab) query.tab = tab
      this.$router.push({ query })
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
