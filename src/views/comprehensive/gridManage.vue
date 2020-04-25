<template>
  <div class="gridManage">
    <div class="gridManage_header">
      <p>网格管理</p>
    </div>
    <div class="gridManage_content">
      <el-button type="primary" size="small" style="margin-left:24px" @click="addGrid">新增网格</el-button>
      <!-- 表格 -->
      <div class="table_pzp">
        <div class="user_tableContent">
          <el-table
            v-loading="loading"
            ref="multipleTable"
            :data="tableData"
            :header-cell-style="{'background-color':'rgba(232, 232, 232, 1)','color':'rgba(90, 90, 90, 1)'}"
            style="width: 100%;border-bottom:1px solid rgba(217,217,217,1)">
            <el-table-column prop="gridNum" label="网格编号" width="166"></el-table-column>
            <el-table-column prop="gridRange" label="网格管理范围" width="231"></el-table-column>
            <el-table-column prop="gridPeople" label="网格员" width="171"></el-table-column>
            <el-table-column prop="date" label="创建日期" width="196"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div>
                  <el-button type="primary" size="mini" @click="modGrid(scope.row)">编辑</el-button>
                  <el-button type="primary" size="mini" @click="deleteMeth(scope.row)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 新增网格dialog -->
      <el-dialog
        :close-on-click-modal="false"
        title="新增网格"
        :visible.sync="addDialogVisible"
        width="512px"
        :append-to-body="true">
        <el-form ref="add_form" v-if="addDialogVisible" :model="user_dialogData" label-width="120px" :rules="addRules">
          <el-form-item label="网格编号：" prop="gridNum">
            <el-input v-model="user_dialogData.gridNum" placeholder="请输入网格号"></el-input>
          </el-form-item>
          <el-form-item label="网格管理范围：" prop="gridRange">
            <el-input v-model="user_dialogData.gridRange" placeholder="请输入网格管理范围"></el-input>
          </el-form-item>
          <el-form-item label="网格员：" prop="gridPeople">
            <el-select v-model="user_dialogData.gridPeople" placeholder="请选择网格员">
              <el-option 
                v-for="item in gridPeoples" 
                :key="item.id"
                :label="item.option"
                :value="item.option">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false" class="tableBtn" size="medium" style="width:78px">取消</el-button
          ><el-button @click="addGridFinal('add_form')" type="primary" size="medium" style="width:78px;margin-left:10px">确认</el-button>
        </span>
      </el-dialog>

      <!-- 编辑网格dialog -->
      <el-dialog
        :close-on-click-modal="false"
        title="编辑网格"
        :visible.sync="modDialogVisible"
        width="512px"
        :append-to-body="true">
        <el-form ref="mod_form" v-if="modDialogVisible" :model="mod_dialogData" label-width="120px" :rules="modRules">
          <el-form-item label="网格编号：" prop="gridNum">
            <el-input v-model="mod_dialogData.gridNum" placeholder="请输入网格号" disabled></el-input>
          </el-form-item>
          <el-form-item label="网格管理范围：" prop="gridRange">
            <el-input v-model="mod_dialogData.gridRange" placeholder="请输入网格管理范围" disabled></el-input>
          </el-form-item>
          <el-form-item label="网格员：" prop="gridPeople">
            <el-select v-model="mod_dialogData.gridPeople" placeholder="请选择网格员">
              <el-option 
                v-for="item in gridPeoples" 
                :key="item.id"
                :label="item.option"
                :value="item.option">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="modDialogVisible = false" class="tableBtn" size="medium" style="width:78px">取消</el-button
          ><el-button @click="modGridFinal('mod_form')" type="primary" size="medium" style="width:78px;margin-left:10px">确认</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'
export default {
  data() {
    return {
      addDialogVisible: false,
      modDialogVisible: false,
      tempName: '',
      tempRow: {},
      loading: false,
      tableData: [],
      user_dialogData: {
        gridNum: '',
        gridRange: '',
        gridPeople: ''
      },
      mod_dialogData: {
        gridNum: '',
        gridRange: '',
        gridPeople: ''
      },
      //新增表单验证规则
      addRules: {
        gridNum: [{
          validator: (rule, value, callback) => {
            for (let item in this.tableData) {
              if (value === this.tableData[item].gridNum) {
                callback(new Error('该网格号已存在，请重新输入！'))
              }
            }
            callback()
          },
          trigger: 'blur'
        },
        { required: true, min: 1, max: 20, message: '请输入1-20字符!', trigger: 'blur' }],
        gridRange: [{
          validator: (rule, value, callback) => {
            for (let item in this.tableData) {
              if (value === this.tableData[item].gridRange) {
                callback(new Error('该网格管理范围已存在，请重新输入！'))
              }
            }
            callback()
          },
          trigger: 'blur'
        },
        { required: true, min: 1, max: 20, message: '请输入1-20字符!', trigger: 'blur' }],
        gridPeople: [{ required: true, message: '请选择网格员', trigger: 'blur' }]
      },
      modRules: {
        gridPeople: [{ required: true, message: '请选择网格员', trigger: 'blur' }]
      },
    }
  },
  computed: {
    gridPeoples() {
      return this.$store.getters.getgrids
    },
    loginUser() {
      return this.$store.getters.getLoginUser
    }
  },

  created() {
    this.getAllGrids()
  },

  methods: {
    // 新增网格
    addGrid () {
      this.user_dialogData.gridNum = ''
      this.user_dialogData.gridPeople = ''
      this.user_dialogData.gridRange = ''
      this.addDialogVisible = true
    },
    addGridFinal(formName) {
      this.loginUser.operate = '网格管理-新建网格'
      let params1 = {
        gridNum: this.user_dialogData.gridNum,
        gridRange: this.user_dialogData.gridRange,
        gridPeople: this.user_dialogData.gridPeople
      }
      let params2 = {
        currentPage: 1,
        pageSize: 1000,
        query: {
          name: this.user_dialogData.gridPeople
        }
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
          .post('/user/getUsers', params2)
          .then(res => {
            if (res.data.code === 200) {
              params1.userName = res.data.user[0].userName
              this.$axios
                .post('/user/registerDetail', params1)
                .then(res1 => {
                  if (res1.data.code === 200) {
                    Message.success('创建成功')
                    this.writeOpLog(this.loginUser)
                    this.getAllGrids()
                    this.addDialogVisible = false
                  }
                })
            }
          })
          .catch(err => {
            this.loginUser.wrongPlace = '网格管理-新建网格'
            this.loginUser.wrongInfo = String(err)
            this.writeSysLog(this.loginUser)
            console.log('发生错误', err)
          })
        }
      })
    },

    // 修改网格信息
    modGrid(row) {
      this.mod_dialogData.gridNum = row.gridNum
      this.mod_dialogData.gridRange = row.gridRange
      this.mod_dialogData.gridPeople = row.gridPeople
      this.tempName = row.gridPeople
      this.tempRow = JSON.parse(JSON.stringify(row))
      this.modDialogVisible = true
    },
    modGridFinal(formName) {
      this.loginUser.operate = '网格管理-修改网格信息'
      let params1 = {
        gridNum: this.mod_dialogData.gridNum
      }
        let params2 = {
          currentPage: 1,
          pageSize: 1000,
          query: {
            name: this.tempName
          }
        }
        let params3 = {
          gridNum: this.tempRow.gridNum,
          gridRange: this.tempRow.gridRange,
          gridPeople: this.mod_dialogData.gridPeople
        }
        this.$axios
          .post('/user/getUsers', params2)
          .then(res => {
            if (res.data.code === 200) {
              params1.userName = res.data.user[0].userName
              this.$axios
                .post('/user/deleteUserDetail', params1)
                .then(res1 => {
                  if (res1.data.code === 200) {
                    params2.query.name = this.mod_dialogData.gridPeople
                    this.$axios
                      .post('/user/getUsers', params2)
                      .then(res2 => {
                        if (res2.data.code === 200) {
                          params3.userName = res2.data.user[0].userName
                          this.$axios
                            .post('/user/registerDetail', params3)
                            .then(res3 => {
                              if (res3.data.code === 200) {
                                Message.success('修改成功')
                                this.writeOpLog(this.loginUser)
                                this.getAllGrids()
                                this.modDialogVisible = false
                              }
                            })
                        }
                      })
                  }
                })
            }
          })
    },

    deleteMeth(row) {
      this.loginUser.operate = '网格管理-删除网格'
      this.$confirm('删除后不可恢复，确定要删除吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'delete_icon',
        dangerouslyUseHTMLString: true
      }).then(() => {
        let params1 = {
          gridNum: row.gridNum
        }
        let params2 = {
          currentPage: 1,
          pageSize: 1000,
          query: {
            name: row.gridPeople
          }
        }
        this.$axios
          .post('/user/getUsers', params2)
          .then(res => {
            if (res.data.code === 200) {
              params1.userName = res.data.user[0].userName
              this.$axios
                .post('/user/deleteUserDetail', params1)
                .then(res => {
                  if (res.data.code === 200) {
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    })
                    this.getAllGrids()
                    this.writeOpLog(this.loginUser)
                  }
                })
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },

    //获取网格信息
    getAllGrids () {
      let params = {
        currentPage: 1,
        pageSize: 1000,
        query: {}
      }
      this.loading = true
      this.$axios
        .post('/user/getUsers', params)
        .then(res => {
          if (res.data.code === 200) {
            this.tableData = []
            for (let i in res.data.user) {
              if (res.data.user[i].insideData.length !== 0) {
                for (let j in res.data.user[i].insideData) {
                  let newDate = new Date(res.data.user[i].insideData[j].date)
                  res.data.user[i].insideData[j].date = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate()
                  if (res.data.user[i].insideData[j].gridNum) {
                    res.data.user[i].insideData[j].gridPeople = res.data.user[i].name
                    this.tableData.push(res.data.user[i].insideData[j])
                  }
                }
              }
            }
            this.loading = false
          }
        })
    }
  },
}

</script>
<style lang='scss' scoped>
.gridManage {
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
    padding-top: 18px;
  }
}
</style>