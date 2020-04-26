<template>
  <div class="userInfo">
    <div class="userInfo_content">
      <div class="searchForm" style="overflow: auto">
        <el-form :inline="true" :model="formData" ref="searchForm">
          <el-form-item label="账号:" prop="userName" class="userName">
            <el-input v-model="formData.userName"></el-input>
          </el-form-item
          ><el-form-item label="姓名:" prop="name" class="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item
          ><el-form-item label="角色：" prop="role" class="role">
            <el-select v-model="formData.role" placeholder="请选择">
              <el-option label="网格员用户" value="网格员用户"></el-option>
              <el-option label="查询用户" value="查询用户"></el-option>
              <el-option label="领导" value="领导"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="btns">
          <el-button size="mini" @click.native="resetForm('searchForm')">重置</el-button>
          <el-button type="primary" size="mini" @click="getUsers()">查询</el-button>
        </div>
      </div>
      <el-button type="primary" size="small" style="margin-left:24px" @click="exportMeth">数据导出</el-button>
      <el-button type="primary" size="small" v-if="returnState" @click="returnMain">返回</el-button>
      <!-- 表格 -->
      <div class="table_pzp">
        <div class="user_tableContent">
          <el-table
            :row-key="getRowKeys"
            max-height="325"
            v-loading="loading"
            ref="multipleTable"
            @selection-change="handleSelectionChange"
            :data="tableData"
            :default-sort = "{prop: 'date'}"
            :header-cell-style="{'background-color':'rgba(232, 232, 232, 1)','color':'rgba(90, 90, 90, 1)'}"
            style="width: 100%;border-bottom:1px solid rgba(217,217,217,1)">
            <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
            <el-table-column prop="userName" label="账号" width="96"></el-table-column>
            <el-table-column prop="name" label="姓名" width="161"></el-table-column>
            <el-table-column prop="tel" label="联系方式" width="161"></el-table-column>
            <el-table-column prop="role" label="角色"  width="151"></el-table-column>
            <el-table-column prop="education" label="学历"  width="130"></el-table-column>
            <el-table-column prop="nation" label="民族"  width="130"></el-table-column>
            <el-table-column prop="date" sortable label="创建日期"></el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 导出的表格 -->
      <el-table
        v-show="false"
        id='usertable'
        ref="multipleTable"
        :data="tableData1"
        :header-cell-style="{'background-color':'rgba(232, 232, 232, 1)','color':'rgba(90, 90, 90, 1)'}"
        style="width: 100%;border-bottom:1px solid rgba(217,217,217,1)">
        <el-table-column prop="userName" label="账号" width="96"></el-table-column>
        <el-table-column prop="name" label="姓名" width="161"></el-table-column>
        <el-table-column prop="tel" label="联系方式" width="161"></el-table-column>
        <el-table-column prop="role" label="角色"  width="151"></el-table-column>
        <el-table-column prop="education" label="学历"  width="130"></el-table-column>
        <el-table-column prop="nation" label="民族"  width="130"></el-table-column>
      </el-table>
    </div>
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
      // 表格数据
      tableData: [],
      loading: false,
      formData: {
        userName: '',
        name: '',
        role: ''
      },
      tableData1: []
    }
  },
  computed: {
    nations() {
      return this.$store.getters.getNation
    },
    edus() {
      return this.$store.getters.getEdu
    },
    loginUser() {
      return this.$store.getters.getLoginUser
    }
  },
  created() {
    if (this.$route.path === '/information/leaderPort') {
      this.returnState = true
    }
    this.getUsers()
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
        let wb = XLSX.utils.table_to_book(document.querySelector('#usertable'));   // 这里就是表格
        let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
        try {
          FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '系统用户信息.xlsx');  //table是自己导出文件时的命名，随意
        } catch (e) {
          console.log(e, wbout)
        }
        this.loginUser.operate = '信息门户-系统用户数据导出'
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
      this.getUsers()
    },
    // 获取数据库用户
    getUsers () {
      let query1 = {}
      if (this.formData.userName === '' && this.formData.name === '' && this.formData.role === '') query1 = {}
      if (this.formData.userName !== '') {query1.userName = this.formData.userName}
      if (this.formData.name !== '') {query1.name = this.formData.name}
      if (this.formData.role !== '') {query1.role = this.formData.role}
      let params = {
        query: query1
      }
      this.loading = true
      this.$axios
        .post('/user/getUsers', params)
        .then(res => {
          if (res.data.code === 200) {
            res.data.user.forEach((el, index) => {
              let nowDate = new Date(el.date)
              el.date = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate()
            })
            this.tableData = res.data.user
            this.loading = false
          }
        })
        .catch(res => {
          this.loginUser.wrongPlace = '信息门户-系统用户查询'
          this.loginUser.wrongInfo = String(err)
          this.writeSysLog(this.loginUser)
          console.log('发生错误', err)
        })
    },
  }
}

</script>
<style lang='scss' scoped>
.userInfo {
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow: auto;
  &_content{
    .searchForm{
      border-radius:4px;
      height: 106px;
      background:rgba(245,245,245,1);
      opacity:1;
      margin: 0 24px 12px 24px;
      .btns{
        text-align: center;
      }
    }
  }
}
</style>

<style lang="scss">
.userInfo{
  &_content{
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
        width: 180px;
      }
    }
  }
}
</style>