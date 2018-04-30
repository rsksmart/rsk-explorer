<template lang="pug">
  .field-title
    icon.field-icon(v-if='showIcon' :name='field.icon')
    span.field-title(v-if='showTitle') {{ field.title }}
    slot
</template>
<script>
export default {
  name: 'field-title',
  props: ['field', 'options'],
  data () {
    return {
      forceTitle: false,
      forceIcon: false
    }
  },
  created () {
    let options = this.options || {}
    this.forceTitle = options.forceTitle || false
    this.forceIcon = options.forceIcon || false
  },
  computed: {
    showTitle () {
      return !this.field.hideTitle || this.forceTitle
    },
    showIcon () {
      let field = this.field
      return (field.titleIcon || this.forceIcon) && field.icon
    }
  }
}
</script>
<style lang="stylus">
  .field-icon + .field-title
    margin 0 0 0 .5em
</style>


