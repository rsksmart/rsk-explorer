<template>
  <div class="tx-wrapper box-block-tx">
    <div class="box-head">
      <h2 class="title text-white-100">
        <router-link :to="entity.listLink" class="text-white-100">
          <span>{{ pageTitle }}</span>
        </router-link>
      </h2>
      <div class="badge bg-pink-900 flex item-center">
        <router-link :to="txPoolPath" class="text-primary flex justify-between item-center">
          <div v-if="txsInPool === 0">{{ txsInPool }} tx in pool</div>
          <div v-if="txsInPool === 1">{{ txsInPool }} tx in pool</div>
          <div v-if="txsInPool > 1">{{ txsInPool }} txs in pool</div>
        </router-link>
      </div>
    </div>
    <div class="tx-container" v-for="(tx, index) in transactions" :key="index">
      <tx-box v-if="index <= 5" :tx="tx" />
    </div>
    <div class="btn-link">
      <router-link class="text-white-100" to="/txs">
        <span>See all transactions</span>
        <img src="@/assets/svg/arrow-right-icon.svg" alt="arrow-right-icon">
      </router-link>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import dataMixin from '@/mixins/dataMixin'
import { ROUTES } from '@/config/types'
import TxBox from './TxBox.vue'
export default {
  name: 'last-transactions',
  components: {
    TxBox
  },
  mixins: [
    dataMixin
  ],
  data () {
    return {
      type: 'transactions'
    }
  },
  computed: {
    ...mapGetters({
      transactions: 'transactions',
      pending: 'getTxPoolPending',
      queued: 'getTxPoolQueued'
    }),
    txPoolPath () {
      return ROUTES.txPool
    },
    txsInPool () {
      return this.pending + this.queued
    }
  }
}
</script>
