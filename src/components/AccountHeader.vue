<template lang="pug">
  .account-header(v-if='data')
    ul.data
      li(v-for='field in items')
        field-title(:field='fields[field]' :options='options')
        data-field(:field='fields[field]' :row='data' :options='options')
</template>
<script>
import DataField from './DataField'
import FieldTitle from './FieldTitle'
import dataMixin from '../mixins/dataMixin'
export default {
  name: 'account-header',
  components: {
    DataField,
    FieldTitle
  },
  mixins: [dataMixin],
  props: ['data'],
  data () {
    return {
      type: 'address',
      items: ['address', 'balance'],
      options: {
        noTrim: true,
        forceIcon: true
      }
    }
  }
}
</script>


