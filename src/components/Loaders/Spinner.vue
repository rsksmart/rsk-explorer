<template>
  <div class="flex justify-center">
    <div class="spinner" :style='{ width: `${width}px`, height: `${height}px`, borderWidth: `${border}px` }'></div>
  </div>
</template>
<script>
export default {
  props: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    border: {
      type: Number,
      required: true
    }
  }
}
</script>
