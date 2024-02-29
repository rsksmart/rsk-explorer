<template>
  <div class="last-block bg-secondary">
    <div class="block-title" v-if="title">
      <div class="text-white-100 title">{{ title }}</div>
    </div>
    <router-link :to="blockLink" class="block-number">
      <span class="text-white-100">{{ blockNumber }}</span>
    </router-link>
    <div class="block-detail">
      <div v-for="(f, i) in boxFields" :key="i">
        <div :class="i > 0 ? 'half soft' : 'half'">
          <div v-for="(field, x) in f" :class="x > 0 ? 'xdata soft' : 'xdata'" :key="x">
            <field-title class="small" :field="field"></field-title>
            <render-field class="small" :field="field" :row="block" />
          </div>
        </div>
      </div>
    </div>
    <pending-block />
  </div>
</template>
<script>
import FieldTitle from '@/components/FieldTitle'
import dataMixin from '@/mixins/dataMixin'
import RenderField from '@/components/General/RenderField'
import PendingBlock from '@/components/home/Block/PendingBlock'

export default {
  name: 'last-block',
  mixins: [dataMixin],
  components: {
    FieldTitle,
    RenderField,
    PendingBlock
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
