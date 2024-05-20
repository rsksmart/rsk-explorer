<template>
  <div class="tx-box">
    <div class="tx-box-content relative flex item-center">
      <div class="box-icon">
        <router-link :to="txLink">
          <img src="@/assets/svg/tx-circle-icon.svg" alt="tx-circle-icon">
        </router-link>
      </div>
      <div class="flex">
        <div class="box-tx-block">
          <render-field :field="fields.hash" :row="tx" class="fw700"/>
          <div class="tx-box-block">
            <router-link :to="blockLink" class="flex text-white-400 item-center fw700">
              <img src="@/assets/svg/block-icon.svg" alt="">
              <div>&nbsp; {{ blockNumber }}</div>
            </router-link>
          </div>
        </div>
        <div class="flex item-end">
          <div class="box-info">
            <div class="flex text-white-400 field-content">
              <div class="half from-to flex item-center">
                <render-field class="small from" :field="fields.from" :row="tx" />
                <icon class="from-to-arrow" name="arrow-right"></icon>
                <render-field class="small to" :field="fields.to" :row="tx" />
              </div>
              <div class="half soft">
                <field-title class="small" :field="fields.time"></field-title>
                <render-field :field="fields.time" :row="tx" />
                <router-link :to="txLink" class="link-icon">
                  <icon name="triangle-arrow-right" />
                </router-link>
              </div>
              <div class="half flex">
                <img src="@/assets/svg/btc-orange.svg" alt="">
                <render-field :field="fields.value" :row="tx" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import dataMixin from '@/mixins/dataMixin'
import FieldTitle from '../FieldTitle'
import RenderField from '../General/RenderField.vue'
export default {
  name: 'tx-box',
  components: {
    FieldTitle,
    RenderField
  },
  mixins: [
    dataMixin
  ],
  props: ['tx'],
  data () {
    return {
      type: 'transactionsBox'
    }
  },
  computed: {
    ...mapGetters({
      now: 'getDate'
    }),
    bField () {
      return this.fields.block
    },
    txLink () {
      return this.makeLink(this.fields.hash, this.tx)
    },
    blockLink () {
      return this.makeLink(this.bField, this.tx)
    },
    blockNumber () {
      const field = this.bField
      const value = this.tx.blockNumber
      return this.filterFieldValue()({ field, value })
    }
  }
}
</script>
