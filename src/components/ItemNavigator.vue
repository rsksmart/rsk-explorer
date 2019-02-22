<template lang="pug">
  ul.prev-next
    li.prev(v-if='prev')
      router-link(:to='linkTo(prev)')
        icon(name='triangle-arrow-left')
        small previous
    li.total(v-if='total')
      span {{total}}
    li.next(v-if='next')
      router-link(:to='linkTo(next)')
        small next
        icon(name='triangle-arrow-right')
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'item-navigator',
  props: ['next', 'prev', 'total', 'regKey'],

  mounted () {
    window.addEventListener('keyup', this.keyPress, { passive: true })
  },

  beforeDestroy () {
    window.removeEventListener('keyup', this.keyPress, { passive: true })
  },

  methods: {
    ...mapGetters(['getNewRoute']),

    keyPress (event) {
      if (event.preventDefaulted) return
      if (event.code === 'ArrowLeft') this.navigateTo(this.prev)
      if (event.code === 'ArrowRight') this.navigateTo(this.next)
    },

    linkTo (dest) {
      let { regKey } = this
      return this.getNewRoute()(regKey, dest)
    },

    navigateTo (dest) {
      if (dest) {
        let link = this.linkTo(dest)
        this.$router.push(link)
      }
    }
  }
}
</script>
