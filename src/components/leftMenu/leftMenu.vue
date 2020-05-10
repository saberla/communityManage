<template>
  <div class="leftMenu">
    <el-menu
      v-if="!manageState"
      router
      :default-active="defaultActive"
      class="el-menu-vertical-demo"
      unique-opened>
      <el-submenu index="1" v-if="!manageState">
        <template slot="title"><span>信息门户</span></template>
        <el-menu-item-group>
          <el-menu-item index="/information/girdPort" v-if="gridState">网格门户</el-menu-item>
          <el-menu-item index="/information/leaderPort" v-if="leaderState">领导大屏</el-menu-item>
          <el-menu-item index="/information/searchPort" v-if="searchState">查询门户</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2" v-if="gridState">
        <template slot="title"><span>小区治理</span></template>
        <el-menu-item-group>
          <el-menu-item index="/community/communityManage">小区建档</el-menu-item>
          <el-menu-item index="/community/infoSearch">信息查询</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="3" v-if="gridState">
        <template slot="title"><span>综治管理</span></template>
        <el-menu-item-group>
          <el-menu-item index="/comprehensive/girdManage" v-if="gridDetailState">网格管理</el-menu-item>
          <el-menu-item index="/comprehensive/taskManage">任务管理</el-menu-item>
          <el-menu-item index="/comprehensive/personAssessment">人员考核</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>

    <!-- 系统设置 -->
    <el-menu
      v-if="manageState"
      :default-openeds="['4']"
      router
      :default-active="defaultActive"
      class="el-menu-vertical-demo"
      unique-opened>
      <el-submenu index="4">
        <template slot="title"><span>系统管理</span></template>
        <el-menu-item-group>
          <el-menu-item index="/system/userManage">用户管理</el-menu-item>
          <el-menu-item index="/system/dictionary">字典维护</el-menu-item>
          <el-menu-item index="/system/dataManage">数据管理</el-menu-item>
          <el-menu-item index="/system/logAudit">日志审计</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
    <!-- <el-menu-item index="/system/mechanism">机构管理</el-menu-item> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      // defaultActive: '', // 当前激活的路由
      gridState: false,
      manageState: false,
      leaderState: false,
      searchState: false,
      gridDetailState: false
    }
  },
  computed: {
    userData() {
      if (this.$store.getters.userInfo) {
          return this.$store.getters.userInfo
      } else {
          return {}
      }
    },
    defaultActive() {
      return this.$route.path
    }
  },
  created() {
    // this.getRouter()
    this.getLoginUser()
  },
  methods: {
    // getRouter () {
    //   this.defaultActive = this.$route.path
    // },
    //获取登录用户信息
    getLoginUser () {
      let params = {
          userName: this.userData.userName
      }
      this.$axios
        .post('/user/getLoginUser', params)
        .then(res => {
            if(res.data.code === 200) {
              // 根据权限显示不同的页面
              if (res.data.user[0].role === 'administrator') {
                this.manageState = true
                this.$router.push('/system/userManage')
              } else if (res.data.user[0].role === '网格员用户') {
                this.gridState = true
              } else if (res.data.user[0].role === 'gridManager') {
                this.gridState = true
                this.gridDetailState = true
              } else if (res.data.user[0].role === '查询用户') {
                this.searchState = true
                this.$router.push('/information/searchPort')
              } else {
                this.searchState = true
                this.leaderState = true
                this.$router.push('/information/leaderPort')
              }
            }
        })
    }
  },
}
</script>

<style lang='scss'>
.left-menu {
  .el-menu {
    background-color: #384EA0;
    border-right: none;
  }
  .el-submenu .el-menu-item {
    min-width: 0;
  }
  .el-submenu__title, .el-submenu__title i, .el-menu-item{
    color: #ffffff
  }
  .el-submenu__title:hover{
    background-color: rgb(48, 66, 136);
  }
  .el-menu-item.is-active {
    background-color: rgb(48, 66, 136) !important;
  }
  .el-menu-item:hover {
    background-color: rgb(48, 66, 136);
  }
  .el-menu-item-group__title{
    height: 0;
    padding: 0;
  }
}
</style>