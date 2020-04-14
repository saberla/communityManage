<template>
<!-- 操作日志 -->
<div class="opLog">
  <div class="opLogContainer">
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
          <el-table-column prop="operate" label="操作"  width="199"></el-table-column>
          <el-table-column prop="date" label="操作时间"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
  <pagination :paginationObj='paginationObj'></pagination>
</div>
</template>

<script>
import pagination from '../../pagination/pagination'
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      //分页
      paginationObj: {
        total: 0,
        currentPage: 1,
        pageSize: 6,
        handleCurrentChange: val => {
          this.paginationObj.currentPage = val
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
    // 获取操作日志
    getLogRecords () {
      this.loading = true
      let params = {
        currentPage: this.paginationObj.currentPage,
        pageSize: this.paginationObj.pageSize
      }
      this.$axios
        .post('/opRecords/getRecords', params)
        .then(res => {
          if(res.data.code === 200) {
            this.loading = false
            res.data.records.forEach((el,index) => {
              let newDate = new Date(el.date)
              el.date = newDate.getFullYear() + '.' + (newDate.getMonth() + 1) + '.' + newDate.getDate() + '  ' + newDate.getHours() + ':' + newDate.getMinutes()
            })
            this.tableData = res.data.records
            this.paginationObj.total = res.data.totalCount
          }
        })
    }
  },
}

</script>
<style lang='scss' scoped>
</style>