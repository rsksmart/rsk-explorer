<template lang="pug">
  .account-header(v-if='data')
    h2 Address:&nbsp; &nbsp;
      small.soft {{data.address}}
    h2 Balance:&nbsp; &nbsp;
      small.soft {{data.balance | tx-value}}
</template>
<script>
export default {
  name: 'account-header',
  props: ['data']
}
</script>


