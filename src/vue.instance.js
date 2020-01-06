// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VueSVGIcon from 'vue-svgicon'
import store from './store'
import App from './App'
import router from './router'
import DataItem from './components/DataItem'

Vue.use(VueSVGIcon, { tagName: 'icon' })
Vue.use(Vuex)
Vue.config.productionTip = false
Vue.component('data-item', DataItem)

export const config = {
  store,
  router,
  render: h => h(App)
}

export const VueI = Vue
