<template>
  <div class="carInfo">
    <div class="carInfo_header">
      <div class="searchForm" style="overflow: auto">
        <el-form :inline="true" :model="formData" ref="searchForm">
          <el-form-item label="车牌号" prop="carNum" class="firSearch">
            <el-input v-model="formData.carNum"></el-input>
          </el-form-item
          ><el-form-item label="车主" prop="carHolder" class="secSearch">
            <el-input v-model="formData.carHolder"></el-input>
          </el-form-item
          ><el-form-item label="所属小区" prop="communityName" class="communityName">
            <el-input v-model="formData.communityName"></el-input>
          </el-form-item
          ><el-form-item label="建档日期：" prop="date" class="date">
            <el-date-picker
              v-model="formData.date"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div class="btns">
          <el-button size="mini" @click.native="resetForm('searchForm')">重置</el-button>
          <el-button type="primary" size="mini" @click="getCars()">查询</el-button>
        </div>
      </div>
    </div>
    <div class="carInfo_content">
      <el-button type="primary" size="small" style="margin-left:24px" @click="exportMeth">数据导出</el-button>
      <el-button type="primary" size="small" v-if="returnState" @click="returnMain">返回</el-button>
      <!-- 表格 -->
      <div class="table_pzp">
        <div class="user_tableContent">
          <el-table
            max-height="325"
            :row-key="getRowKeys"
            @selection-change="handleSelectionChange"
            v-loading="loading"
            ref="multipleTable"
            :data="tableData"
            :header-cell-style="{'background-color':'rgba(232, 232, 232, 1)','color':'rgba(90, 90, 90, 1)'}"
            style="width: 100%;border-bottom:1px solid rgba(217,217,217,1)">
            <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
            <el-table-column prop="carNum" label="车牌号" width="177"></el-table-column>
            <el-table-column prop="carHolder" label="车主" width="177"></el-table-column>
            <el-table-column prop="carColor" label="车身颜色" width="177"></el-table-column>
            <el-table-column prop="communityName" label="所属小区" width="199"></el-table-column>
            <el-table-column prop="date" label="建档日期"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 导出的表格 -->
    <el-table
      v-show="false"
      id='table'
      ref="multipleTable"
      :data="tableData1"
      :header-cell-style="{'background-color':'rgba(232, 232, 232, 1)','color':'rgba(90, 90, 90, 1)'}"
      style="width: 100%;border-bottom:1px solid rgba(217,217,217,1)">
      <el-table-column prop="gridNum" label="网格编号" width="177"></el-table-column>
      <el-table-column prop="gridRange" label="网格区域" width="177"></el-table-column>
      <el-table-column prop="carNum" label="车牌号" width="177"></el-table-column>
      <el-table-column prop="carHolder" label="车主" width="177"></el-table-column>
      <el-table-column prop="carColor" label="车身颜色" width="177"></el-table-column>
      <el-table-column prop="communityName" label="所属小区" width="199"></el-table-column>
      <el-table-column prop="date" label="建档日期"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { Message } from 'element-ui'

export default {
  data () {
    return {
      returnState: false,
      formData: {
        carNum: '',
        carHolder: '',
        communityName: '',
        date: ''
      },
      loading: false,
      tableData: [],
      tableData1: []
    }
  },
  computed: {
    loginUser() {
      return this.$store.getters.getLoginUser
    }
  },
  created() {
    if (this.$route.path === '/information/leaderPort') {
      this.returnState = true
    }
    this.getCars()
  },
  methods: {
    returnMain() {
      this.$router.push('/information/searchPort')
      setTimeout(() => {
        this.$router.push('/information/leaderPort')
      }, 50);
    },
    getRowKeys(row) {
      return row._id
    },
    // 导出选中的表格
    exportMeth() {
      if (this.tableData1.length !== 0) {
        let wb = XLSX.utils.table_to_book(document.querySelector('#table'));   // 这里就是表格
        let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
        try {
          FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '车辆建档信息.xlsx');  //table是自己导出文件时的命名，随意
        } catch (e) {
          console.log(e, wbout)
        }
        this.loginUser.operate = '小区治理-车辆数据导出'
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
      this.getCars()
    },
    // 查询并获取当前辖区的车辆
    getCars () {
      let query1 = {}
      if (this.formData.carNum === '' && this.formData.carHolder === '' && this.formData.communityName === '' && this.formData.date === '') query1 = {}
      if (this.formData.carNum !== '') {query1.carNum = this.formData.carNum}
      if (this.formData.carHolder !== '') {query1.carHolder = this.formData.carHolder}
      if (this.formData.communityName !== '') {query1.communityName = this.formData.communityName}
      if (this.formData.date !== '') {
        let newDate = new Date(this.formData.date)
        query1.date = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate()
      }
      let params = {
        query: query1
      }
      this.loading = true
      this.$axios
        .post('/cars/getInfoCars', params)
        .then(res => {
          if (res.data.code === 200) {
            this.tableData = res.data.cars
            this.loading = false
          }
        })
        .catch(res => {
          this.loginUser.wrongPlace = '查询门户-车辆信息查询'
          this.loginUser.wrongInfo = String(err)
          this.writeSysLog(this.loginUser)
          console.log('发生错误', err)
        })
    }
  },
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
.carInfo{
  &_header{
    .searchForm {
      .el-form-item {
        margin-left: 29px;
        margin-top: 12px;
        margin-bottom: 12px;
      }
      .el-input__inner {
        width: 188px;
        height: 32px;
      }
    }
    .firSearch{
      .el-input__inner {
        width: 121px;
        height: 32px;
      }
    }
    .secSearch{
      .el-input__inner {
        width: 99px;
        height: 32px;
      }
    }
  }
}
</style>