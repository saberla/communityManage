<template>
  <div class="userManage">
    <div class="userManage_header">
      <p>用户管理</p>
    </div>
    <div class="userManage_content">
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
          <el-button size="medium" @click.native="resetForm('searchForm')">重置</el-button>
          <el-button type="primary" size="medium" @click="getUsers()">查询</el-button>
        </div>
      </div>
      <el-button type="primary" size="small" style="margin-left:24px" @click="addUserdia">新增用户</el-button>

      <!-- 表格 -->
      <div class="table_pzp">
        <div class="user_tableContent">
          <el-table
            v-loading="loading"
            ref="multipleTable"
            :data="tableData"
            :default-sort = "{prop: 'date'}"
            :header-cell-style="{'background-color':'rgba(232, 232, 232, 1)','color':'rgba(90, 90, 90, 1)'}"
            style="width: 100%;border-bottom:1px solid rgba(217,217,217,1)">
            <el-table-column prop="userName" label="账号" width="96"></el-table-column>
            <el-table-column prop="name" label="姓名" width="131"></el-table-column>
            <el-table-column prop="tel" label="联系方式" width="121"></el-table-column>
            <el-table-column prop="role" label="角色"  width="121"></el-table-column>
            <el-table-column prop="education" label="学历"  width="100"></el-table-column>
            <el-table-column prop="nation" label="民族"  width="100"></el-table-column>
            <el-table-column prop="date" sortable label="创建日期" width="131"></el-table-column>
            <el-table-column label="操作" fixed="right">
              <template slot-scope="scope">
                <div>
                  <el-button class="short_btn" size="mini" type="primary" @click="editMeth(scope.row)">
                    编辑
                  </el-button
                  ><el-button class="long_btn" size="mini" type="primary" @click="resetMeth(scope.row)">
                    重置密码
                  </el-button
                  ><el-button class="short_btn" size="mini" v-if="scope.row.role === 'administrator' ? false : true" @click="delMeth(scope.row)">
                    删除
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <pagination :paginationObj='paginationObj'></pagination>

      <!-- 新增用户dialog -->
      <el-dialog
        :close-on-click-modal="false"
        title="新增用户"
        :visible.sync="addDialogVisible"
        width="512px"
        :append-to-body="true">
        <el-form ref="add_form" v-if="addDialogVisible" :model="user_dialogData" label-width="86px" :rules="addRules">
          <el-form-item label="账号：" prop="userName">
            <el-input v-model="user_dialogData.userName" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item label="姓名：" prop="name">
            <el-input v-model="user_dialogData.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="联系方式：" prop="tel">
            <el-input v-model="user_dialogData.tel" placeholder="请输入联系方式"></el-input>
          </el-form-item>
          <el-form-item label="角色：" prop="role">
            <el-select v-model="user_dialogData.role" placeholder="请选择角色">
              <el-option label="网格员用户" value="网格员用户"></el-option>
              <el-option label="查询用户" value="查询用户"></el-option>
              <el-option label="领导" value="领导"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学历：" prop="education">
            <el-select v-model="user_dialogData.education" placeholder="请选择学历">
              <el-option 
                v-for="item in edus" 
                :key="item.id"
                :label="item.option"
                :value="item.option">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="民族：" prop="nation">
            <el-select v-model="user_dialogData.nation" placeholder="请选择民族">
              <el-option 
                v-for="item in nations" 
                :key="item.id"
                :label="item.option"
                :value="item.option">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false" class="tableBtn" size="medium" style="width:78px">取消</el-button
          ><el-button @click="addUser('add_form')" type="primary" size="medium" style="width:78px;margin-left:10px">确认</el-button>
        </span>
      </el-dialog>

      <!-- 编辑用户 -->
      <el-dialog
        :close-on-click-modal="false"
        title="编辑用户"
        :visible.sync="modDialogVisible"
        width="512px"
        :append-to-body="true">
        <el-form ref="mod_form" v-if="modDialogVisible" :model="mod_dialogData" label-width="86px" :rules="modRules">
          <el-form-item label="姓名：" prop="name">
            <el-input v-model="mod_dialogData.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="联系方式：" prop="tel">
            <el-input v-model="mod_dialogData.tel" placeholder="请输入联系方式"></el-input>
          </el-form-item>
          <el-form-item label="角色：" prop="role">
            <el-select v-model="mod_dialogData.role" placeholder="请选择角色">
              <el-option label="网格员用户" value="网格员用户"></el-option>
              <el-option label="查询用户" value="查询用户"></el-option>
              <el-option label="领导" value="领导"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学历：" prop="education">
            <el-select v-model="mod_dialogData.education" placeholder="请选择学历">
              <el-option 
                v-for="item in edus" 
                :key="item.id"
                :label="item.option"
                :value="item.option">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="民族：" prop="nation">
            <el-select v-model="mod_dialogData.nation" placeholder="请选择民族">
              <el-option 
                v-for="item in nations" 
                :key="item.id"
                :label="item.option"
                :value="item.option">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="modDialogVisible = false" class="tableBtn" size="medium" style="width:78px">取消</el-button
          ><el-button @click="modUser('mod_form')" type="primary" size="medium" style="width:78px;margin-left:10px">确认</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import pagination from '../../components/pagination/pagination'
export default {
  data() {
    return {
      // 表格数据
      tableData: [],
      loading: false,
      tableHeight: null,
      addDialogVisible: false, // 新增用户
      modDialogVisible: false, // 编辑用户
      tempRow: null, // 暂存选中的行
      tempName: '', // 暂存重置密码的用户名
      formData: {
        userName: '',
        name: '',
        role: ''
      },
      //分页
      paginationObj: {
        total: 0,
        currentPage: 1,
        pageSize: 5,
        handleCurrentChange: val => {
          this.paginationObj.currentPage = val,
          this.getUsers()
        }
      },
      user_dialogData: {
        userName: '',
        name: '',
        password: '123456',
        role: '',
        tel: 0,
        education: '',
        nation:''
      },
      mod_dialogData: {
        name: '',
        role: '',
        tel: 0,
        education: '',
        nation:''
      },
      // 新增用户规则验证
      addRules: {
        userName: [{
          validator: (rule, value, callback) => {
            for (let item in this.tableData) {
              if (value === this.tableData[item].userName) {
                callback(new Error('该账号已存在，请重新输入！'))
              }
            }
            callback()
          },
          trigger: 'blur'
        },
        { required: true, min: 1, max: 20, message: '请输入1-20字符!', trigger: 'blur' }],
        name: [{
          validator: (rule, value, callback) => {
            if ((/[\u4e00-\u9fa5]{1,20}/).test(value) === false) {
              callback(new Error('请输入1-20字符！'))
            } else {
              callback()
            }
          },
          trigger: 'blur',
          required: true
        }],
        tel: [{
          validator: (rule, value, callback) => {
            if ((/^1\d{10}$/).test(value) === false) {
              callback(new Error('请输入11位以1开头的手机号码！'))
            } else {
              callback()
            }
          },
          trigger: 'blur',
          required: true
        }],
        role: [{
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请选择新增用户角色'))
            } else {
              callback()
            }
          },
          required: true,
          trigger: 'change'
        }],
        nation: [{ required: true, message: '请选择民族', trigger: 'change' }],
        education: [{ required: true, message: '请选择最高学历', trigger: 'change' }]
      },
      // 修改用户规则验证
      modRules: {
        name: [{
          validator: (rule, value, callback) => {
            if ((/[\u4e00-\u9fa5]{1,20}/).test(value) === false) {
              callback(new Error('请输入1-20字符！'))
            } else {
              callback()
            }
          },
          trigger: 'blur',
          required: true
        }],
        tel: [{
          validator: (rule, value, callback) => {
            if ((/^1\d{10}$/).test(value) === false) {
              callback(new Error('请输入11位以1开头的手机号码！'))
            } else {
              callback()
            }
          },
          trigger: 'blur',
          required: true
        }],
        role: [{
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请选择新增用户角色'))
            } else {
              callback()
            }
          },
          required: true,
          trigger: 'change'
        }],
        nation: [{ required: true, message: '请选择民族', trigger: 'change' }],
        education: [{ required: true, message: '请选择最高学历', trigger: 'change' }]
      }
    }
  },
  components: {
    pagination
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
    this.getUsers()
  },
  mounted () {
    // 初始化页面位置
    let height = document.body.clientHeight
    this.tableHeight = height - 284 - 112 + 48 + 'px'
  },
  methods: {
    // 新增用户 密码默认为123456
    addUserdia () {
      this.user_dialogData.userName = ''
      this.user_dialogData.name = ''
      this.user_dialogData.tel = ''
      this.user_dialogData.role = ''
      this.user_dialogData.nation = ''
      this.user_dialogData.education = ''
      this.addDialogVisible = true
    },
    addUser (formName) {
      this.loginUser.operate = '用户管理-新增用户'
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post('/user/register', this.user_dialogData)
            .then((res) => {
              if (res.data.code === 200) {
                Message.success('新增成功')
                this.getUsers()
                this.writeOpLog(this.loginUser)
                this.addDialogVisible = false
              } else {
                Message.error('该账号已存在')
              }
            })
            .catch(err => {
              this.loginUser.wrongPlace = '用户管理-新增用户'
              this.loginUser.wrongInfo = String(err)
              this.writeSysLog(this.loginUser)
              console.log('发生错误', err)
            })
        } else {
          return this.$message.error('请按提示输入完整信息')
        }
      })
    },

    // 编辑用户
    editMeth (row) {
      this.tempRow = row
      this.mod_dialogData.name = row.name
      this.mod_dialogData.role = row.role
      this.mod_dialogData.tel = row.tel
      this.mod_dialogData.nation = row.nation
      this.mod_dialogData.education = row.education
      this.modDialogVisible = true
    },
    modUser (formName) {
      this.loginUser.operate = '用户管理-编辑用户'
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            userName1: this.tempRow.userName,
            name: this.mod_dialogData.name,
            tel: this.mod_dialogData.tel,
            role: this.mod_dialogData.role,
            nation: this.mod_dialogData.nation,
            education: this.mod_dialogData.education
          }
          this.$axios
            .post('/user/updateUser', params)
            .then(res => {
              if (res.data.code === 200) {
                Message.success('修改成功')
                this.getUsers()
                this.writeOpLog(this.loginUser)
                this.modDialogVisible = false
              }
            })
            .catch(err => {
              this.loginUser.wrongPlace = '用户管理-编辑用户'
              this.loginUser.wrongInfo = String(err)
              this.writeSysLog(this.loginUser)
              console.log('发生错误', err)
            })
        }
      })
    },

    // 重置密码
    resetMeth (row) {
      this.loginUser.operate = '用户管理-重置密码'
      this.$confirm(`确定要将${row.name}的密码重置为：123456吗？`, '重置密码', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          userName: row.userName,
          password: '123456'
        }
        this.$axios
          .post('/user/resetPassword', params)
          .then(res => {
            if(res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              this.writeOpLog(this.loginUser)
            }
          })
          .catch(err => {
            this.loginUser.wrongPlace = '用户管理-重置密码'
            this.loginUser.wrongInfo = String(err)
            this.writeSysLog(this.loginUser)
            console.log('发生错误', err)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消重置'
        })
      })
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
      if (this.formData.userName !== '') {query1.userName = this.formData.userName,this.paginationObj.currentPage = 1}
      if (this.formData.name !== '') {query1.name = this.formData.name,this.paginationObj.currentPage = 1}
      if (this.formData.role !== '') {query1.role = this.formData.role,this.paginationObj.currentPage = 1}
      let params = {
        currentPage: this.paginationObj.currentPage,
        pageSize: this.paginationObj.pageSize,
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
            this.paginationObj.total = res.data.totalCount
            this.loading = false
          }
        })
        .catch(res => {
          this.loginUser.wrongPlace = '用户管理-获取用户信息'
          this.loginUser.wrongInfo = String(err)
          this.writeSysLog(this.loginUser)
          console.log('发生错误', err)
        })
    },

    // 删除用户
    delMeth (row) {
      this.loginUser.operate = '用户管理-删除用户'
      this.$confirm('删除后不可恢复，确定要删除吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'delete_icon',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.$axios
          .post('/user/deleteUser', {userName: row.userName})
          .then(res => {
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getUsers()
              this.writeOpLog(this.loginUser)
            }
          })
          .catch(res => {
            this.loginUser.wrongPlace = '用户管理-删除用户'
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
    }
  }
}

</script>
<style lang='scss' scoped>
.userManage {
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
    .searchForm{
      border-radius:4px;
      height: 112px;
      background:rgba(245,245,245,1);
      opacity:1;
      margin: 0 24px 20px 24px;
      .btns{
        text-align: center;
      }
    }
  }
}
</style>

<style lang="scss">
//删除弹框 图标
.delete_icon{
  .el-message-box__message{
    > p {
      background:url('../../assets/deleteIcon.png') no-repeat left center;
      padding-left: 32px;
    }
  }
}
.userManage{
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