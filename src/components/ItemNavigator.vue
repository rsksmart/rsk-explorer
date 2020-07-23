<template lang="pug">
  ul.prev-next
    li.prev(v-if='prevLink')
      router-link(:to='linkTo(prev)')
        icon(name='triangle-arrow-left')
        small previous
    li.total(v-if='total')
      span {{total}}
    li.next(v-if='nextLink')
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
  computed: {
    prevLink () {
      return this.linkTo(this.prev)
    },
    nextLink () {
      return this.linkTo(this.next)
    }
  },
  methods: {
    ...mapGetters(['getNewRoute']),

    keyPress (event) {
      if (event.preventDefaulted) return
      if (event.code === 'ArrowLeft') this.navigateTo(this.prev)
      if (event.code === 'ArrowRight') this.navigateTo(this.next)
    },

    linkTo (dest) {
      const { regKey } = this
      if (!dest || !regKey) return
      return this.getNewRoute()(regKey, dest)
    },

    navigateTo (dest) {
      if (dest) {
        const link = this.linkTo(dest)
        this.$router.push(link)
      }
    }
  }
}
</script>
