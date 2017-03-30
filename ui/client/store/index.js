import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import services from '../services'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user: user(services)
  }
})

export default store
