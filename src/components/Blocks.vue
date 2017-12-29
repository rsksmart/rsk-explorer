<template lang="pug">
  .blocks-page
    h1 Blocks
    template(v-if='data')
      table
        thead
          tr
            th number
            th hash
            th transactions
            th
              icon(name='stopwatch')
        tbody
          tr(v-for='block in data' )
            td
              router-link(:to='"/blocks/" + block.number' :style='blockStyle()(block.number)') {{block.number}}
            td
              tool-tip.to(:value='block.hash' :trim='trim' :options='ttOpts') 
            
            td {{block.transactions.length}}
            td
              small {{ (now - block.timestamp * 1000) | m-seconds-ago }} ago
</template>
<script>
import common from '../mixins/common'
export default {
  name: 'blocks',
  props: ['data'],
  mixins: [common],
  methods: {
    isArray (val) {
      return Array.isArray(val)
    }

  }

}
</script>

