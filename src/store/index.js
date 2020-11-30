import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import * as mutations from './mutations'
import state from './state'
import backend from './modules/backend/'
import entities from './modules/entities/'
import config from './modules/config/'
import routes from './modules/routes/'
import search from './modules/search/'
import socket from '../socket.js'
import socketPlugin from './plugins/socketPlugin'
import storagePlugin from './plugins/localStorage'
import { sync } from 'vuex-router-sync'
import router from '../router'
const wsPlugin = socketPlugin(socket)
Vue.use(Vuex)
backend.namespaced = false
entities.namespaced = false

export const store = new Vuex.Store({
  strict: false, // <-- set true to debug mutations, Do not enable strict mode when deploying for production!
  state: state(),
  getters,
  actions,
  mutations,
  plugins: [
    wsPlugin,
    storagePlugin
  ],
  modules: {
    backend,
    entities,
    config,
    routes,
    search
  }
})

export const unsync = sync(store, router)
export default store
