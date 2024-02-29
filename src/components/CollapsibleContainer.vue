<template lang="pug">
  .collapsible-container(:class='css')
    .header(@click='collapse')
      .title
        slot(name='header')
      button
        icon(v-if='collapsed' name='triangle-arrow-right')
        icon(v-else name='triangle-arrow-up')
    transition(name='expand')
      .content(v-if='!collapsed')
        slot

</template>
<script>
export default {
  name: 'collapsible-container',
  props: ['expanded'],
  data () {
    return {
      collapsed: true
    }
  },
  created () {
    this.collapsed = !this.expanded
  },
  computed: {
    css () {
      return (this.collapsed) ? 'collapsed' : 'expanded'
    }
  },
  methods: {
    collapse (event) {
      this.collapsed = !this.collapsed
      this.$emit('collapse', this.collapsed)
    }
  }
}
</script>
