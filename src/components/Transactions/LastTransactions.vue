<template>
  <div class="tx-wrapper box-block-tx">
    <div class="box-head">
      <div class="box-title">
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
    </div>
    <div class="tx-container" v-for="(tx, index) in lastTxs" :key="index">
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
import { mapActions, mapGetters, mapState } from 'vuex'
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
      type: 'transactions',
      lastTxsStore: []
    }
  },
  watch: {
    transactions () {
      if (this.lastTxsStore.length === 0) {
        this.lastTxsStore = this.lastTransactions?.length > 0 ? this.lastTransactions : this.transactions
      }
    },
    blocks () {
      this.fetchTxsData()
    }
  },
  computed: {
    ...mapGetters({
      lastTransactions: 'lastTransactions',
      transactions: 'transactions',
      pending: 'getTxPoolPending',
      queued: 'getTxPoolQueued'
    }),
    ...mapState({
      blocks: state => state.backend.blocks
    }),
    txPoolPath () {
      return ROUTES.txPool
    },
    txsInPool () {
      return this.pending + this.queued
    },
    lastTxs () {
      if (this.lastTransactions?.length > 0) {
        this.updateTxs(this.lastTransactions)
      }
      let value = this.lastTransactions?.length > 0 ? this.lastTransactions : this.lastTxsStore
      if (value[0]?.blockNumber > this.blocks[0]?.number) {
        value = value.filter((v) => v.blockNumber !== value[0]?.blockNumber)
      }
      return value
    }
  },
  methods: {
    ...mapActions([
      'fetchRouteData'
    ]),
    updateTxs (data) {
      this.lastTxsStore = data
    },
    fetchTxsData () {
      const action = 'getTransactions'
      const params = undefined
      const module = 'transactions'
      const key = 'data'
      this.fetchRouteData({ action, params, module, key })
    }
  },
  created () {
    this.fetchTxsData()
  }
}
</script>
