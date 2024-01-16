<template>
  <transition name="blockbox">
    <div class="block-box">
      <div class="block box" v-if="block" :style="blockBoxStyle">
        <div class="block-icon box-icon">
          <router-link :to="blockLink">
            <icon :name="entity.icon" :color="blockColor"></icon>
          </router-link>
        </div>
        <div class="box-content">
          <div class="block-title" v-if="title">
            <h4 class="title">{{ title }}</h4>
          </div>
          <ul class="block-data flex">
            <li class="half">
              <router-link :to="blockLink">
                <div class="block-number" :style="bStyle">
                  <span>{{ blockNumber }}</span>
                </div>
              </router-link>
            </li>
            <div v-for="(f, i) in boxFields" :key="i">
              <li :class="i > 0 ? 'half soft' : 'half'">
                <div v-for="(field, x) in f" :class="x > 0 ? 'xdata soft' : 'xdata'" :key="x">
                  <field-title class="small" :field="field"></field-title>
                  <data-field class="small" :field="field" :row="block"></data-field>
                </div>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </div>
  </transition>
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
      padding 0
      margin 0

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
