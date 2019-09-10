import Vue from 'vue'
import highlightjs from 'highlight.js/lib/highlight'
import json from 'highlight.js/lib/languages/javascript'
// see: https://github.com/highlightjs/highlightjs-solidity/issues/9
// import { definer as solidity } from 'highlightjs-solidity'
import solidity from 'highlight.js/lib/languages/cs'
highlightjs.registerLanguage('json', json)
highlightjs.registerLanguage('solidity', solidity)

export const hljs = Vue.directive('hljs', {
  deep: true,
  bind: function (el, binding) {
    let targets = el.querySelectorAll('code')
    targets.forEach((target) => {
      if (binding.value) {
        target.textContent = binding.value
      }
      highlightjs.highlightBlock(target)
    })
  },
  componentUpdated: function (el, binding) {
    let targets = el.querySelectorAll('code')
    targets.forEach((target) => {
      if (binding.value) {
        target.textContent = binding.value
        highlightjs.highlightBlock(target)
      }
    })
  }
})

export default hljs
