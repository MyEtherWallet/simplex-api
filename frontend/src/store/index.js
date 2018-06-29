import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import state from './state'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: state,
  actions: actions,
  mutations: mutations,
  getters: getters
})

export default store
