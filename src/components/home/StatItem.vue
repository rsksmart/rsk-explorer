<template>
  <div class="stats-item bg-secondary">
    <div>
      <div class="stats-item-value text-primary text-white-100">
        {{ filteredValue }}
      </div>
      <div class="stats-item-text text-white-400">
        {{ capitalizeFirstLetter(field.title) }}
      </div>
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>
<script>
import dataMixin from '../../mixins/dataMixin'
export default {
  props: {
    field: {
      required: true
    },
    stats: {
      required: true
    }
  },
  mixins: [dataMixin],
  computed: {
    filteredValue () {
      const { field, value, stats } = this
      return this.filterFieldValue()({ field, value, data: stats })
    },
    value () {
      return this.getValue(this.field, this.stats, true)
    }
  },
  methods: {
    capitalizeFirstLetter (string) {
      return string.replace(/\b\w/g, function (char) {
        return char.toUpperCase()
      })
    }
  }
}
</script>
