// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VueSVGIcon from 'vue-svgicon'
import store from './store'
import App from './App'
import router from './router'
import DataItem from './components/DataItem'
import VueHighlightJS from 'vue-highlight.js'
import json from 'highlight.js/lib/languages/json'
import { definer as solidity } from 'highlightjs-solidity/solidity'

Vue.use(VueSVGIcon, { tagName: 'icon' })
Vue.use(Vuex)
Vue.config.productionTip = false
Vue.component('data-item', DataItem)
Vue.use(VueHighlightJS, { languages: { solidity, json } })

/* eslint-disable no-new */
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
