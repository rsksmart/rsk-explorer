<template>
  <div class="back-content">
    <router-link :to="routes[$route.name].route || ''" class="flex item-center">
      <icon name="back" :class="$route.name" />
      <span :style="{color: PAGE_COLORS[$route.name].cl}">{{ `All ${routes[$route.name].name}` }}</span>
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
        Block: {
          route: '/blocks',
          name: 'Blocks'
        },
        Transaction: {
          route: '/txs',
          name: 'Transactions'
        },
        Address: {
          route: '/addresses',
          name: 'Addresses'
        },
        'Internal transaction': {
          route: '/txs',
          name: 'Transactions'
        },
        Event: {
          route: '/txs',
          name: 'Transactions'
        },
        Token: {
          route: '/tokens',
          name: 'Tokens'
        },
        'Account Balance': {
          route: '/balance',
          name: 'Balance'
        }
      }
    }
  }
}
</script>
