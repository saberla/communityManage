<template>
  <div class="car">
    <div class="addCar">
      <el-button type="primary" style="margin-left:24px" size="small" v-if="loginUser.role === '领导'" @click="exportMeth">数据导出</el-button>
      <el-button type="primary" size="mini" style="margin-left:24px" @click="addCar" v-if="loginUser.role === '网格员用户'">车辆建档</el-button>
    </div>
    <!-- 表格 -->
    <div class="table_pzp">
      <div class="user_tableContent">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="tableData"
          @selection-change="handleSelectionChange"
          :header-cell-style="{'background-color':'rgba(232, 232, 232, 1)','color':'rgba(90, 90, 90, 1)'}"
          style="width: 100%;border-bottom:1px solid rgba(217,217,217,1)">
          <el-table-column type="selection" width="55" v-if="loginUser.role === '领导'"></el-table-column>
          <el-table-column prop="carNum" label="车牌号" width="196"></el-table-column>
          <el-table-column prop="carHolder" label="车主" width="231"></el-table-column>
          <el-table-column prop="carColor" label="车身颜色" width="231"></el-table-column>
          <el-table-column prop="date" label="建档日期" :width="loginUser.role === '网格员用户' ? '231' : ''"></el-table-column>
          <el-table-column label="操作" fixed="right" v-if="loginUser.role === '网格员用户'">
            <template slot-scope="scope">
              <div>
                <el-button size="mini" type="primary" @click="modCar(scope.row)" v-if="loginUser.role === '网格员用户'">编辑</el-button>
                <el-button size="mini" type="primary" @click="delMeth(scope.row)" v-if="loginUser.role === '网格员用户'">移除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <pagination :paginationObj='paginationObj'></pagination>

    <!-- 车辆建档dialog -->
    <el-dialog
      :close-on-click-modal="false"
      title="车辆建档"
      :visible.sync="addDialogVisible"
      width="512px"
      :append-to-body="true">
      <el-form ref="add_form" v-if="addDialogVisible" :model="add_dialogData" label-width="86px" :rules="addRules">
        <el-form-item label="小区名：" prop="communityName">
          <el-input v-model="add_dialogData.communityName" disabled :placeholder="mainPage.communityName"></el-input>
        </el-form-item>
        <el-form-item label="车牌号：" prop="carNum">
          <el-input v-model="add_dialogData.carNum" placeholder="请输入车牌号"></el-input>
        </el-form-item>
        <el-form-item label="车主：" prop="carHolder">
          <el-input v-model="add_dialogData.carHolder" placeholder="请输入车主"></el-input>
        </el-form-item>
        <el-form-item label="车身颜色：" prop="carColor">
          <el-input v-model="add_dialogData.carColor" placeholder="请输入车辆颜色"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" class="tableBtn" size="medium" style="width:78px">取消</el-button
        ><el-button @click="addCarFinal('add_form')" type="primary" size="medium" style="width:78px;margin-left:10px">确认</el-button>
      </span>
    </el-dialog>

    <!-- 编辑车辆dialog -->
    <el-dialog
      :close-on-click-modal="false"
      title="车辆信息修改"
      :visible.sync="modDialogVisible"
      width="512px"
      :append-to-body="true">
      <el-form ref="mod_form" v-if="modDialogVisible" :model="mod_dialogData" label-width="86px" :rules="addRules">
        <el-form-item label="小区名：" prop="communityName">
          <el-input v-model="mod_dialogData.communityName" disabled :placeholder="mainPage.communityName"></el-input>
        </el-form-item>
        <el-form-item label="车牌号：" prop="carNum">
          <el-input v-model="mod_dialogData.carNum" placeholder="请输入车牌号"></el-input>
        </el-form-item>
        <el-form-item label="车主：" prop="carHolder">
          <el-input v-model="mod_dialogData.carHolder" placeholder="请输入车主"></el-input>
        </el-form-item>
        <el-form-item label="车身颜色：" prop="carColor">
          <el-input v-model="mod_dialogData.carColor" placeholder="请输入车辆颜色"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modDialogVisible = false" class="tableBtn" size="medium" style="width:78px">取消</el-button
        ><el-button @click="modCarFinal('mod_form')" type="primary" size="medium" style="width:78px;margin-left:10px">确认</el-button>
      </span>
    </el-dialog>

    <el-table
      v-show="false"
      id='carLeadertable'
      :data="tableData1"
      :header-cell-style="{'background-color':'rgba(232, 232, 232, 1)','color':'rgba(90, 90, 90, 1)'}"
      style="width: 100%;border-bottom:1px solid rgba(217,217,217,1)">
      <el-table-column prop="carNum" label="车牌号" width="196"></el-table-column>
      <el-table-column prop="carHolder" label="车主" width="231"></el-table-column>
      <el-table-column prop="carColor" label="车身颜色" width="231"></el-table-column>
      <el-table-column prop="date" label="建档日期" :width="loginUser.role === '网格员用户' ? '231' : ''"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { Message } from 'element-ui'
import pagination from '../../pagination/pagination'
export default {
  data() {
    return {
      tempId: '',
      addDialogVisible: false,
      modDialogVisible: false,
      add_dialogData: {
        communityName: '',
        carNum: '',
        carHolder: '',
        carColor: ''
      },
      mod_dialogData: {
        communityName: '',
        carNum: '',
        carHolder: '',
        carColor: ''
      },
      tableData: [],
      tableData1: [], // 导出表格的数据
      loading: false,
      //分页
      paginationObj: {
        total: 0,
        currentPage: 1,
        pageSize: 3,
        handleCurrentChange: (val) => {
          this.paginationObj.currentPage = val
          this.getCars()
        }
      },

      //车辆建档验证规则
      addRules: {
        carNum: [{ required: true, min: 1, max: 29, message: '请输入车牌号!', trigger: 'blur' }],
        carHolder: [{ required: true, min: 1, max: 29, message: '请输入车主!', trigger: 'blur' }],
        carColor: [{ required: true, min: 1, max: 29, message: '请输入车辆颜色!', trigger: 'blur' }]
      }
    }
  },
  props: {
    mainPage: Object
  },
  components:{
    pagination
  },
  
  created() {
    this.getCars()
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
        let wb = XLSX.utils.table_to_book(document.querySelector('#carLeadertable'));   // 这里就是表格
        let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
        try {
          FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '车辆建档信息.xlsx');  //table是自己导出文件时的命名，随意
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
    // 获取当前小区的车辆信息
    getCars () {
      let params = {
        communityName: this.mainPage.communityName,
        pageSize: this.paginationObj.pageSize,
        currentPage: this.paginationObj.currentPage
      }
      this.loading = true
      this.$axios
        .post('/cars/getCars', params)
        .then(res => {
          if (res.data.code === 200) {
            this.loading = false
            this.tableData = res.data.car
            this.paginationObj.total = res.data.totalCount
            this.$emit('carTotal', this.paginationObj.total)
          }
        })
        .catch(err => {
          this.loginUser.wrongPlace = '小区治理-获取车辆建档信息'
          this.loginUser.wrongInfo = String(err)
          this.writeSysLog(this.loginUser)
          console.log('发生错误', err)
        })
    },

    // 车辆建档
    addCar () {
      this.add_dialogData.carNum = ''
      this.add_dialogData.carHolder = ''
      this.add_dialogData.carColor = ''
      this.addDialogVisible = true
    },
    addCarFinal (formName) {
      for (let i in this.loginUser.insideData) {
        if (this.loginUser.insideData[i].gridNum) {
          var gridNum1 = this.loginUser.insideData[i].gridNum
          var gridRange1 = this.loginUser.insideData[i].gridRange
          break
        }
      }
      this.loginUser.operate = '小区治理-车辆建档'
      let nowDate = new Date()
      let date1 = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate()
      let params = {
        date: date1,
        gridNum: gridNum1,
        gridRange: gridRange1,
        communityName: this.mainPage.communityName,
        carNum: this.add_dialogData.carNum,
        carHolder: this.add_dialogData.carHolder,
        carColor: this.add_dialogData.carColor
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios 
            .post('/cars/addcar', params)
            .then(res => {
              if (res.data.code === 200) {
                Message.success('车辆建档成功')
                this.getCars()
                this.addDialogVisible = false
                this.writeOpLog(this.loginUser)
              }
            })
            .catch(err => {
              this.loginUser.wrongPlace = '小区治理-车辆建档'
              this.loginUser.wrongInfo = String(err)
              this.writeSysLog(this.loginUser)
              console.log('发生错误', err)
            })
        }
      })
    },

    // 修改车辆信息
    modCar (row) {
      this.tempId = JSON.parse(JSON.stringify(row._id))
      this.mod_dialogData.carNum = row.carNum
      this.mod_dialogData.carHolder = row.carHolder
      this.mod_dialogData.carColor = row.carColor
      this.modDialogVisible = true
    },
    modCarFinal (formName) {
      this.loginUser.operate = '小区治理-修改车辆信息'
      let params = {
        communityName: this.mainPage.communityName,
        carNum: this.mod_dialogData.carNum,
        carHolder: this.mod_dialogData.carHolder,
        carColor: this.mod_dialogData.carColor,
        id: this.tempId
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios 
            .post('/cars/modCar', params)
            .then(res => {
              if (res.data.code === 200) {
                Message.success('修改信息成功')
                this.getCars()
                this.modDialogVisible = false
                this.writeOpLog(this.loginUser)
              } 
            })
            .catch(err => {
              this.loginUser.wrongPlace = '小区治理-修改车辆信息'
              this.loginUser.wrongInfo = String(err)
              this.writeSysLog(this.loginUser)
              console.log('发生错误', err)
            })
        }
      })
    },

    // 删除车辆
    delMeth (row) {
      this.loginUser.operate = '小区治理-删除车辆信息'
      this.$confirm('删除后不可恢复，确定要删除吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'delete_icon',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.$axios
          .post('/cars/delCar', {communityName: row.communityName, id: JSON.parse(JSON.stringify(row._id))})
          .then(res => {
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.paginationObj.currentPage = 1
              this.getCars()
              this.writeOpLog(this.loginUser)
            }
          })
          .catch(err => {
            this.loginUser.wrongPlace = '小区治理-删除车辆信息'
            this.loginUser.wrongInfo = String(err)
            this.writeSysLog(this.loginUser)
            console.log('发生错误', err)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
  }
}

</script>
<style lang='scss' scoped>
</style>