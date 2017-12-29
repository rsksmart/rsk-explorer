<template lang="pug">
  .block
    ul
      li(v-for='field in fields')
</template>
<script>
export default {
  name: 'block',
  props: ['number'],
  data () {
    return {
      fields:['']
    }
  }
}
</script>
