<template lang="pug">
  .error
    h1 {{error.error || 'ERROR'}}
</template>
<script>
export default {
  name: 'errorPage',
  props: ['error']
}
</script>

