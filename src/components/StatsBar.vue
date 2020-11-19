<template lang="pug">
  .stats-bar.container
    .cols(v-if='stats')
      .col-a
        .cols
          //- first box
          .col-a
            box-field(:field='fields.hashrate' :row='stats' :style='colStyle')
          //- second box
          .col-b
            box-field(:field='fields.circulatingSupply' :row='circulating' :style='colStyle')
      .col-b
        .cols
          //- third box
          .col-a
            box-field(:field='fields.lockingCap' :row='bridge' :style='colStyle')
          //- fourth box
          .col-b
            box-field(:field='fields.activeAccounts' :row='stats' :style='colStyle')
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import dataMixin from '../mixins/dataMixin'
import BoxField from './BoxField'

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
    BoxField
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
