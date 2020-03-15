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
