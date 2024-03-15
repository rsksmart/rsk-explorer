<template>
  <div>
    <spinner v-if="type === 'spinner'" />
    <table-loader v-if="typeLoader === 'table'" />
    <section-loader v-if="typeLoader === 'section'" />
  </div>
</template>
<script>
import Spinner from './Spinner.vue'
import TableLoader from './TableLoader.vue'
import SectionLoader from './SectionLoader.vue'
export default {
  components: {
    Spinner,
    TableLoader,
    SectionLoader
  },
  props: ['type', 'fixed'],
  data () {
    return {
      typeLoader: ''
    }
  },
  created () {
    if (this.fixed) {
      this.typeLoader = this.type
      return
    }
    if (Object.values(this.$route.params).length > 0) {
      this.typeLoader = 'section'
    } else {
      this.typeLoader = 'table'
    }
  }
}
</script>
