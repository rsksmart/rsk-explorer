<template lang="pug">
  .user-config.section.verify-contracts
    h1 Settings
    form.flex
      form-row(v-bind='formFields.FORMAT')
        export-format()
      form-row(v-bind='formFields.DECIMALS')
        decimal-places()
</template>
<script>
import FormRow from './FormRow'
import ExportFormat from './controls/ExportFormat'
import DecimalPlaces from './controls/DecimalPlaces'
import { formFields } from '../config/texts/userConfig'
export default {
  name: 'user-config',
  components: {
    FormRow,
    ExportFormat,
    DecimalPlaces
  },
  data () {
    return {
      formFields
    }
  }
}
</script>
