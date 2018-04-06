<template lang="pug">
  .block-page(v-if='block')
    h2(:style='blockColor(block.number)') 
      icon(name='cube') 
      span Block {{block.number | locale}}
    .box
      dl.data
        dt Time 
        dd.soft {{ (now - block.timestamp * 1000) | m-seconds-ago }} ago
        
        dt Hash
        dd
          tool-tip(:value='block.hash' :trim='trim' :options='ttOpts')
        
        dt Parent Hash
        dd
          tool-tip(:value='block.parentHash' :trim='trim' :options='ttOpts')
        
        dt sha3 Uncles
        dd 
          tool-tip(:value='block.sha3Uncles' :trim='trim' :options='ttOpts')
        
        dt Mined by
        dd {{block.miner}}
        
        dt Difficulty
        dt Total Difficulty
        
        dt Gas Limit
        dd {{block.gasLimit}}
        
        dt Gas Used 
        dd {{block.gasUsed}}
        
        dt Nonce 
        dd {{block.nonce}}
    
    .box(v-if='block.transactions' )
      h4 Transactions
      data-table(:data='block.transactions' type='transactions' :hideFields='["block"]' link='/transactions' :sort='null')
</template>
<script>
import common from '../mixins/common'
import DataTable from './DataTable.vue'
export default {
  name: 'block',
  components: {
    DataTable
  },
  mixins: [common],
  props: ['block'],
  methods: {
    blockColor (number) {
      let color = this.getBlockColor(number)
      return { color }
    }
  }

}
</script>
<style lang="stylus">
  .block-page
    h2 svg.svg-icon
      width 1.5em
      height @width
      margin-right 1em
</style>

