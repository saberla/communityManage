<template>
  <div class="logAudit">
    <el-tabs v-model="activeName">
      <el-tab-pane label="登录日志" name="first">
        <logAuditDetail></logAuditDetail>
      </el-tab-pane>
      <el-tab-pane label="系统日志" name="second">
        <sysLogAudit></sysLogAudit>
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="third">
        <opLogAudit></opLogAudit>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import logAuditDetail from '@/components/detail/logDetail/logAuditDetail'
import opLogAudit from '@/components/detail/logDetail/opLogAudit'
import sysLogAudit from '@/components/detail/logDetail/sysLogAudit'
export default {
  data() {
    return {
      activeName: 'first'
    }
  },
  components: {
    logAuditDetail,
    opLogAudit,
    sysLogAudit
  }
}

</script>
<style lang='scss' scoped>
.logAudit{
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow: auto;
}
</style>

<style lang="scss">
.logAudit{
// 标签页间距 24px;
  .el-tabs__nav{
    margin: 0 24px;
    height: 48px;
  }
  .el-tabs__item{
    padding-right: 48px;
    padding-left: 0;
    font-size: 16px;
    line-height: 48px;
    font-weight: 400;
  }
}
</style>