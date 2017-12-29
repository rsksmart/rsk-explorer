<template lang="pug">
  .events
    table
      thead
        tr
          template(v-for='field in fields')
            th {{field}} 
      tbody  
        tr(v-for='row in data')
          td {{row.event}}
          template(v-for='field in eventFields(row)')
            td.txt-right
              router-link(v-if='field.from' :to='field.link.from') {{field.from}}
              span(v-else) This account 
            td 
              icon(name='arrow-right' :color='colors.iconColor')
            td.txt-left
              router-link(v-if='field.to' :to='field.link.to') {{field.to}}
              span(v-else) This account {{ field.to }}
          td {{row.args._value | token-value}} {{token.shortName}}
          td {{ now - row.timestamp * 1000  | m-seconds-ago  }} ago
          td {{row.blockNumber}} 
          
</template>
<script>
import { mapGetters } from 'vuex'
import { mSecondsAgo } from '../filters/TimeFilters'
import { tokenValue } from '../filters/TokensFilters'
export default {
  name: 'Events',
  filters: {
    mSecondsAgo,
    tokenValue
  },
  props: ['data', 'token'],

  data () {
    return {
      fields: [
        'type',
        'from',
        ' ',
        'to',
        'amount',
        'date',
        'block'
      ]
    }
  },
  computed: {
    ...mapGetters({
      now: 'getDate',
      page: 'getPage',
      colors: 'getColors',
      account: 'getPageAccount'
    })
  },
  methods: {
    fAccount (val) {
      return (val !== this.account) ? val : null
    },
    eventFields (event) {
      let args = event.args
      if (args) {
        let uri = this.token.baseUri + 'account/'
        let to = args._to
        let from = args._from

        if (event.event === 'Aproval') {
          to = args._spender
          from = args._owner
        }
        to = this.fAccount(to)
        from = this.fAccount(from)
        let link = {
          from: uri + from,
          to: uri + to
        }
        return { fields: { from, to, link } }
      }
    }
  }
}
</script>

