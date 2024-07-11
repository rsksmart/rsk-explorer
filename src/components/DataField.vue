<template>
  <div class="data-field" :class="fieldClass">
    <template v-if="field.renderAs">
      <component :is="field.renderAs" v-bind="renderAsProps({ field, value, filteredValue, row })"></component>
    </template>
    <template v-else>
      <!-- arrays (uncomplete) -->
      <template v-if="filteredType === 'array'">
        <ul class="array">
          <li v-for="v in value" :key="v">{{ v }}</li>
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
        <template v-if="isTokenTransferTab && IsfieldValue">
          <div class="content-short-value">
            <div class="short-value" :class="{'suffix-value' : (filteredValue !== null && suffix)}">
              {{ shortValue(filteredValue || field.default) }}
              <div class="full-value" v-if="(filteredValue || field.default).length > 10">
                <div class="text-value">
                  {{ filteredValue || field.default }}
                </div>
              </div>
            </div>
            <div class="field-suffix" v-if="filteredValue !== null && suffix">
              &nbsp;{{ suffix }}
            </div>
          </div>
        </template>
        <template v-else-if="trim && !options.noTrim">
          <tool-tip class="field-value" :value="filteredValue || value" :trim="trim" :options="trimOptions" :router-link="link"></tool-tip>
        </template>
        <template v-else>
          <router-link v-if="link" :to="link">
            <div class="field-value">{{ filteredValue || field.default }}</div>
          </router-link>
          <div class="field-value" v-else>{{ filteredValue || field.default }}</div>
        </template>
        <span class="field-suffix" v-if="suffix && filteredValue !== null && !isTokenTransferTab">&nbsp; {{ suffix }}</span>
        <field-icon class="field-value-description" v-if="valueDescription" icon="help" :title="valueDescription"></field-icon>
        <progress-bar v-if="delayed"></progress-bar>
      </template>
    </template>
  </div>
</template>
<script>
import common from '../mixins/common'
import dataMixin from '../mixins/dataMixin'
import { getType } from '../lib/js/utils'
import ProgressBar from './controls/ProgressBar'
import FieldIcon from './FieldIcon'
import { mapGetters } from 'vuex'
export default {
  name: 'data-field',
  components: {
    ProgressBar,
    FieldIcon
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
    },
    fieldClassName: {
      required: false
    }
  },
  computed: {
    ...mapGetters({
      getActiveTab: 'getActiveTab'
    }),
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
      const value = this.makeLink(this.field, this.row)
      return value === this.$route.path ? false : value
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
    },
    isTokenTransferTab () {
      return this.getActiveTab === 'tokens transfers'
    },
    IsfieldValue () {
      if (!Array.isArray(this.fieldClassName)) return null
      return this.fieldClassName[0] === 'field__value'
    }
  },
  methods: {
    shortValue (value) {
      if (value.length > 10) return `${value.substring(0, 10)}...`
      return value
    }
  },
  created () {
    if (this.getActiveTab === 'tokens transfers') {
      this.options.trimAt = 'right'
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/styles/variables';
.content-short-value, .short-value {
  display: flex;
  position: relative;
}
.content-short-value {
  width: 130px;
  justify-content: flex-end;
  .field-suffix {
    display: flex;
    justify-content: flex-end;
  }
  .short-value {
    display: flex;
    justify-content: flex-end;
    &.suffix-value {
      justify-content: flex-end;
    }
  }
}

.short-value div.full-value {
  display: none;
  position: absolute;
  background-color: $newbw_900;
  padding: 5px;
  z-index: 1;
  color: $white_400;
  width: max-content;
  max-width: max-content;
  word-wrap: break-word;
  height: max-content;
  font-size: 14px;
  bottom: 20px;
  border-radius: 5px;
  &::after {
    border-width: 5px;
    border: solid transparent;
    content: ' ';
    height: 0;
    width: 0;
    position: absolute;
    z-index: 100;
}
}

.short-value:hover div.full-value {
  display: block;
}
</style>
