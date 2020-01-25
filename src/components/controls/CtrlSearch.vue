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
      button.link(@click="onChange")
        icon(name="search")
    ul.results(v-if="results")
      template(v-for="result,i in results")
        li.result(v-if='result.link && result.value' :class="{selected: selectedResult === i+1 }" :key="result.value")
          a.button(:href="result.link" @touchend.passive="gotoResult($event,i)" @click.native="gotoResult($event,i)") {{result.name || result.value }}
</template>
<script>
import { clamp } from '../../lib/js/utils'
export default {
  name: 'ctrl-search',
  props: ['placeholder', 'cssClass', 'results', 'searchValue'],
  data () {
    return {
      value: '',
      selectedResult: 0,
      resultEmitted: null,
      focused: undefined
    }
  },
  created () {
    let { searchValue } = this
    if (searchValue) this.value = searchValue
  },
  methods: {
    clear () {
      this.value = ''
      this.selectResult(0)
    },
    input (event, type) {
      this.selectResult(0)
      let value = event.target.value
      this.value = value
      this.emit(event, type, value)
    },
    emit (event, type, value) {
      type = type || event.type
      this.$emit(type, { value, event })
    },
    changeInput (event) {
      let vm = this
      setTimeout(() => {
        if (!vm.selectedResult) {
          vm.onChange(event)
        }
      }, 200)
    },
    onChange (event) {
      let value = event.target.value
      this.emit(event, 'change', value)
      this.clear()
    },
    selectResult (result) {
      this.selectedResult = result
    },
    gotoResult (event, key) {
      let result = this.results[key]
      let { link } = result
      if (link) this.$router.push(link)
      this.selectResult(key++)
      this.emitResult(event, result)
    },
    emitResult (event, result) {
      this.emit(event, 'result', result)
    },
    onKey (event) {
      let { selectedResult, results } = this
      if (!results || results.length < 1) return
      let { code } = event

      // open result
      if (['Enter'].includes(code) && selectedResult) {
        this.gotoResult(event, (selectedResult - 1))
        return
      }
      // select results with arrows
      let codes = { ArrowUp: -1, ArrowDown: 1 }
      let direction = codes[code]
      if (undefined === direction) return
      selectedResult = selectedResult || 0
      selectedResult = selectedResult + (1 * direction)
      selectedResult = clamp(selectedResult, 0, results.length)
      this.selectResult(selectedResult)
    }
  },
  computed: {
    totalResults () {
      let { results } = this
      return (results) ? results.length : 0
    }
  }
}
</script>
<style lang="stylus">
  @import '../../lib/styl/vars.styl'
  @import '../../lib/styl/mixins.styl'

  .ctrl-search
    position relative

    .input
      display flex
      align-items center
      background none
      border-style solid
      width 100%

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
    z-index 1000
    list-style none
    font-size 0.75em
    background $bg-even
    width 100%

    .result
      display flex
      flex-flow row wrap
      word-break break-all
      margin 0.5em 1em
      border-bottom $soft-border
</style>
