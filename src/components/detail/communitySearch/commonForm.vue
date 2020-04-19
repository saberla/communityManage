<template>
  <div class="commonSearch">
    <div class="searchForm" style="overflow: auto">
      <el-form :inline="true" :model="formData" ref="searchForm">
        <el-form-item :label="mainPage=== 'first' ? '门牌号' : (mainPage === 'second' ? '姓名' : '车牌号')" prop="userName" class="firSearch">
          <el-input v-model="formData.userName"></el-input>
        </el-form-item
        ><el-form-item :label="mainPage=== 'first' ? '户主' : (mainPage === 'second' ? '性别' : '车身颜色')" prop="name" class="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item
        ><el-form-item label="建档日期：" prop="role" class="role">
          <el-date-picker
            v-model="formData.role"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button size="mini" @click.native="resetForm('searchForm')">重置</el-button>
        <el-button type="primary" size="mini" @click="getUsers()">查询</el-button>
      </div>
    </div>
    <el-button type="primary" size="small" style="margin-left:24px">数据导出</el-button>
    <!-- 表格 -->
    <div class="table_pzp">
      <div class="user_tableContent">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="tableData"
          :header-cell-style="{'background-color':'rgba(232, 232, 232, 1)','color':'rgba(90, 90, 90, 1)'}"
          style="width: 100%;border-bottom:1px solid rgba(217,217,217,1)">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="houseNum" label="门牌号" width="196"></el-table-column>
          <el-table-column prop="houseSize" label="房屋面积" width="231"></el-table-column>
          <el-table-column prop="houseHolder" label="户主" width="231"></el-table-column>
          <el-table-column prop="date" label="建档日期"></el-table-column>
        </el-table>
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
      state: false,
      formData: {
        userName: '',
        name: '',
        role: ''
      },
      tableData: [
        {
          houseNum: 'A101',
          houseSize: '100平方米',
          houseHolder: '蒲智鹏',
          date: '2020-4-2'
        },
        {
          houseNum: 'A103',
          houseSize: '200平方米',
          houseHolder: '蒲智鹏',
          date: '2020-4-2'
        },
        {
          houseNum: 'A104',
          houseSize: '300平方米',
          houseHolder: '蒲智鹏',
          date: '2020-4-2'
        }
      ],
      //分页
      paginationObj: {
        total: 3,
        currentPage: 1,
        pageSize: 3,
        handleCurrentChange: (val) => {
          this.paginationObj.currentPage = val
          // this.getHouses()
        }
      }
    }
  },
  components: {
    pagination
  },
  props: {
    mainPage: String
  }
}

</script>
<style lang='scss' scoped>
.searchForm{
  border-radius:4px;
  height: 106px;
  background:rgba(245,245,245,1);
  margin: 0 24px 12px 24px;
  .btns{
    text-align: center;
  }
}
</style>

<style lang="scss">
.searchForm {
  .el-form-item {
    margin-left: 28px;
    margin-top: 12px;
    margin-bottom: 12px;
  }
  .el-input__inner {
    width: 310px;
    height: 32px;
  }
  .role .el-input__inner {
    width: 170px;
  }
  .firSearch .el-input__inner{
    width: 210px;
  }
}
</style>