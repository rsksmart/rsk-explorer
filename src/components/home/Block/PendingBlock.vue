<template>
  <div class="pending-blocks-content">
    <div class="pending-blocks">
      <button class="btn-upload-blocks" @click="updateBlocks">
        <img src="@/assets/svg/blocks-icon.svg" alt="">
        <div class="w-badge">
          <!-- <div class="badge" :style="badgeStyle">{{ pending }}</div> -->
        </div>
      </button>
      <div class="text-blocks">{{ pending }} new blocks</div>
      <div class="time-blocks">in last {{ now - lastBlocksTime | abbr-time }}</div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { abbrTime } from '@/filters/TimeFilters'

export default {
  name: 'pending-blocks',
  components: {
  },
  filters: {
    abbrTime
  },
  data () {
    return {
      size: 100
    }
  },
  mounted () {
    let size = this.$el.clientWidth / 10
    size = (size >= 100) ? size : 50
    this.size = size
  },
  computed: {
    ...mapGetters({
      pending: 'pendingBlocks',
      firstListBlock: 'firstListBlock',
      lastBlocksTime: 'lastBlocksTime',
      now: 'getDate'
    }),
    mod () {
      const max = (this.pending > 4) ? this.pending : 4
      return (max) ? Math.ceil(Math.cbrt(max)) : 0
    },
    step () {
      let step = this.pending
      if (step > 5000) step = 5000
      return step
    },
    badgeStyle () {
      const width = (this.pending.toString().length) + 'em'
      const height = width
      return { width, height }
    }
  },
  methods: {
    ...mapActions(['updateBlocks']),
    ...mapGetters(['getBlockColor']),

    cubeStyle (cube) {
      const fill = this.getBlockColor()(cube)
      return { fill }
    }
  }
}
</script>
