<template>
  <div class="gridCommunity">
    <div class="gridCommunity_header">
      <div class="searchForm" style="overflow: auto">
        <el-form :inline="true" :model="formData" ref="searchForm">
          <el-form-item label="小区名" prop="communityName" class="firSearch">
            <el-input v-model="formData.communityName"></el-input>
          </el-form-item
          ><el-form-item label="开发商" prop="developCompany" class="developCompany">
            <el-input v-model="formData.developCompany"></el-input>
          </el-form-item
          ><el-form-item label="物业团队：" prop="property" class="property">
            <el-input v-model="formData.property"></el-input>
          </el-form-item>
        </el-form>
        <div class="btns">
          <el-button size="mini" @click.native="resetForm('searchForm')">重置</el-button>
          <el-button type="primary" size="mini" @click="getCommunities()">查询</el-button>
        </div>
      </div>
    </div>
    <div class="gridCommunity_content">
      <el-button type="primary" size="small" style="margin-left:24px" @click="exportMeth">数据导出</el-button>
      <el-button type="primary" size="small" v-if="returnState" @click="returnMain">返回</el-button>
      <!-- 表格 -->
      <div class="table_pzp">
        <div class="user_tableContent">
          <el-table
            max-height="325"
            v-loading="loading"
            :row-key="getRowKeys"
            @selection-change="handleSelectionChange"
            ref="multipleTable"
            :data="tableData"
            :header-cell-style="{'background-color':'rgba(232, 232, 232, 1)','color':'rgba(90, 90, 90, 1)'}"
            style="width: 100%;border-bottom:1px solid rgba(217,217,217,1)">
            <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
            <el-table-column prop="communityName" label="小区名" width="212"></el-table-column>
            <el-table-column prop="communityAdd" show-overflow-tooltip label="小区地址" width="272"></el-table-column>
            <el-table-column prop="developCompany" label="开发商" width="212"></el-table-column>
            <el-table-column prop="property" label="物业团队"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 导出的表格 -->
    <el-table
      v-show="false"
      id='communitytable'
      ref="multipleTable"
      :data="tableData1"
      :header-cell-style="{'background-color':'rgba(232, 232, 232, 1)','color':'rgba(90, 90, 90, 1)'}"
      style="width: 100%;border-bottom:1px solid rgba(217,217,217,1)">
      <el-table-column prop="gridNum" label="网格编号" width="177"></el-table-column>
      <el-table-column prop="gridRange" label="网格区域" width="177"></el-table-column>
      <el-table-column prop="communityName" label="小区名" width="177"></el-table-column>
      <el-table-column prop="communityAdd" label="小区地址" width="177"></el-table-column>
      <el-table-column prop="developCompany" label="开发商" width="177"></el-table-column>
      <el-table-column prop="property" label="物业团队" width="199"></el-table-column>
      <el-table-column prop="date" label="建档日期"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      returnState: false,
      loading: false,
      tableData: [],
      tableData1: [],
      formData: {
        communityName: '',
        developCompany: '',
        property: ''
      }
    }
  },
  created() {
    if (this.$route.path === '/information/girdPort') {
      this.returnState = true
    }
    this.getCommunities()
  },
  computed: {
    loginUser() {
      return this.$store.getters.getLoginUser
    }
  },
  methods: {
    returnMain() {
      this.$router.push('/information/searchPort')
      setTimeout(() => {
        this.$router.push('/information/girdPort')
      }, 50);
    },
    getRowKeys(row) {
      return row._id
    },
    // 导出选中的表格
    exportMeth() {
      if (this.tableData1.length !== 0) {
        let wb = XLSX.utils.table_to_book(document.querySelector('#communitytable'));   // 这里就是表格
        let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
        try {
          FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '小区建档信息.xlsx');  //table是自己导出文件时的命名，随意
        } catch (e) {
          console.log(e, wbout)
        }
        this.loginUser.operate = '信息门户-小区数据导出'
        this.writeOpLog(this.loginUser)
        return wbout
      } else {
        Message.error('请选择需要导出的数据')
      }
    },
    handleSelectionChange(val) {
      this.tableData1 = val
    },
    // 表单重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.getCommunities()
    },
    // 查询并获取小区信息
    getCommunities () {
      for (let i in this.loginUser.insideData) {
        if (this.loginUser.insideData[i].gridNum) {
          var gridNum1 = this.loginUser.insideData[i].gridNum
          var gridRange1 = this.loginUser.insideData[i].gridRange
          break
        }
      }
      let query1 = {}
      query1.gridNum = gridNum1
      query1.gridRange = gridRange1
      if (this.formData.communityName === '' && this.formData.developCompany === '' && this.formData.property === '') {
        query1.gridNum = gridNum1
        query1.gridRange = gridRange1
      }
      if (this.formData.communityName !== '') {query1.communityName = this.formData.communityName}
      if (this.formData.property !== '') {query1.property = this.formData.property}
      if (this.formData.developCompany !== '') {query1.developCompany = this.formData.developCompany}
      let params = {
        query: query1
      }
      this.loading = true
      this.$axios
        .post('/community/getSearchComs', params)
        .then(res => {
          if (res.data.code === 200) {
            this.tableData = res.data.coms
            this.loading = false
          }
        })
        .catch(res => {
          this.loginUser.wrongPlace = '查询门户-小区查询'
          this.loginUser.wrongInfo = String(err)
          this.writeSysLog(this.loginUser)
          console.log('发生错误', err)
        })
    }
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
.gridCommunity{
  .searchForm {
    .el-input__inner {
      width: 199px;
      height: 32px;
    }
  }
}
</style>