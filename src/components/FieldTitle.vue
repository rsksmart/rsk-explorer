<template>
  <div class="field-title">
    <field-icon
      class="field-description"
      v-if="description"
      icon="help"
      :title="description">
    </field-icon>
    <field-icon
      v-if="showIcon"
      :icon="field.icon"
      :title="showTitle ? null : field.title">
    </field-icon>

    <span
      class="title"
      v-if="showTitle && field.title">
      {{ field.title | fieldTitleFilter }}
    </span>
    <slot></slot>
  </div>
</template>
<script>
import FieldIcon from './FieldIcon'
import { fieldTitleFilter } from '@/filters/TextFilters'
export default {
  name: 'field-title',
  components: {
    FieldIcon
  },
  filters: {
    fieldTitleFilter
  },
  props: ['field', 'options'],
  data () {
    return {
      forceTitle: false,
      forceIcon: false
    }
  },
  created () {
    const options = this.options || {}
    this.forceTitle = options.forceTitle || false
    this.forceIcon = options.forceIcon || false
    this.hideIcon = options.hideIcon || false
  },
  computed: {
    showTitle () {
      const field = this.field || {}
      return field.showTitle || !field.hideTitle || this.forceTitle
    },
    showIcon () {
      const { field, forceIcon, hideIcon } = this
      if (!field || (hideIcon && !forceIcon)) return false
      return (field.titleIcon || forceIcon) && field.icon
    },
    description () {
      const { description, hideDescription } = this.field
      return (!hideDescription) ? description : false
    }
  }
}
</script>
