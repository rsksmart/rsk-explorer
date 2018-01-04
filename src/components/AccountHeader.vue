<template lang="pug">
  .account-header(v-if='data')
    h2 Account:&nbsp; &nbsp;
      small.soft {{data.account}}
</template>
<script>
export default {
  name: 'account-header',
  props: ['data']
}
</script>


