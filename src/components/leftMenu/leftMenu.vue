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
          <el-menu-item index="1-1">网格门户</el-menu-item>
          <el-menu-item index="1-2">查询门户</el-menu-item>
          <el-menu-item index="1-3">领导大屏</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title"><span>小区治理</span></template>
        <el-menu-item-group>
          <el-menu-item index="1-1">小区建档</el-menu-item>
          <el-menu-item index="1-2">人员建档</el-menu-item>
          <el-menu-item index="1-3">房屋建档</el-menu-item>
          <el-menu-item index="1-4">信息查询</el-menu-item>
          <el-menu-item index="1-5">信息统计</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title"><span>综治管理</span></template>
        <el-menu-item-group>
          <el-menu-item index="1-1">网格管理</el-menu-item>
          <el-menu-item index="1-2">任务管理</el-menu-item>
          <el-menu-item index="1-3">人员考核</el-menu-item>
          <el-menu-item index="1-4">信息报送</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title"><span>系统管理</span></template>
        <el-menu-item-group>
          <el-menu-item index="/system/userManage">用户管理</el-menu-item>
          <el-menu-item index="1-2">机构管理</el-menu-item>
          <el-menu-item index="1-3">字典维护</el-menu-item>
          <el-menu-item index="1-4">权限管理</el-menu-item>
          <el-menu-item index="1-5">数据管理</el-menu-item>
          <el-menu-item index="1-6">密码管理</el-menu-item>
          <el-menu-item index="1-7">日志审计</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      defaultActive: '' // 当前激活的路由
    }
  },
  created() {
    this.getRouter()
  },
  methods: {
    getRouter () {
      this.defaultActive = this.$route.path
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