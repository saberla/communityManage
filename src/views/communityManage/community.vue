<template>
  <div class="community">
    <div class="community_header">
      <p>小区建档</p>
    </div>
    <div class="community_content" v-if="!detailState">
      <h2 style="diplay:inline-block;text-align:center">成都市新都区 小区信息统计</h2>
      <div class="communityBtn" style="padding-left:24px;padding-top:12px">
        <el-button type="primary" @click="addCommunity()" size="mini" v-if="loginUser.role === '网格员用户'">新增小区</el-button>
      </div>
      <div class="table_pzp">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="tableData"
          :header-cell-style="{'background-color':'rgba(232, 232, 232, 1)','color':'rgba(90, 90, 90, 1)'}"
          style="width: 100%;border-bottom:1px solid rgba(217,217,217,1)">
          <el-table-column prop="communityName" label="小区名" width="199"></el-table-column>
          <el-table-column prop="communityAdd" label="小区地址" show-overflow-tooltip width="299"></el-table-column>
          <el-table-column prop="developCompany" label="开发商" show-overflow-tooltip width="166"></el-table-column>
          <el-table-column prop="property" label="物业公司" show-overflow-tooltip width="166"></el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <div>
                <el-button class="short_btn" size="mini" type="primary" v-if="loginUser.role === '网格员用户'" @click="editMeth(scope.row)">
                  编辑
                </el-button
                ><el-button class="long_btn" size="mini"  @click="openDetail(scope.row)">
                  详情
                </el-button
                ><el-button class="short_btn" size="mini" v-if="loginUser.role === '网格员用户'"  @click="delMeth(scope.row)">
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 新增小区dialog -->
      <el-dialog
        :close-on-click-modal="false"
        title="小区建档"
        :visible.sync="addDialogVisible"
        width="512px"
        :append-to-body="true">
        <el-form ref="add_form" v-if="addDialogVisible" :model="user_dialogData" label-width="86px" :rules="addRules">
          <el-form-item label="小区名：" prop="communityName">
            <el-input v-model="user_dialogData.communityName" placeholder="请输入小区名"></el-input>
          </el-form-item>
          <el-form-item label="小区地址：" prop="communityAdd">
            <el-input v-model="user_dialogData.communityAdd" placeholder="请输入小区地址"></el-input>
          </el-form-item>
          <el-form-item label="开发商：" prop="developCompany">
            <el-input v-model="user_dialogData.developCompany" placeholder="请输入小区开发商"></el-input>
          </el-form-item>
          <el-form-item label="物业团队：" prop="property">
            <el-input v-model="user_dialogData.property" placeholder="请输入物业团队"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false" class="tableBtn" size="medium" style="width:78px">取消</el-button
          ><el-button @click="addCommunityFinal('add_form')" type="primary" size="medium" style="width:78px;margin-left:10px">确认</el-button>
        </span>
      </el-dialog>

      <!-- 编辑小区dialog -->
      <el-dialog
        :close-on-click-modal="false"
        title="小区建档"
        :visible.sync="modDialogVisible"
        width="512px"
        :append-to-body="true">
        <el-form ref="mod_form" v-if="modDialogVisible" :model="mod_dialogData" label-width="86px" :rules="modRules">
          <el-form-item label="小区名：" prop="communityName">
            <el-input v-model="mod_dialogData.communityName" placeholder="请输入小区名"></el-input>
          </el-form-item>
          <el-form-item label="小区地址：" prop="communityAdd">
            <el-input v-model="mod_dialogData.communityAdd" placeholder="请输入小区地址"></el-input>
          </el-form-item>
          <el-form-item label="开发商：" prop="developCompany">
            <el-input v-model="mod_dialogData.developCompany" placeholder="请输入小区开发商"></el-input>
          </el-form-item>
          <el-form-item label="物业团队：" prop="property">
            <el-input v-model="mod_dialogData.property" placeholder="请输入物业团队"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="modDialogVisible = false" class="tableBtn" size="medium" style="width:78px">取消</el-button
          ><el-button @click="modCommunity('mod_form')" type="primary" size="medium" style="width:78px;margin-left:10px">确认</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 小区建设详情 -->
    <detailPage :mainPage='mainPageValue' v-if="detailState" @setDetailValue='getValue'></detailPage>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import detailPage from '../../components/detail/communityDetail/commonHeader'
export default {
  data () {
    return {
      detailState: false,
      loading: false,
      tableData: [],
      tempName: '',
      addDialogVisible: false,
      modDialogVisible: false,
      mainPageValue: {},
      // 新增dialog
      user_dialogData: {
        communityName: '',
        communityAdd: '',
        developCompany: '',
        property: ''
      },
      // 编辑dialog
      mod_dialogData: {
        communityName: '',
        communityAdd: '',
        developCompany: '',
        property: ''
      },

      // 新增小区规则验证
      addRules: {
        communityName: [{
          validator: (rule, value, callback) => {
            for (let item in this.tableData) {
              if (value === this.tableData[item].communityName) {
                callback(new Error('该小区已存在，请重新输入！'))
              }
            }
            callback()
          },
          trigger: 'change'
        },
        { required: true, min: 1, max: 20, message: '请输入1-20字符!', trigger: 'blur' }],
        communityAdd: [{ required: true, message: '请输入小区地址', trigger: 'blur' }],
        developCompany: [{ required: true, message: '请输入小区开发商', trigger: 'blur' }],
        property: [{ required: true, message: '请输入物业团队', trigger: 'blur' }]
      },
      // 编辑小区规则验证
      modRules: {
        communityName: [{
          validator: (rule, value, callback) => {
            if (value === this.tempName) {
              callback()
            } else {
              for (let item in this.tableData) {
                if (value === this.tableData[item].communityName) {
                  callback(new Error('该小区已存在，请重新输入！'))
                }
              }
              callback()
            }
          },
          trigger: 'change'
        },
        { required: true, min: 1, max: 20, message: '请输入1-20字符!', trigger: 'blur' }],
        communityAdd: [{ required: true, message: '请输入小区地址', trigger: 'blur' }],
        developCompany: [{ required: true, message: '请输入小区开发商', trigger: 'blur' }],
        property: [{ required: true, message: '请输入物业团队', trigger: 'blur' }]
      }
    }
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
    // 新增小区
    addCommunity() {
      this.user_dialogData.communityName = ''
      this.user_dialogData.communityAdd = ''
      this.user_dialogData.developCompany = ''
      this.user_dialogData.property = ''
      this.addDialogVisible = true
    },
    addCommunityFinal (formName) {
      for (let i in this.loginUser.insideData) {
        if (this.loginUser.insideData[i].gridNum) {
          var gridNum1 = this.loginUser.insideData[i].gridNum
          var gridRange1 = this.loginUser.insideData[i].gridRange
          break
        }
      }
      this.loginUser.operate = '小区治理-小区建档'
      let params = {
        gridNum: gridNum1,
        gridRange: gridRange1,
        communityName: this.user_dialogData.communityName,
        communityAdd: this.user_dialogData.communityAdd,
        developCompany: this.user_dialogData.developCompany,
        property: this.user_dialogData.property
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post('/community/addCommunity', params)
            .then(res => {
              if (res.data.code === 200) {
                this.getCommunity()
                this.addDialogVisible = false
                Message.success('小区建档成功')
                this.writeOpLog(this.loginUser)
              }
            })
            .catch(err => {
              this.loginUser.wrongPlace = '小区治理-小区建档'
              this.loginUser.wrongInfo = String(err)
              this.writeSysLog(this.loginUser)
              console.log('发生错误', err)
            })
        }
      })
    },

    // 编辑小区
    editMeth(row) {
      this.mod_dialogData.communityName = row.communityName
      this.mod_dialogData.communityAdd = row.communityAdd
      this.mod_dialogData.developCompany = row.developCompany
      this.mod_dialogData.property = row.property
      this.tempName = row.communityName
      this.modDialogVisible = true
    },
    modCommunity(formName) {
      try {
        for (let i in this.loginUser.insideData) {
          if (this.loginUser.insideData[i].gridNum) {
            var gridNum1 = this.loginUser.insideData[i].gridNum
            var gridRange1 = this.loginUser.insideData[i].gridRange
            break
          }
        }
        this.loginUser.operate = '小区治理-修改小区信息'
        let params = {
          gridNum: gridNum1,
          communityName1: this.tempName,
          communityName: this.mod_dialogData.communityName,
          communityAdd: this.mod_dialogData.communityAdd,
          developCompany: this.mod_dialogData.developCompany,
          property: this.mod_dialogData.property
        }
        this.$refs[formName].validate(valid => {
          if(valid) {
            this.$axios
              .post('/community/modCommunity', params)
              .then(res => {
                if(res.data.code === 200) {
                  this.getCommunity()
                  Message.success('修改成功')
                  this.modDialogVisible = false
                  this.writeOpLog(this.loginUser)
                }
              })
              .catch(err => {
                this.loginUser.wrongPlace = '小区治理-编辑小区'
                this.loginUser.wrongInfo = String(err)
                this.writeSysLog(this.loginUser)
                console.log('发生错误', err)
              })
          }
        })
      } catch (error) {
        this.loginUser.wrongPlace = '小区治理-编辑小区信息'
        this.loginUser.wrongInfo = String(error)
        this.writeSysLog(this.loginUser)
        console.log('发生错误', error)
      }
    }, 

    // 删除小区
    delMeth (row) {
      this.loginUser.operate = '小区治理-删除小区'
      this.$confirm('删除后不可恢复，确定要删除吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'delete_icon',
        dangerouslyUseHTMLString: true
      }).then(() => {
        for (let i in this.loginUser.insideData) {
          if (this.loginUser.insideData[i].gridNum) {
            var gridNum1 = this.loginUser.insideData[i].gridNum
            var gridRange1 = this.loginUser.insideData[i].gridRange
            break
          }
        }
        this.$axios
          .post('/community/deleCommunity', {gridNum: gridNum1, communityName: row.communityName})
          .then(res => {
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getCommunity()
              this.writeOpLog(this.loginUser)
            }
          })
          .catch(err => {
            this.loginUser.wrongPlace = '小区治理-删除小区'
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

    // 获取当前网格员管理的小区信息
    getCommunity () {
      try {
        if (this.loginUser.role === 'gridManager') {
          var params = {}
        } else {
          for (let i in this.loginUser.insideData) {
            if (this.loginUser.insideData[i].gridNum) {
              var gridNum1 = this.loginUser.insideData[i].gridNum
              var gridRange1 = this.loginUser.insideData[i].gridRange
              break
            }
          }
          var params = {
            gridNum: gridNum1,
            gridRange: gridRange1
          }
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