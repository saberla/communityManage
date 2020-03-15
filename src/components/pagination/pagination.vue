<template>
  <div class="pagination">
    <el-pagination
      @current-change="paginationObj.handleCurrentChange"
      :current-page.sync="paginationObj.currentPage"
      :page-size="paginationObj.pageSize"
      layout="total, prev, pager, next"
      :total="paginationObj.total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    paginationObj: Object
  }
}

</script>
<style lang='scss' scoped>
.pagination {
  padding: 12px 24px 24px 24px;
  display: flex;
  justify-content: flex-end;
}
</style>