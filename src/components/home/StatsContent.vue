<template>
  <div class="content-stats">
    <stat-item :field="fields.hashrate" :stats="stats" :icon="'@/assets/svg/fire-icon.svg'">
      <img src="@/assets/svg/fire-icon.svg" alt="fire-icon">
    </stat-item>
    <stat-item :field="fields.circulatingSupply" :stats="stats.circulating || {}">
      <img src="@/assets/svg/btc-white-icon.svg" alt="btc-white-icon">
    </stat-item>
    <stat-item :field="fields.lockingCap" :stats="stats.bridge || {}">
      <img src="@/assets/svg/btc-white-icon.svg" alt="btc-white-icon">
    </stat-item>
    <stat-item :field="fields.activeAccounts" :stats="stats || {}">
      <img src="@/assets/svg/people-icon.svg" alt="people-icon">
    </stat-item>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import dataMixin from '../../mixins/dataMixin'
import StatItem from './StatItem.vue'

// Todo, use css grid & remove this method
const getBoxHeight = box => {
  const { clientHeight } = box
  const style = window.getComputedStyle(box, null)
  const { paddingTop, paddingBottom } = style
  const padding = parseInt(paddingTop) + parseInt(paddingBottom)
  return clientHeight - padding
}
export default {
  name: 'stats-bar',
  mixins: [dataMixin],
  components: {
    // BoxField,
    StatItem
  },
  data () {
    return {
      type: 'stats',
      colHeight: 0
    }
  },
  mounted () {
    this.onResize()
  },
  watch: {
    aSize () {
      this.onResize()
    }
  },
  computed: {
    ...mapState({
      stats: state => state.backend.stats
    }),
    ...mapGetters({
      appSize: 'getSize'
    }),
    circulating () {
      return this.stats.circulating || {}
    },
    bridge () {
      return this.stats.bridge || {}
    },
    colStyle () {
      return { 'min-height': this.colHeight + 'px' }
    },
    aSize () {
      return this.appSize.h
    },
    showTitle () {
      const field = this.fields || {}
      return field.showTitle || !field.hideTitle || this.forceTitle
    },
    filteredValue () {
      const { fields, value, stats } = this
      return this.filterFieldValue()({ field: fields.hashrate, value, data: stats })
    },
    value () {
      return this.getValue(this.fields.hashrate, this.stats, true)
    }
  },
  methods: {
    onResize () {
      this.colHeight = 0
      const vm = this
      this.$nextTick(() => {
        setTimeout(vm.setColHeight, 100)
      })
    },
    setColHeight () {
      const boxes = this.$el.getElementsByClassName('box-field')
      let height = 0
      for (const box of boxes) {
        const boxheight = getBoxHeight(box)
        height = (boxheight > height) ? boxheight : height
      }
      this.colHeight = height || 0
    }
  }
}
</script>
