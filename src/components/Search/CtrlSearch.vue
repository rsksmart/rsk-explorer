<template>
  <div class="search-content">
    <button v-if="!expandSearch" @click="setExpand" class="btn-search">
      <img src="@/assets/svg/search.svg" alt="">
    </button>
    <button v-else class="btn-close" @click="setExpand">X</button>
    <div class="content-input">
      <input
        class="search-input bg-primary"
        type="text"
        :value="value"
        @input.prevent="input"
        @change.prevent="changeInput"
        @keyup.stop="onKey"
        :placeholder="onFocusValue ? placeholder : null"
        :class="cssClass"
        @focus="onFocusValue = false"
        @blur="onFocusValue = true"
      >
      <button class="btn-clear" @click="clear" v-if="value">
        x
      </button>
      <Spinner v-if="isLoading" :width="20" :height="20" :border="2" />
    </div>
    <div class="search-results bg-secondary" v-if="results.length" ref="results">
      <template v-for="(result, i) in results">
        <div v-if="result.link && result.value"
          :class="{ selected: selectedResult === i+1 }"
          :key="`${result.value}${i}`"
          :ref="`result-${i}`">
          <a
            :href="result.link"
            @touchend.passive="gotoResult($event, i)"
            @click="gotoResult($event, i)">
            {{ result.name || result.value }}
          </a>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { clamp } from '../../lib/js/utils'
import Spinner from '../Loaders/Spinner.vue'
export default {
  name: 'ctrl-search',
  components: {
    Spinner
  },
  props: ['placeholder', 'cssClass', 'results', 'searchValue', 'loading'],
  data () {
    return {
      value: '',
      selectedResult: 0,
      resultEmitted: null,
      focused: undefined,
      expandSearch: false,
      onFocusValue: true
    }
  },
  created () {
    const { searchValue } = this
    if (searchValue) this.value = searchValue
  },
  methods: {
    ...mapActions(['searchExpand']),
    setExpand () {
      if (window.innerWidth > 600) return
      this.expandSearch = !this.expandSearch
      this.searchExpand({ value: this.expandSearch })
    },
    clear () {
      this.value = ''
      this.selectResult(0)
    },
    input (event, type) {
      this.selectResult(0)
      const value = event.target.value
      this.value = value
      const typeEvent = this.value.length > 10 ? 'change' : type
      this.emit(event, typeEvent, value)
    },
    emit (event, type, value) {
      type = type || event.type
      this.$emit(type, { value, event })
    },
    changeInput (event) {
      console.log('event: ', event)
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
