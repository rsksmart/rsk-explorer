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
            li.half
              field-title.small(:field='fields.miner')
              data-field.small(:field='fields.miner' :row='block')
            li.half.soft(:style='bStyle')
              field-title(:field='fields.txs')
              data-field(:field='fields.txs' :row='block')
            li.half.soft
              field-title.small(:field='fields.timestamp')
              data-field.small(:field='fields.timestamp' :row='block')
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
    blockLink () {
      return this.makeLink(this.fields.number, this.block)
    },
    blockNumber () {
      return this.filterFieldValue()(this.fields.number, this.block.number)
    },
    blockColor () {
      return this.getBlockColor(this.block.number)
    },
    bStyle () {
      let color = this.blockColor
      return { color, fill: color }
    },
    blockBoxStyle () {
      let color = this.blockColor
      return { 'border-color': color }
    }
  }
}
</script>
<style lang="stylus">
  .block-box
    display flex
    flex 1 1 100%
    will-change opacity

    .title
      padding 0
      margin 0

  .blockbox-enter-active
    transition opacity 0.5s
    opacity 1

  .blockbox-enter, .block-box-leave-to
    opacity 0
</style>
