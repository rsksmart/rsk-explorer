<template>
  <div class="search-container">
    <div class="search-content" :class="`${onFocusValue ? 'search-content-focus' : ''}`">
      <button v-if="!expandSearch" @click="setExpand" class="btn-search">
        <img src="@/assets/svg/search.svg" alt="">
      </button>
      <button v-else class="btn-close" @click="setExpand">X</button>
      <div class="content-input">
        <input
          class="search-input"
          type="text"
          v-model="value"
          ref="inputRef"
          @input.prevent="handleInput"
          @keyup.enter="debouncedChangeInput"
          @keyup.stop="debouncedOnKey"
          :placeholder="!onFocusValue ? placeholder : null"
          :class="cssClass"
          @focus="onFocus(true)"
          @blur="isSearchPage ? onFocus(false) : null"
        >
        <button class="btn-clear" @click="btnClear" v-if="value">
          x
        </button>
        <Spinner v-if="isLoading || typing" :width="20" :height="20" :border="2" />
      </div>
      <div class="search-results bg-secondary" v-if="value && onFocusValue && !isSearchPage && !typing && !isLoading">
        <template v-if="(currentType && searchedTypes.length > 0)">
          <div class="title-address capitalize">{{ currentType }}</div>
          <router-link :to="`${linkToSearch}`" class="search-address">{{ value }}</router-link>
        </template>
        <div v-else-if="results.length" ref="results">
          <div class="title-address capitalize">Result:</div>
          <template v-for="(result, i) in results">
            <div v-if="result.link && result.value"
              :class="{ selected: selectedResult === i+1 }"
              :key="`${result.value}${i}`"
              :ref="`result-${i}`">
              <a
                :href="result.link"
                @touchend.passive="gotoResult($event, i)"
                @click="gotoResult($event, i)"
                v-html="highlightedText(result.name || result.value)"
              >
              </a>
            </div>
          </template>
        </div>
        <div class="no-results bg-secondary" v-else-if="onFocusValue && value && !typing && !isLoading && !isSearchPage">
          <div class="title-address">No results found.</div>
        </div>
      </div>
    </div>
    <div class="search-background" v-if="onFocusValue && !isSearchPage" @click="onFocus(false)"></div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { clamp } from '../../lib/js/utils'
import Spinner from '../Loaders/Spinner.vue'
import { ROUTES } from '../../config/types'
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
      onFocusValue: false,
      debounceTime: 800,
      typing: false
    }
  },
  created () {
    const { searchValue } = this
    if (searchValue) this.value = searchValue
    this.debouncedOnKey = this.debounce(this.onKey, this.debounceTime)
    this.debouncedInput = this.debounce(this.input, this.debounceTime)
    this.debouncedChangeInput = this.debounce(this.changeInput, this.debounceTime)
  },
  methods: {
    ...mapActions([
      'searchExpand',
      'clearSearchedResults',
      'prepareSearch',
      'searchTypes',
      'fetchSearch'
    ]),
    highlightedText (text) {
      const formattedValue = this.formatValue(this.value)
      const regex = new RegExp(`(${formattedValue})`, 'gi')
      const highlightedText = text.replace(regex, (match) => `<span class="highlight">${match}</span>`)
      return highlightedText
    },
    formatValue (value) {
      return value.toString().replaceAll(',', '').trim()
    },
    btnClear () {
      this.clear()
      this.$refs.inputRef.focus()
    },
    handleInput (event) {
      this.debouncedInput(event)
      this.typing = true
    },
    onFocus (value) {
      setTimeout(() => {
        this.onFocusValue = value
      }, 100)
    },
    setExpand () {
      if (window.innerWidth > 600) return
      this.expandSearch = !this.expandSearch
      this.searchExpand({ value: this.expandSearch })
    },
    clear () {
      this.value = ''
      this.selectResult(0)
      this.clearSearchedResults()
    },
    input (event, type) {
      this.selectResult(0)
      const value = event.target.value
      this.value = value
      this.emit(event, type, value.trim())
      this.emit(event, 'change', value.trim())
    },
    emit (event, type, value) {
      type = type || event.type
      const newValue = this.formatValue(value)
      this.$emit(type, { value: newValue, event })
      let timer = 0
      if (value.includes('.rsk')) timer = 1500
      setTimeout(() => {
        this.typing = false
      }, timer)
    },
    changeInput (event) {
      const newValue = this.formatValue(this.value)
      if (!newValue) return
      this.onFocus(false)
      if (this.currentType && this.searchedTypes.length && !this.isLoading && !this.typing) {
        this.$router.push(this.linkToSearch, () => { })
      } else {
        const link = `/${ROUTES.search}/${newValue}`
        this.$router.push(link, () => { })
      }
    },
    onChange (event) {
      const value = this.formatValue(this.value)
      this.emit(event, 'change', value)
    },
    selectResult (result) {
      this.selectedResult = result
    },
    gotoResult (event, key) {
      this.onFocus(false)
      const result = this.results[key]
      const { link } = result
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
      const value = this.formatValue(this.value)
      this.emit(event, 'showMore', value)
    },
    debounce (func, wait, immediate) {
      let timeout
      return function () {
        const context = this
        const args = arguments
        const later = function () {
          timeout = null
          if (!immediate) func.apply(context, args)
        }
        const callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) func.apply(context, args)
      }
    }
  },
  computed: {
    ...mapGetters({
      searchedTypes: 'searchedTypes',
      currentType: 'searchedType',
      linkToSearch: 'linkToSearch'
    }),
    totalResults () {
      const { results } = this
      return (results) ? results.length : 0
    },
    isLoading () {
      return !!this.loading
    },
    isSearchPage () {
      return this.$route.name.toLowerCase() === ROUTES.search.toLowerCase()
    }
  },
  watch: {
    $route () {
      this.$refs.inputRef.blur()
      this.onFocus(false)
      if (this.$route.name.toLowerCase() !== ROUTES.search.toLowerCase()) {
        this.clearSearchedResults()
        this.value = ''
      } else if (this.$route.params?.value) this.value = this.$route.params?.value
    }
  }
}
</script>

<style>
.highlight {
  background-color: #ffef60;
  color: #000;
  border-radius: 4px;
  font-weight: bold;
}
</style>
