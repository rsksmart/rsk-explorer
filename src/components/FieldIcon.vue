<template lang="pug">
  .field-icon.icon(:class='css')
    tool-tip(v-if='title' :value='title | camelCaseTo' :options='tipOptions')
      icon(:name='icon')
    icon(v-else :name='icon')
</template>
<script>
import ToolTip from './ToolTip'
import { camelCaseTo } from '../filters/TextFilters'
export default {
  name: 'field-icon',
  components: {
    ToolTip
  },
  props: ['icon', 'title', 'css'],
  filters: { camelCaseTo },
  data () {
    return {
      tipOptions: {
        trim: 0,
        forceTip: true
      }
    }
  }
}
</script>
