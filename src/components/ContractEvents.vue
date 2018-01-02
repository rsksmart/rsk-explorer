<template lang="pug">
  .events
    data-table(:data='data' :formatRow='formatData' type='events' :formatFields='formatFields' :link='link')
</template>
<script>
import { mapGetters } from 'vuex'
import DataTable from './DataTable.vue'
export default {
  name: 'Events',
  props: ['data', 'token'],
  components: {
    DataTable
  },
  computed: {
    ...mapGetters({
      colors: 'getColors',
      account: 'getPageAccount'
    }),
    link () {
      return '/tokens/' + this.token.address + '/events'
    }
  },
  methods: {
    formatFields (fields, parentData) {
      let token = this.token
      let uri = token.baseUri + 'accounts/'
      let def = 'This Account'
      fields.to.link = uri
      fields.to.default = def
      fields.from.link = uri
      fields.from.default = def
      fields.amount.suffix = token.shortName
      return fields
    },
    formatData (event) {
      let account = this.account
      const checkAccount = (val) => {
        return (val !== account) ? val : null
      }
      let args = event.args
      if (args) {
        let to = args._to
        let from = args._from

        if (event.event === 'Aproval') {
          to = args._spender
          from = args._owner
        }
        to = checkAccount(to)
        from = checkAccount(from)
        event.to = to
        event.from = from
        return event
      }
    }
  }
}
</script>

