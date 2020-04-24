<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import jwtDecode from 'jwt-decode'
export default {
  name: 'app',
  created() {
    if (localStorage.getItem('loginToken')) {
      const decode = jwtDecode(localStorage.getItem('loginToken'))
      this.$store.dispatch('setUser', decode)
    }
    // 初始获取字典数据并存到vuex
    this.getDic()
    // 获取当前登录用户信息存到vuex
    this.getLoginUser()
  },
  computed: {
    userData() {
      if (this.$store.getters.userInfo) {
          return this.$store.getters.userInfo
      } else {
          return {}
      }
    }
  },
  methods: {
    // 获取字典数据
    getDic () {
      this.$axios
        .post('/dictionary/getDic',{})
        .then(res => {
          if (res.data.code === 200) {
            this.$store.dispatch('setNations', res.data.dic[0].insideData)
            this.$store.dispatch('setEdus', res.data.dic[1].insideData)
            this.$store.dispatch('setGird', res.data.dic[2].insideData)
            this.$store.dispatch('setType', res.data.dic[3].insideData)
            this.$store.dispatch('setInfo', res.data.dic[4].insideData)
          }
        })
    },
    // 获取当前登录用户
    getLoginUser () {
      let params = {
          userName: this.userData.userName
      }
      this.$axios
        .post('/user/getLoginUser', params)
        .then(res => {
            if(res.data.code === 200) {
              this.$store.dispatch('setLoginUser', res.data.user[0])
            }
        })
      }
  },
}
</script>

<style lang="scss">
html,body{
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}
#app{
  width: 100%;
  height: 100%;
}
</style>
