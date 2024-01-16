<template>
  <div class="tooltip">
    <div class="tooltip-text">
      <div class="trim-value flex text-white-400">
        <router-link :to="link">
          {{ firstTrim(text) }}
        </router-link>
        <div class="copy flex">
          <div class="copy-text">...</div>
          <div class="copy-icon">
            <field-icon :icon="'copy'" />
          </div>
        </div>
        <router-link :to="link">
          {{ lastTrim(text) }}
        </router-link>
      </div>
      <div class="container-value">
        <div class="text-value bg-primary">{{ text }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import FieldIcon from '../FieldIcon.vue'

export default {
  components: {
    FieldIcon
  },
  props: {
    text: {
      required: true
    },
    link: {
      required: false
    }
  },
  methods: {
    firstTrim (text) {
      return text.substring(0, 4)
    },
    lastTrim (text) {
      const value = text.length
      return text.substring(value - 4, value)
    }
  }
}
</script>
