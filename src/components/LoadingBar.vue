<template lang="pug">
  svg.loading-bar(width="100%" :height='height' )
    transition(name='bar')
      rect(x='0' y='0' :height='height' :width='percentage')
</template>
<script>
export default {
  name: 'loading-bar',
  props: {
    step: {
      default: 0
    },
    height: {
      default: '3px'
    }
  },
  computed: {
    percentage () {
      let { step } = this
      step = step || 0
      step = (step < 0) ? 0 : step
      step = (step > 100) ? 100 : step
      return `${step}%`
    }
  }
}
</script>
