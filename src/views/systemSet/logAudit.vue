<template>
  <div class="logAudit">
    <el-tabs v-model="activeName">
      <el-tab-pane label="登录日志" name="first">
        <div class="loginContainer">
          <!-- 表格 -->
          <div class="table_pzp">
            <div class="user_tableContent">
              <el-table
                v-loading="loading"
                ref="multipleTable"
                :data="tableData"
                :header-cell-style="{'background-color':'rgba(232, 232, 232, 1)','color':'rgba(90, 90, 90, 1)'}"
                style="width: 100%;border-bottom:1px solid rgba(217,217,217,1)">
                <el-table-column prop="userName" label="账号" width="96"></el-table-column>
                <el-table-column prop="name" label="姓名" width="131"></el-table-column>
                <el-table-column prop="tel" label="联系方式" width="131"></el-table-column>
                <el-table-column prop="role" label="角色"  width="131"></el-table-column>
                <el-table-column prop="education" label="学历"  width="131"></el-table-column>
                <el-table-column prop="nation" label="民族"  width="131"></el-table-column>
                <el-table-column prop="nowDate" label="登录时间"></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <pagination :paginationObj='paginationObj'></pagination>
      </el-tab-pane>
      <el-tab-pane label="系统日志" name="second">
        <h1>系统日志</h1>
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="third">
        <h1>操作日志</h1>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import pagination from '../../components/pagination/pagination'
export default {
  data() {
    return {
      activeName: 'first',
      loading: false,
      tableData: [],
      //分页
      paginationObj: {
        total: 0,
        currentPage: 1,
        pageSize: 6,
        handleCurrentChange: val => {
          this.paginationObj.currentPage = val,
          this.getLogRecords()
        }
      }
    }
  },
  components: {
    pagination
  },
  created() {
    this.getLogRecords()
  },
  methods: {
    // 获取登录日志
    getLogRecords () {
      let params = {
        currentPage: this.paginationObj.currentPage,
        pageSize: this.paginationObj.pageSize
      }
      this.$axios
        .post('/records/getRecords', params)
        .then(res => {
          if(res.data.code === 200) {
            this.tableData = res.data.user
            this.paginationObj.total = res.data.totalCount
          }
        })
    }
  },
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
</style>