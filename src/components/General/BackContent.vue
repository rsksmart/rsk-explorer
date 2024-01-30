<template>
  <div class="back-content">
    <router-link :to="routes[$route.name] || ''" class="flex item-center">
      <icon name="back" :class="$route.name" />
      <span :style="{color: PAGE_COLORS[$route.name].cl}">All</span>
    </router-link>
  </div>
</template>
<script>
import { PAGE_COLORS } from '@/config/pageColors'

export default {
  props: [
    'titleDescription'
  ],
  data () {
    return {
      PAGE_COLORS,
      routes: {
        Block: '/blocks',
        Transaction: '/txs',
        Address: '/addresses',
        'Internal transaction': '/txs',
        Event: '/txs',
        Token: '/tokens'
      }
    }
  }
}
</script>
