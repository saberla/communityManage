import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {}, // user登录的token
    loginUser: {}, // 当前登录用户的信息
    nation: [], // 民族字典
    education: [] // 学历字典
  },
  getters: {
    userInfo: state => state.userInfo,
    getLoginUser: state => state.loginUser,
    getEdu: state => state.education,
    getNation(state) {
      return state.nation
    }
  },
  mutations: {
    SETUSER: (state, user) => { state.userInfo = user },
    setNation: (state, nation) => {state.nation = nation},
    setEdu: (state, edu) => {state.education = edu},
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
    },
    setNations: ({commit}, nation) => {
      commit('setNation', nation)
    },
    setEdus: ({commit}, edu) => {
      commit('setEdu', edu)
    }
  }
})
