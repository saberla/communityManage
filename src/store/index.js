import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {},
    loginUser: {}
  },
  getters: {
    userInfo: state => state.userInfo,
    getLoginUser: state => state.loginUser
  },
  mutations: {
    SETUSER: (state, user) => { state.userInfo = user },
    setLogin (state, obj) {
      return state.loginUser = obj
    }
  },
  actions: {
    setUser: ({commit}, user) => {
      commit('SETUSER', user)
    },
    clearData: ({ commit }) => {
      commit('SETUSER', null)
    },
    setLoginUser({commit}, obj) {
      commit('setLogin', obj)
    }
  }
})
