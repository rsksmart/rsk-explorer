<template lang="pug">
  .transactions-page.centered
    table(v-if='tData')
      thead
        tr
          th hash
          th block
          th.from from
          th  
          th.to to
          th gas
          th.soft
            icon(name='stopwatch')
          th  
      tbody
        tr(v-for='row in tData')
          td 
            tool-tip(:value='row.hash' :trim='trim' :options='ttOpts')
          td 
            router-link(:to='"/blocks/" + row.blockNumber')
              span(:style='blockStyle(row.blockNumber)') {{ row.blockNumber }}
          td.from
            tool-tip.from(:value='row.from' :trim='trim' :options='ttOpts')
          td.arrow 
            icon(name='arrow-right' :color='colors.iconColor')
          td.to
            tool-tip.to(:value='row.from' :trim='trim' :options='ttOpts')
          td {{ row.gas }}
          td.soft 
            small {{ (now - row.timestamp * 1000) | m-seconds-ago }} ago
          td 
            router-link(:to='"/transactions/" + row.hash')
              icon(name='load')

           
</template>
<script>
import common from '../mixins/common'
export default {
  name: 'transactions',
  mixins: [common],
  props: ['data'],
  computed: {
    tData () {
      let data = this.data
      if (data) {
        if (data[0].transactions) {
          return data.map((i, p) => {
            let t = i.transactions
            t.timestamp = data[p].timestamp
            return t
          })
        }
        return data
      }
    }
  },
  methods: {
    blockStyle (block) {
      let color = this.getBlockColor(block)
      return { color }
    }
  }
}
</script>

