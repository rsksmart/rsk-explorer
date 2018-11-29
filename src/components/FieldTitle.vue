<template lang="pug">
  .field-title
    .icon(v-if='showIcon' )
      tool-tip(v-if="!showTitle" :value="field.name | camelCaseTo" :options='tipOptions')
        icon(:name='field.icon')
      icon(v-else :name='field.icon')
    span.title(v-if='showTitle && field.title') {{ field.title | camel-case-to }}
    slot
</template>
<script>
import ToolTip from './ToolTip'
import { camelCaseTo } from '../filters/TextFilters'
export default {
  name: 'field-title',
  components: {
    ToolTip
  },
  props: ['field', 'options'],
  filters: { camelCaseTo },
  data () {
    return {
      forceTitle: false,
      forceIcon: false,
      tipOptions: {
        trim: 0,
        forceTip: true
      }
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
