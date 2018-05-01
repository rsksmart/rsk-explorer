<template lang="pug">
  .field-title
    .icon(v-if='showIcon' )
      tool-tip(v-if='!showTitle' :value='field.name')
        icon(:name='field.icon')
      icon(v-else :name='field.icon')  
    span.title(v-if='showTitle') {{ field.title }}
    slot
</template>
<script>
import ToolTip from './ToolTip'
export default {
  name: 'field-title',
  components: {
    ToolTip
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
  @import '../lib/styl/vars.styl'
  @import '../lib/styl/mixins.styl'
  .field-title
    flex-centered()
    .icon
      display inline-flex
    .icon + .title
      margin 0 0 0 0.5em
      
</style>


