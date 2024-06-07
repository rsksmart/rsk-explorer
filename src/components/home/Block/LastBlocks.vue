<template>
  <div class="blocks-wrapper box-block-tx" v-show="blocks.length">
    <div class="box-head">
      <div class="box-title">
        <h2 class="title text-white-100">
          <router-link :to="entity.listLink" class="text-white-100">
            <span>{{ pageTitle }}</span>
          </router-link>
        </h2>
        <div class="badge pending-msg flex item-center bg-orange-900" v-if="pending">
          <button @click="updateBlocks">
            <div class="text-primary">{{ pending }} new {{ pending > 1 ? 'blocks' : 'block' }}</div>
          </button>
        </div>
      </div>
      <div class="auto-update">
        autoupdate
        <label class="checkbox-container">
          <input type="checkbox" @change="handleAutoUpdate" :checked="autoUpdate" class="custom-checkbox">
          <span class="checkmark"></span>
        </label>
      </div>
    </div>
    <div class="blocks" v-if="blocks.length">
      <template v-for="(block, index) in blocks">
        <block-box v-if="index <= 5" :block="block" :key="index"></block-box>
      </template>
    </div>
    <div class="msg" v-else>
      <h2>Requesting blocks</h2>
    </div>
    <div class="btn-link">
      <router-link class="text-white-100" :to="'blocks'">
        <span>See all blocks</span>
        <img src="@/assets/svg/arrow-right-icon.svg" alt="arrow-right-icon">
      </router-link>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import BlockBox from '@/components/home/Block/BlockBox.vue'
import dataMixin from '@/mixins/dataMixin'
export default {
  name: 'last-blocks',
  components: {
    BlockBox
  },
  mixins: [
    dataMixin
  ],
  data () {
    return {
      type: 'blocks'
    }
  },
  computed: {
    ...mapState({
      blocks: state => state.backend.blocks,
      lastBlocks: state => state.backend.lastBlocks,
      autoUpdate: state => state.config.autoUpdateBlocks
    }),
    ...mapGetters({
      pending: 'pendingBlocks'
    })
  },
  methods: {
    ...mapActions([
      'updateBlocks',
      'setAutoUpdate'
    ]),
    handleAutoUpdate (event) {
      const value = event.target.checked
      if (value) this.updateBlocks()
      this.setAutoUpdate(value)
    }
  },
  created () {
    this.updateBlocks()
  }
}
</script>
