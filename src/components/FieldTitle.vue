<template lang="pug">
  .field-title
    field-icon(v-if='showIcon' :icon='field.icon' :title='(showTitle) ? null: field.title' )
    span.title(v-if='showTitle && field.title') {{ field.title | camel-case-to }}
    slot
</template>
<script>
import FieldIcon from './FieldIcon'
export default {
  name: 'field-title',
  components: {
    FieldIcon
  },
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
      let field = this.field || {}
      return field.showTitle || !field.hideTitle || this.forceTitle
    },
    showIcon () {
      let field = this.field
      if (!field) return false
      return (field.titleIcon || this.forceIcon) && field.icon
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/vars.styl'
  @import '../lib/styl/mixins.styl'

  .field-title
    flex-centered()

    .icon
      display inline-flex

    .icon + .title
      margin 0 0 0 0.5em
</style>
