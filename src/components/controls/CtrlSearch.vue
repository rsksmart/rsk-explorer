<template lang="pug">
  .ctrl-search
    .input
      input.search-input(
        type="search"
        :value='value'
        @input.prevent="input"
        @change.prevent="changeInput"
        @keyup.stop='onKey'
        :placeholder="placeholder"
        :class="cssClass"
        )
      button.link(@click="clear" v-if="value")
        icon(name="close")
      button(v-if="isLoading" )
        loading-circle(:size="10")
      button.link(v-if="!isLoading" @click.stop="onChange")
        icon(name="search")
    .results(v-if="results.length" ref="results")
      template(v-for="result,i in results")
        .result(v-if='result.link && result.value'
          :class="{selected: selectedResult === i+1 }"
          :key="`${result.value}${i}`"
          :ref="`result-${i}`")
          a(
            :href="result.link"
            @touchend.passive="gotoResult($event,i)"
            @click="gotoResult($event,i)") {{result.name || result.value }}
</template>
<script>
import { clamp } from '../../lib/js/utils'
import LoadingCircle from '../LoadingCircle'
export default {
  name: 'ctrl-search',
  components: {
    LoadingCircle
  },
  props: ['placeholder', 'cssClass', 'results', 'searchValue', 'loading'],
  data () {
    return {
      value: '',
      selectedResult: 0,
      resultEmitted: null,
      focused: undefined
    }
  },
  created () {
    const { searchValue } = this
    if (searchValue) this.value = searchValue
  },
  methods: {
    clear () {
      this.value = ''
      this.selectResult(0)
    },
    input (event, type) {
      this.selectResult(0)
      const value = event.target.value
      this.value = value
      this.emit(event, type, value)
    },
    emit (event, type, value) {
      type = type || event.type
      this.$emit(type, { value, event })
    },
    changeInput (event) {
      const { fullPath } = this.$route
      const vm = this
      setTimeout(() => {
        if (!vm.selectedResult) {
          if (fullPath === vm.$route.fullPath) {
            vm.onChange(event)
          } else {
            this.value = ''
            vm.emitResult(event, null)
          }
        }
      }, 200)
    },
    onChange (event) {
      const value = this.value
      this.emit(event, 'change', value)
      this.clear()
    },
    selectResult (result) {
      this.selectedResult = result
    },
    gotoResult (event, key) {
      const result = this.results[key]
      const { link } = result
      if (link) this.$router.push(link)
      this.selectResult(key++)
      this.emitResult(event, result)
      this.clear()
    },
    emitResult (event, result) {
      this.emit(event, 'result', result)
    },
    onKey (event) {
      let { selectedResult, results } = this
      if (!results || results.length < 1) return
      const { code } = event
      // open result
      if (['Enter'].includes(code) && selectedResult) {
        this.gotoResult(event, (selectedResult - 1))
        return
      }
      // select results with arrows
      const codes = { ArrowUp: -1, ArrowDown: 1 }
      const direction = codes[code]
      if (undefined === direction) return
      selectedResult = selectedResult || 0
      selectedResult = selectedResult + (1 * direction)
      selectedResult = clamp(selectedResult, 0, results.length)
      this.selectResult(selectedResult)
    },
    onShowMore (event) {
      this.emit(event, 'showMore', this.value)
    }
  },
  computed: {
    totalResults () {
      const { results } = this
      return (results) ? results.length : 0
    },
    isLoading () {
      return !!this.loading
    }
  }
}
</script>
<style lang="stylus">
  @import '../../lib/styl/vars.styl'
  @import '../../lib/styl/mixins.styl'

  .ctrl-search
    position relative

    .loading-circle
      fill none
      stroke green

    .input
      display flex
      align-items center
      background none
      border-style solid
      width 100%

      ::placeholder
        transition $trans-fade
        opacity 1

      :focus::placeholder
        opacity 0.25

      button
        display flex
        margin 0 0.5em 0 0

      input.search-input
        border none
        background none
        text-align center
        padding 0
        box-shadow none
        font-size 0.75em
        margin 0 0.5em 0 0
        flex 1

    .results
      padding 0
      position absolute
      z-index 1100
      list-style none
      font-size 0.75em
      background $bg-even
      width 100%
      overflow-y auto
      max-height 70vh

    .result
      display flex
      flex-flow row wrap
      word-break break-all
      margin 0.5em 1em
      border-bottom $soft-border
</style>
