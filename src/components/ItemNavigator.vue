<template>
  <ul class="prev-next">
    <li class="prev" v-if="prevLink">
      <router-link :to="linkTo(prev)" class="btn">
        <icon name="triangle-arrow-left"></icon>
        <span>Previous</span>
      </router-link>
    </li>
    <li class="total" v-if="total">
      <span>{{ total }}</span>
    </li>
    <li class="next" v-if="nextLink">
      <router-link :to="linkTo(next)" class="btn">
        <span>Next</span>
        <icon name="triangle-arrow-right"></icon>
      </router-link>
    </li>
  </ul>
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
