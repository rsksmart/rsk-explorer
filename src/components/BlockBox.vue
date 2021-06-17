<template lang="pug">
  transition(name='blockbox')
    .block-box
      .block.box(v-if='block' :style='blockBoxStyle')
        .block-icon.box-icon
          router-link(:to='blockLink')
            icon(:name='entity.icon' :color='blockColor')
        .box-content
          .block-title(v-if='title')
            h4.title {{title}}
          ul.block-data.flex
            li.half
              router-link(:to='blockLink')
                .block-number(:style='bStyle' )
                  span {{ blockNumber }}
            template(v-for='f,i in boxFields')
              li.half(:class=' (i>0) ? "soft" : "" ')
                .xdata(v-for='field,x in f' :class=' (x>0) ? "soft" : "" ')
                  field-title.small(:field='field')
                  data-field.small(:field='field' :row='block')
</template>
<script>
import DataField from './DataField'
import FieldTitle from './FieldTitle'
import dataMixin from '../mixins/dataMixin'
export default {
  name: 'block-box',
  mixins: [dataMixin],
  components: {
    DataField,
    FieldTitle
  },
  props: ['block', 'title'],
  data () {
    return {
      type: 'blockBox'
    }
  },
  computed: {
    boxFields () {
      const { miner, txs, txDensity, timestamp } = this.fields
      // let { blockHashrate } = this.fields
      return [
        [miner],
        // [blockHashrate],
        [txs, txDensity],
        [timestamp]
      ]
    },
    blockLink () {
      return this.makeLink(this.fields.number, this.block)
    },
    blockNumber () {
      const field = this.fields.number
      const value = this.block.number
      return this.filterFieldValue()({ field, value })
    },
    blockColor () {
      return this.getBlockColor(this.block.number)
    },
    bStyle () {
      const color = this.blockColor
      return { color, fill: color }
    },
    blockBoxStyle () {
      const color = this.blockColor
      return { 'border-color': color }
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/media_queries.styl'

  .block-box
    display flex
    flex 1
    will-change opacity

    .title
      padding 0 !important
      margin 0 !important

  .blockbox-enter-active
    transition opacity 0.5s
    opacity 1

  .blockbox-enter, .block-box-leave-to
    opacity 0

  .xdata
    display flex
    flex-flow row nowrap
    margin 0

  @media $media_medium
    .xdata
      margin 0 1em 0 0
</style>
