import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import * as mutations from './mutations'
import state from './state'
import backend from './modules/backend/'
import mining from './modules/mining/'
import entities from './modules/entities/'
import config from './modules/config/'
import routes from './modules/routes/'
import search from './modules/search/'
import socket, { miningSocket } from '../socket.js'
import socketPlugin from './plugins/socketPlugin'
import miningSocketPlugin from './plugins/miningSocketPlugin'
import storagePlugin from './plugins/localStorage'
import { sync } from 'vuex-router-sync'
import router from '../router'
const wsPlugin = socketPlugin(socket)
const wsPluginM = miningSocketPlugin(miningSocket)
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
    wsPluginM,
    storagePlugin
  ],
  modules: {
    backend,
    entities,
    config,
    routes,
    search,
    mining
  }
})

export const unsync = sync(store, router)
export default store
