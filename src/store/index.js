import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import * as mutations from './mutations'
import state from './state'
import backend from './modules/backend/'
import socket from '../socket.js'
import socketPlugin from './plugins/socketPlugin.js'
const wsPlugin = socketPlugin(socket)
Vue.use(Vuex)
backend.namespaced = false

const store = new Vuex.Store({
  strict: false, // <-- set true to debug mutations, Do not enable strict mode when deploying for production!
  state: state(),
  getters,
  actions,
  mutations,
  plugins: [wsPlugin],
  modules: {
    backend
  }
})

export default store
