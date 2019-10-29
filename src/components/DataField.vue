<template lang="pug">
  .data-field(:style='cellStyle(field,value)' :class='fieldClass')
    template(v-if='field.renderAs')
      component(:is='field.renderAs' v-bind='renderAsProps({field,value,filteredValue})' )
    template(v-else)
      //- arrays (uncomplete)
      template(v-if='filteredType === "array"')
        ul.array
          li(v-for='v in value') {{v}}
      template(v-else-if='filteredType === "object"')
        ul
          li(v-for='p in Object.keys(value)')
            strong {{p}}:&nbsp;
            span {{value[p]}}

      template(v-else)
        template(v-if='trim && !options.noTrim')
          tool-tip.field-value(:value='filteredValue || value' :trim='trim' :options='trimOptions' :router-link='link')
        template(v-else)
          router-link(v-if='link' :to='link')
            .field-value {{ filteredValue || field.default }}
          .field-value(v-else) {{ filteredValue || field.default }}
        span(v-if='suffix && filteredValue !== null') &nbsp; {{suffix}}
        progress-bar(v-if='delayed')
</template>
<script>
import common from '../mixins/common'
import dataMixin from '../mixins/dataMixin'
import { getType} from '../lib/js/utils'
import ProgressBar from './ProgressBar'
export default {
  name: 'data-field',
  components: {
    ProgressBar
  },
  mixins: [common, dataMixin],
  props: {
    field: {
      type: Object,
      required: true
    },
    row: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: Object
    },
    delayed: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    filteredValue () {
      return this.filterFieldValue()(this.field, this.value, this.row)
    },
    value () {
      return this.getValue(this.field, this.row, true)
    },
    filteredType () {
      return getType(this.filteredValue)
    },
    link () {
      return this.makeLink(this.field, this.row)
    },
    trim () {
      return this.computeTrim(this.field, this.value, this.filteredValue)
    },
    trimOptions () {
      let options = this.ttOpts
      let fieldOptions = this.field.trimOptions
      if (fieldOptions) options = Object.assign(options, fieldOptions)
      return options
    },
    fieldClass () {
      return this.fieldCss(this.field, this.value, this.filteredValue, this.row)
    },
    suffix () {
      return this.fieldSuffix(this.field, this.value, this.filteredValue, this.row)
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/vars.styl'
  @import '../lib/styl/mixins.styl'
  @import '../lib/styl/lists.styl'

  .data-field
    ul
      display flex
      flex-flow column
      flex 1
      margin 0
      padding 0

      li
        break-word()

    ul.array
      font-size 0.9em
      list-style none

  .data-field, .data-field > a, .data-field > .tooltip, max-width 100%
    display flex
    position relative
    break-word()
    justify-content center
    align-items center

  .field-value
    overflow-wrap break-word
    word-wrap break-word
    -ms-word-break break-all
    word-break break-all
    word-break break-word
    -ms-hyphens auto
    -moz-hyphens auto
    -webkit-hyphens auto
    hyphens auto

  .flex-table
    & td .data-field
      width 100%

  .data-field.items-list ul
    list-style none
    margin 0
    padding 0
    display flex
    flex-flow row wrap

    li
      display flex
      margin 0 0 0 1em

    :first-child
      margin 0
</style>
