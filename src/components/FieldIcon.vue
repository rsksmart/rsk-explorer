<template>
  <div class="field-icon icon" :class="css">
    <tool-tip v-if="title" :value="title | camelCaseTo" :options="tipOptions">
      <icon :name="icon"></icon>
    </tool-tip>
    <icon v-else :name="icon"></icon>
  </div>
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
<style lang="stylus">
  @import '../lib/styl/icons.styl';
</style>
