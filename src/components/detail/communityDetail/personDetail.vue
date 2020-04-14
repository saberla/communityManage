<template>
  <div class="person">
    <div class="addPerson">
      <el-button type="primary" size="mini" style="margin-left:24px" @click="addPerson">人员建档</el-button>
    </div>
    <!-- 表格 -->
    <div class="table_pzp">
      <div class="user_tableContent">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="tableData"
          :header-cell-style="{'background-color':'rgba(232, 232, 232, 1)','color':'rgba(90, 90, 90, 1)'}"
          style="width: 100%;border-bottom:1px solid rgba(217,217,217,1)">
          <el-table-column prop="personName" label="姓名" width="156"></el-table-column>
          <el-table-column prop="personSex" label="性别" width="131"></el-table-column>
          <el-table-column prop="personTel" label="联系方式" width="199"></el-table-column>
          <el-table-column prop="personAdd" label="住址" width="131"></el-table-column>
          <el-table-column prop="date" label="建档日期" width="166"></el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <div>
                <el-button size="mini" type="primary" @click="modPerson(scope.row)">编辑</el-button>
                <el-button size="mini" type="primary" @click="delMeth(scope.row)">移除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <pagination :paginationObj='paginationObj'></pagination>

    <!-- 人员建档dialog -->
    <el-dialog
      :close-on-click-modal="false"
      title="人员建档"
      :visible.sync="addDialogVisible"
      width="512px"
      :append-to-body="true">
      <el-form ref="add_form" v-if="addDialogVisible" :model="add_dialogData" label-width="86px" :rules="addRules">
        <el-form-item label="小区名：" prop="communityName">
          <el-input v-model="add_dialogData.communityName" disabled :placeholder="mainPage.communityName"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="personName">
          <el-input v-model="add_dialogData.personName" placeholder="请输入人员姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别：" prop="personSex">
          <el-select v-model="add_dialogData.personSex" placeholder="请选择人员性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式：" prop="personTel">
          <el-input v-model="add_dialogData.personTel" placeholder="请输入人员联系方式"></el-input>
        </el-form-item>
        <el-form-item label="住址：" prop="personAdd">
          <el-input v-model="add_dialogData.personAdd" placeholder="请输入人员住址"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" class="tableBtn" size="medium" style="width:78px">取消</el-button
        ><el-button @click="addPersonFinal('add_form')" type="primary" size="medium" style="width:78px;margin-left:10px">确认</el-button>
      </span>
    </el-dialog>

    <!-- 编辑人员dialog -->
    <el-dialog
      :close-on-click-modal="false"
      title="人员编辑"
      :visible.sync="modDialogVisible"
      width="512px"
      :append-to-body="true">
      <el-form ref="mod_form" v-if="modDialogVisible" :model="mod_dialogData" label-width="86px" :rules="modRules">
        <el-form-item label="小区名：" prop="communityName">
          <el-input v-model="mod_dialogData.communityName" disabled :placeholder="mainPage.communityName"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="personName">
          <el-input v-model="mod_dialogData.personName" placeholder="请输入人员姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别：" prop="personSex">
          <el-select disabled v-model="mod_dialogData.personSex" placeholder="请选择人员性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式：" prop="personTel">
          <el-input v-model="mod_dialogData.personTel" placeholder="请输入人员联系方式"></el-input>
        </el-form-item>
        <el-form-item label="住址：" prop="personAdd">
          <el-input v-model="mod_dialogData.personAdd" placeholder="请输入人员住址"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modDialogVisible = false" class="tableBtn" size="medium" style="width:78px">取消</el-button
        ><el-button @click="modPersonFinal('mod_form')" type="primary" size="medium" style="width:78px;margin-left:10px">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
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
        personName: '',
        personAdd: '',
        personTel: '',
        personSex: ''
      },
      mod_dialogData: {
        communityName: '',
        personName: '',
        personAdd: '',
        personTel: '',
        personSex: ''
      },
      tableData: [],
      loading: false,
      //分页
      paginationObj: {
        total: 0,
        currentPage: 1,
        pageSize: 3,
        handleCurrentChange: (val) => {
          this.paginationObj.currentPage = val
          this.getPerons()
        }
      },

      //人员建档验证规则
      addRules: {
        personName: [{ required: true, min: 1, max: 29, message: '请输入人员姓名!', trigger: 'blur' }],
        personSex: [{ required: true, message: '请选择人员性别!', trigger: 'blur' }],
        personTel: [{
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
        personAdd: [{ required: true, min: 1, max: 29, message: '请输入人员住址!', trigger: 'blur' }]
      },
      modRules: {
        personName: [{ required: true, min: 1, max: 29, message: '请输入人员姓名!', trigger: 'blur' }],
        personTel: [{
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
        personAdd: [{ required: true, min: 1, max: 29, message: '请输入人员住址!', trigger: 'blur' }]
      },
    }
  },
  props: {
    mainPage: Object
  },
  components:{
    pagination
  },
  
  created() {
    this.getPerons()
  },

  computed: {
    loginUser() {
      return this.$store.getters.getLoginUser
    }
  },
  methods: {
    // 获取当前小区的人员信息
    getPerons () {
      let params = {
        communityName: this.mainPage.communityName,
        pageSize: this.paginationObj.pageSize,
        currentPage: this.paginationObj.currentPage
      }
      this.loading = true
      this.$axios
        .post('/persons/getPersons', params)
        .then(res => {
          if (res.data.code === 200) {
            this.loading = false
            res.data.person.forEach((el, index) => {
              let newDate = new Date(el.date)
              el.date = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate()
            })
            this.tableData = res.data.person
            this.paginationObj.total = res.data.totalCount
            this.$emit('personTotal', this.paginationObj.total)
          }
        })
        .catch(err => {console.log('saber发生错误:', err)})
    },

    // 人员建档
    addPerson () {
      this.add_dialogData.personName = ''
      this.add_dialogData.personTel = ''
      this.add_dialogData.personAdd = ''
      this.add_dialogData.personSex = ''
      this.addDialogVisible = true
    },
    addPersonFinal (formName) {
      this.loginUser.operate = '小区治理-人员建档'
      let params = {
        communityName: this.mainPage.communityName,
        personAdd: this.add_dialogData.personAdd,
        personName: this.add_dialogData.personName,
        personTel: this.add_dialogData.personTel,
        personSex: this.add_dialogData.personSex
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios 
            .post('/persons/addperson', params)
            .then(res => {
              if (res.data.code === 200) {
                Message.success('人员建档成功')
                this.getPerons()
                this.addDialogVisible = false
                this.writeOpLog(this.loginUser)
              }
            })
            .catch(err => {console.log('错误', err)})
        }
      })
    },

    // 编辑人员
    modPerson (row) {
      this.tempId = JSON.parse(JSON.stringify(row._id))
      this.mod_dialogData.personName = row.personName
      this.mod_dialogData.personSex = row.personSex
      this.mod_dialogData.personTel = row.personTel
      this.mod_dialogData.personAdd = row.personAdd
      this.modDialogVisible = true
    },
    modPersonFinal (formName) {
      this.loginUser.operate = '小区治理-修改人员信息'
      let params = {
        communityName: this.mainPage.communityName,
        personName: this.mod_dialogData.personName,
        personAdd: this.mod_dialogData.personAdd,
        personTel: this.mod_dialogData.personTel,
        id: this.tempId
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios 
            .post('/persons/modPerson', params)
            .then(res => {
              if (res.data.code === 200) {
                Message.success('修改信息成功')
                this.getPerons()
                this.modDialogVisible = false
                this.writeOpLog(this.loginUser)
              } 
            })
            .catch(err => {console.log('错误：', err)})
        }
      })
    },

    // 删除人员
    delMeth (row) {
      this.loginUser.operate = '小区治理-删除人员'
      this.$confirm('删除后不可恢复，确定要删除吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'delete_icon',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.$axios
          .post('/persons/delPerson', {communityName: row.communityName, id: JSON.parse(JSON.stringify(row._id))})
          .then(res => {
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.paginationObj.currentPage = 1
              this.getPerons()
              this.writeOpLog(this.loginUser)
            }
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