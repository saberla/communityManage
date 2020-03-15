import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {}
  },
  getters: {
    userInfo: state => state.userInfo
  },
  mutations: {
    SETUSER: (state, user) => { state.userInfo = user }
  },
  actions: {
    setUser: ({commit}, user) => {
      commit('SETUSER', user)
    },
    clearData: ({ commit }) => {
      commit('SETUSER', null)
    }
  }
})
