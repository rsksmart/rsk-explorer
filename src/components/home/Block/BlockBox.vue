<template>
  <div class="block-box">
    <div class="block-content flex" v-if="block">
      <div class="block-icon">
        <router-link :to="blockLink">
          <img src="@/assets/svg/block-circle.svg" alt="">
        </router-link>
      </div>
      <div class="flex flex-column">
        <router-link :to="blockLink" class="block-link">
          <div class="block-number text-white-100">
            <span>{{ blockNumber }}</span>
          </div>
        </router-link>
        <div class="block-detail flex">
          <div v-for="(f, i) in boxFields" :key="i">
            <div :class="i > 0 ? 'half soft' : 'half'">
              <div v-for="(field, x) in f" :class="x > 0 ? 'xdata soft' : 'xdata'" :key="x">
                <field-title class="small" :field="field"></field-title>
                <render-field :field="field" :row="block"></render-field>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import FieldTitle from '../../FieldTitle'
import dataMixin from '@/mixins/dataMixin'
import RenderField from '../../General/RenderField.vue'
export default {
  name: 'block-box',
  mixins: [dataMixin],
  components: {
    FieldTitle,
    RenderField
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
      return [
        [miner],
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
    }
  }
}
</script>
