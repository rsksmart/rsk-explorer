<template>
  <div class="data-field" :style="cellStyle(field, value)" :class="fieldClass">
    <template v-if="field.renderAs">
      <component :is="field.renderAs" v-bind="renderAsProps({ field, value, filteredValue, row })"></component>
    </template>
    <template v-else>
      <!-- arrays (uncomplete) -->
      <template v-if="filteredType === 'array'">
        <ul class="array">
          <li v-for="v in value" :key="v">{{ v }}qwqw</li>
        </ul>
      </template>
      <template v-else-if="filteredType === 'object'">
        <ul>
          <li v-for="p in Object.keys(value)" :key="p">
            <strong>{{ p }}:&nbsp;</strong>
            <span>{{ value[p] }}</span>
          </li>
        </ul>
      </template>
      <template v-else>
        <template v-if="trim && !options.noTrim">
          <tool-tip :text="filteredValue" :link="link" />
        </template>
        <template v-else>
          <router-link v-if="link" :to="link">
            <div class="field-value">{{ filteredValue || field.default }}</div>
          </router-link>
          <div class="field-value" v-else>{{ filteredValue || field.default }}</div>
        </template>
        <span class="field-suffix" v-if="suffix && filteredValue !== null">&nbsp; {{ suffix }}</span>
        <field-icon class="field-value-description" v-if="valueDescription" icon="help" :title="valueDescription"></field-icon>
        <progress-bar v-if="delayed"></progress-bar>
      </template>
    </template>
  </div>
</template>
<script>
import common from '../../mixins/common'
import dataMixin from '../../mixins/dataMixin'
import { getType } from '../../lib/js/utils'
import ProgressBar from '../controls/ProgressBar'
import FieldIcon from '../FieldIcon'
import ToolTip from './Tooltip'
export default {
  name: 'render-field',
  components: {
    ProgressBar,
    FieldIcon,
    ToolTip
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
      const { field, value, row } = this
      return this.filterFieldValue()({ field, value, data: row })
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
      const fieldOptions = this.field.trimOptions
      if (fieldOptions) options = Object.assign(options, fieldOptions)
      return options
    },
    fieldClass () {
      return this.fieldCss(this.field, this.value, this.filteredValue, this.row)
    },
    suffix () {
      return this.fieldSuffix(this.field, this.value, this.filteredValue, this.row)
    },
    valueDescription () {
      return this.fieldValueDescription(this.field, this.value, this.filteredValue, this.row)
    }
  }
}
</script>
