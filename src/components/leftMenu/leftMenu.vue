<template>
  <div class="leftMenu">
    <el-menu
      router
      :default-active="defaultActive"
      class="el-menu-vertical-demo"
      unique-opened>
      <el-submenu index="1">
        <template slot="title"><span>信息门户</span></template>
        <el-menu-item-group>
          <el-menu-item index="/system/mechanism">网格门户</el-menu-item>
          <el-menu-item index="/system/mechanism">查询门户</el-menu-item>
          <el-menu-item index="/system/mechanism">领导大屏</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2" v-if="gridState">
        <template slot="title"><span>小区治理</span></template>
        <el-menu-item-group>
          <el-menu-item index="/community/communityManage">小区建档</el-menu-item>
          <el-menu-item index="/community/infoSearch">信息查询</el-menu-item>
          <el-menu-item index="/community/infoSearch">信息统计</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="3" v-if="gridState">
        <template slot="title"><span>综治管理</span></template>
        <el-menu-item-group>
          <el-menu-item index="/comprehensive/girdManage">网格管理</el-menu-item>
          <el-menu-item index="/system/mechanism">任务管理</el-menu-item>
          <el-menu-item index="/system/mechanism">人员考核</el-menu-item>
          <el-menu-item index="/system/mechanism">信息报送</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="4" v-if="manageState">
        <template slot="title"><span>系统管理</span></template>
        <el-menu-item-group>
          <el-menu-item index="/system/userManage">用户管理</el-menu-item>
          <el-menu-item index="/system/mechanism">机构管理</el-menu-item>
          <el-menu-item index="/system/dictionary">字典维护</el-menu-item>
          <el-menu-item index="/system/dictionary">数据管理</el-menu-item>
          <el-menu-item index="/system/logAudit">日志审计</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      defaultActive: '', // 当前激活的路由
      gridState: true,
      manageState: true
    }
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
  created() {
    this.getRouter()
    // this.getLoginUser()
    
  },
  methods: {
    getRouter () {
      this.defaultActive = this.$route.path
    },
    //获取登录用户信息
    // getLoginUser () {
    //   console.log(this.userData)
    //   let params = {
    //       userName: this.userData.userName
    //   }
    //   this.$axios
    //     .post('/user/getLoginUser', params)
    //     .then(res => {
    //         if(res.data.code === 200) {
    //           // 根据权限显示不同的页面
    //           // if (res.data.user[0].role === 'administrator') {
    //           //   this.manageState = true
    //           // } else if (res.data.user[0].role === '网格员用户') {
    //           //   this.gridState = true
    //           // } else {
    //           //   this.manageState = false
    //           //   this.gridState = false
    //           // }
    //         }
    //     })
    // }
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