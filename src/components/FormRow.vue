<template lang="pug">
  .form-row
    label {{label}}
    .form-ctrls
      slot
    .form-help {{description}}
</template>
<script>
export default {
  name: 'form-row',
  props: ['label', 'description']
}
</script>
