<template lang="pug">
  .transaction-page(v-if='tx')
    h2 Transaction
    pre {{tx}}
</template>
<script>
export default {
  name: 'transaction',
  props: ['tx']
}
</script>

