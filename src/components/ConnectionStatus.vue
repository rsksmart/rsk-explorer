<template>
  <div class="connection-status" :class="status.css">
    <loading-bar :step="waitingPercentage"></loading-bar>
    <div class="line-item">
      <waiting-dots class="line-item" v-if="!connected && isWaiting"></waiting-dots>
      <div class="message" v-else>{{ status.msg }}</div>
      <div class="time" v-if="showTime">{{ status.time | m-seconds-ago }}</div>
    </div>
  </div>
</template>
<script>
import { CONNECTION_STATUS as STATUS } from '../config/types'
import { mapState, mapGetters } from 'vuex'
import WaitingDots from './WaitingDots'
import LoadingBar from './LoadingBar'
import { mSecondsAgo } from '../filters/TimeFilters'
const WAITING_TIME = 15 * 1000
export default {
  name: 'connection-status',
  components: {
    WaitingDots,
    LoadingBar
  },
  filters: {
    mSecondsAgo
  },
  data () {
    return {
      startTime: 0,
      watcher: undefined
    }
  },
  created () {
    this.startTime = Date.now()
    this.watcher = this.$store.watch(state => state.socketConnected,
      (newValue, oldValue) => {
        if (!newValue) this.startTime = Date.now()
      })
  },
  beforeDestroy () {
    this.watcher()
  },
  computed: {
    ...mapState({
      now: state => state.date,
      connected: state => state.socketConnected
    }),
    ...mapGetters([
      'connectionStart',
      'connectionEnd'
    ]),
    showMessage () {
      return true
    },
    lostTime () {
      const { connectionEnd, now } = this
      return (connectionEnd) ? now - connectionEnd : 0
    },
    waitingTime () {
      return (this.now - this.startTime) || 0
    },
    waitingPercentage () {
      const total = WAITING_TIME
      const { waitingTime } = this
      const time = (waitingTime <= WAITING_TIME) ? waitingTime : WAITING_TIME
      return Math.floor(100 * time / total)
    },
    isLost () {
      return (this.connectionEnd) ? this.lostTime > WAITING_TIME : 0
    },
    connectedTime () {
      const { connectionStart, now } = this
      return (connectionStart) ? (now - connectionStart) || 0 : 0
    },
    isWaiting () {
      return this.waitingTime < WAITING_TIME
    },
    connectionStatus () {
      const { isLost, isWaiting, connected, lostTime, waitingTime, connectedTime } = this
      if (connected) return [STATUS.CONNECTED, 'brand', connectedTime]
      if (isLost) return [STATUS.LOST, 'warn', lostTime]
      if (isWaiting) return [STATUS.WAITING, 'brand', waitingTime]
      return [STATUS.UNABLE, 'error', waitingTime]
    },
    status () {
      const [msg, css, time] = this.connectionStatus
      return { msg, css, time }
    },
    showTime () {
      return false
    }
  }
}
</script>
<style lang="stylus">

  .connection-status
    display flex
    flex-flow column nowrap
    color #fbfbfb
    font-size 0.75em
    align-self flex-start
    width 100%
    max-width 100%
    height auto
    margin-bottom 20px
</style>
