<template>
  <div class="community">
    <div class="community_content" v-if="!detailState">
      <div class="communityBtn" style="padding-left:24px;padding-top:12px">
        <el-button type="primary" size="small" @click="exportMeth">数据导出</el-button>
        <el-button type="primary" @click="returnMain()" size="mini">返回上一级</el-button>
      </div>
      <h2 style="diplay:inline-block;text-align:center">{{parent}} 小区信息统计</h2>
      <div class="table_pzp">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="tableData"
          @selection-change="handleSelectionChange"
          :header-cell-style="{'background-color':'rgba(232, 232, 232, 1)','color':'rgba(90, 90, 90, 1)'}"
          style="width: 100%;border-bottom:1px solid rgba(217,217,217,1)">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="communityName" label="小区名" width="199"></el-table-column>
          <el-table-column prop="communityAdd" label="小区地址" show-overflow-tooltip width="299"></el-table-column>
          <el-table-column prop="developCompany" label="开发商" show-overflow-tooltip width="166"></el-table-column>
          <el-table-column prop="property" label="物业公司" show-overflow-tooltip width="166"></el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <div>
                <el-button class="long_btn" size="mini"  @click="openDetail(scope.row)">
                  详情
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-table
      v-show="false"
      id='communityLeadertable'
      ref="multipleTable"
      :data="tableData1"
      :header-cell-style="{'background-color':'rgba(232, 232, 232, 1)','color':'rgba(90, 90, 90, 1)'}"
      style="width: 100%;border-bottom:1px solid rgba(217,217,217,1)">
      <el-table-column prop="communityName" label="小区名" width="199"></el-table-column>
      <el-table-column prop="communityAdd" label="小区地址" show-overflow-tooltip width="299"></el-table-column>
      <el-table-column prop="developCompany" label="开发商" show-overflow-tooltip width="166"></el-table-column>
      <el-table-column prop="property" label="物业公司" show-overflow-tooltip width="166"></el-table-column>
    </el-table>

    <!-- 小区建设详情 -->
    <detailPage :mainPage='mainPageValue' v-if="detailState" @setDetailValue='getValue'></detailPage>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { Message } from 'element-ui'
import detailPage from '../communityDetail/commonHeader'
export default {
  data () {
    return {
      detailState: false,
      loading: false,
      tableData: [],
      tableData1: [], // 导出表格的数据
      tempName: '',
      mainPageValue: {},
    }
  },
  props: {
    parent: String
  },
  components: {
    detailPage
  },
  created() {
    this.getCommunity()
  },
  computed: {
    loginUser() {
      return this.$store.getters.getLoginUser
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.tableData1 = val
    },
    // 导出选中的表格
    exportMeth() {
      if (this.tableData1.length !== 0) {
        let wb = XLSX.utils.table_to_book(document.querySelector('#communityLeadertable'));   // 这里就是表格
        let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
        try {
          FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '小区建档信息.xlsx');  //table是自己导出文件时的命名，随意
        } catch (e) {
          console.log(e, wbout)
        }
        this.loginUser.operate = '领导-小区数据导出'
        this.writeOpLog(this.loginUser)
        return wbout
      } else {
        Message.error('请选择需要导出的数据')
      }
    },
    // 返回上一级
    returnMain() {
      this.$router.push('/information/searchPort')
      setTimeout(() => {
        this.$router.push('/information/leaderPort')
      }, 50);
    },
    // 获取当前网格员管理的小区信息
    getCommunity () {
      try {
        let params = {
          gridRange: this.parent
        }
        let params1 = {
          query: params
        }
        this.loading = true
        this.$axios
          .post('/community/getCommunities', params1)
          .then(res => {
            if (res.data.code === 200) {
              this.loading = false
              this.tableData = res.data.com
            }
          })
          .catch(err => {
            this.loginUser.wrongPlace = '小区治理-获取小区信息'
            this.loginUser.wrongInfo = String(err)
            this.writeSysLog(this.loginUser)
            console.log('发生错误', err)
          })
      } catch (error) {
        this.loginUser.wrongPlace = '小区治理-获取小区信息'
        this.loginUser.wrongInfo = String(error)
        this.writeSysLog(this.loginUser)
        console.log('发生错误', error)
      }
    },

    // 打开小区详情页面
    openDetail (row) {
      let obj = {
        communityName: row.communityName
      }
      this.mainPageValue = obj
      this.detailState = true
    },
    
    // 详情数据
    getValue (value) {
      this.detailState = value
    }
  },
}

</script>
<style lang='scss' scoped>
.community {
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow: auto;
  &_header{
    padding-left: 24px;
    padding-top: 16px;
    padding-bottom: 14px;
    color: rgba(38, 38, 38, 1);
    font-size:16px;
    font-weight:400;
    border-bottom: 2px solid rgba(232,232,232,1);
    p {
      margin: 0;
      height: 16px;
      line-height: 16px;
    }
  }
  &_content{
    width: 100%;
  }
}
</style>