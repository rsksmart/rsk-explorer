<template lang="pug">
  .field-list(v-if="fields")
    template(v-for='field,fieldName in fields')
      field-item(:field="field" :data="data" :fieldName="fieldName")

</template>
<script>
export default {
  name: 'field-list',
  components: {
  },
  props: {
    data: {
      type: Object
    },
    fields: {
      type: Object,
      required: true
    },
    values: {
      type: Object
    }
  }
}
</script>
