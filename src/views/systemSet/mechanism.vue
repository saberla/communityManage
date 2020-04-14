<template>
  <div class="mechanism">
    <div class="mechanism_header">
      <p>机构管理</p>
    </div>
    <div class="mechanism_content">
      <div class="mainPage" v-if="detailState">
        <div class="jiedaoban">
          <h3>新都区街道办事处</h3>
        </div>
        <div class="str_btn" style="margin-left:24px;margin-top:12px;margin-bottom:12px">
          <el-button type="primary" size="mini" @click="addStreet()">新增</el-button>
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
              <el-table-column prop="indexNum" label="信息索取号" width="199"></el-table-column>
              <el-table-column prop="mechaName" label="信息标题" show-overflow-tooltip width="199"></el-table-column>
              <el-table-column prop="responsibility" label="责任单位" width="121"></el-table-column>
              <el-table-column prop="chargePerson" label="主要负责人"  width="100"></el-table-column>
              <el-table-column prop="date" label="填报时间" width="131"></el-table-column>
              <el-table-column label="操作" fixed="right">
                <template slot-scope="scope">
                  <div>
                    <el-button class="short_btn" size="mini" type="primary" @click="editMeth(scope.row)">
                      编辑
                    </el-button
                    ><el-button class="long_btn" size="mini" @click="openDetail(scope.row)">
                      详情
                    </el-button
                    ><el-button class="short_btn" size="mini" @click="delMeth(scope.row)">
                      删除
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 新增街道办dialog -->
        <el-dialog
          :close-on-click-modal="false"
          title="新增街道办"
          :visible.sync="addDialogVisible"
          width="512px"
          :append-to-body="true">
          <el-form ref="add_form" v-if="addDialogVisible" :model="street_dialogData" label-width="126px" :rules="addRules">
            <el-form-item label="信息索引号：" prop="indexNum">
              <el-input v-model="street_dialogData.indexNum" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item label="信息标题：" prop="mechaName">
              <el-input v-model="street_dialogData.mechaName" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="责任单位：" prop="responsibility">
              <el-input v-model="street_dialogData.responsibility" placeholder="请输入联系方式"></el-input>
            </el-form-item>
            <el-form-item label="主要负责人：" prop="chargePerson">
              <el-input v-model="street_dialogData.chargePerson" placeholder="请输入主要负责人"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false" class="tableBtn" size="medium" style="width:78px">取消</el-button
            ><el-button @click="addStreetFinal('add_form')" type="primary" size="medium" style="width:78px;margin-left:10px">确认</el-button>
          </span>
        </el-dialog>

        <!-- 编辑街道办dialog -->
        <el-dialog
          :close-on-click-modal="false"
          title="编辑街道办"
          :visible.sync="modDialogVisible"
          width="512px"
          :append-to-body="true">
          <el-form ref="mod_form" v-if="modDialogVisible" :model="mod_dialogData" label-width="126px" :rules="modRules">
            <el-form-item label="信息索引号：" prop="indexNum">
              <el-input v-model="mod_dialogData.indexNum" disabled placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item label="信息标题：" prop="mechaName">
              <el-input v-model="mod_dialogData.mechaName" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="责任单位：" prop="responsibility">
              <el-input v-model="mod_dialogData.responsibility" placeholder="请输入联系方式"></el-input>
            </el-form-item>
            <el-form-item label="主要负责人：" prop="chargePerson">
              <el-input v-model="mod_dialogData.chargePerson" placeholder="请输入主要负责人"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="modDialogVisible = false" class="tableBtn" size="medium" style="width:78px">取消</el-button
            ><el-button @click="modStreetFinal('mod_form')" type="primary" size="medium" style="width:78px;margin-left:10px">确认</el-button>
          </span>
        </el-dialog>
      </div>
      <detailPage v-if="!detailState" @setValue='getDetailValue' :mainPage='mainPageValue'></detailPage>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import detailPage from '../../components/detail/mechanismDetail'
export default {
  data () {
    return {
      loading: false,
      tableData: [],
      addDialogVisible: false,
      modDialogVisible: false,
      tempIndexNum: '',
      detailState: true,
      mainPageValue: {},
      street_dialogData: {
        indexNum: '',
        mechaName: '',
        responsibility: '',
        chargePerson: ''
      },
      mod_dialogData: {
        indexNum: '',
        mechaName: '',
        responsibility: '',
        chargePerson: ''
      },
      // 新增验证规则
      addRules: {
        indexNum: [{
          validator: (rule, value, callback) => {
            for (let item in this.tableData) {
              if (value === this.tableData[item].indexNum) {
                callback(new Error('该索引号已存在，请重新输入！'))
              }
            }
            callback()
          },
          trigger: 'blur'
        },
        { required: true, min: 1, max: 29, message: '请输入信息索引号!', trigger: 'blur' }],
        mechaName: [{
          validator: (rule, value, callback) => {
            if ((/[\u4e00-\u9fa5]{1,29}/).test(value) === false) {
              callback(new Error('请输入1-29字符！'))
            } else {
              callback()
            }
          },
          trigger: 'blur',
          required: true
        }],
        responsibility: [
          { required: true, min: 1, max: 29, message: '请输入1-29字符!', trigger: 'blur' }
        ],
        chargePerson: [{ required: true, message: '请输入主要负责人', trigger: 'blur' }]
      },
      // 新增验证规则
      modRules: {
        mechaName: [{
          validator: (rule, value, callback) => {
            if ((/[\u4e00-\u9fa5]{1,29}/).test(value) === false) {
              callback(new Error('请输入1-29字符！'))
            } else {
              callback()
            }
          },
          trigger: 'blur',
          required: true
        }],
        responsibility: [
          { required: true, min: 1, max: 29, message: '请输入1-29字符!', trigger: 'blur' }
        ],
        chargePerson: [{ required: true, message: '请输入主要负责人', trigger: 'blur' }]
      },
    }
  },
  components: {
    detailPage
  },
  created() {
    this.getStreets()
  },
  computed: {
    loginUser() {
      return this.$store.getters.getLoginUser
    }
  },
  methods: {
    // 打开详情页
    openDetail(row) {
      let obj = {
        mechaName: row.mechaName,
        reportTime: row.date,
        responsibility: row.responsibility,
        chargePerson: row.chargePerson,
        officeTel: row.insideData[0].officeTel,
        officeAdd: row.insideData[0].officeAdd,
        peopleDuty: row.insideData[0].peopleDuty,
        streetDuty: row.insideData[0].streetDuty
      }
      this.mainPageValue = obj
      this.detailState = false
    },
    // 获取街道办信息
    getStreets () {
      this.$axios
        .post('/Streets/getStreets', {})
        .then(res => {
          if (res.data.code === 200) {
            res.data.str.forEach((el,index) => {
              let dateNow = new Date(el.date)
              el.date = dateNow.getFullYear() + '-' + (dateNow.getMonth() + 1) + '-' +dateNow.getDate()
            })
            this.tableData = res.data.str
          }
        })
    },
    // 新增街道办
    addStreet () {
      this.street_dialogData.indexNum = ''
      this.street_dialogData.mechaName = ''
      this.street_dialogData.responsibility = ''
      this.street_dialogData.chargePerson = ''
      this.addDialogVisible = true
    },
    addStreetFinal (formName) {
      let params = {
        indexNum: this.street_dialogData.indexNum,
        mechaName: this.street_dialogData.mechaName,
        responsibility: this.street_dialogData.responsibility,
        chargePerson: this.street_dialogData.chargePerson
      }
      this.loginUser.operate = '机构管理-新增街道办'
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post('/Streets/addStreet', params)
            .then(res => {
              if (res.data.code === 200) {
                this.getStreets()
                this.addDialogVisible =  false
                Message.success('新增成功')
                this.writeOpLog(this.loginUser)
              }
            })
        }
      })
    },

    // 编辑街道办
    editMeth(row) {
      this.mod_dialogData.indexNum = row.indexNum
      this.mod_dialogData.mechaName = row.mechaName
      this.mod_dialogData.responsibility = row.responsibility
      this.mod_dialogData.chargePerson = row.chargePerson
      this.tempIndexNum = row.indexNum
      this.modDialogVisible = true
    },
    modStreetFinal (formName) {
      this.loginUser.operate = '机构管理-编辑街道办'
      let params = {
        indexNum1: this.tempIndexNum,
        indexNum: this.mod_dialogData.indexNum,
        mechaName: this.mod_dialogData.mechaName,
        responsibility: this.mod_dialogData.responsibility,
        chargePerson: this.mod_dialogData.chargePerson
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post('/Streets/modStreets', params)
            .then(res => {
              if (res.data.code === 200) {
                this.modDialogVisible = false
                this.getStreets()
                Message.success('修改成功')
                this.writeOpLog(this.loginUser)
              }
            })
        }
      })
    },

    // 删除街道办
    delMeth (row) {
      this.loginUser.operate = '机构管理-删除街道办'
      this.$confirm('删除后不可恢复，确定要删除吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'delete_icon',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.$axios
          .post('/Streets/deleStreet', {indexNum: row.indexNum})
          .then(res => {
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getStreets()
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

    //获取子组件数据
    getDetailValue(value) {
      this.detailState = value
    }
  }
}

</script>
<style lang='scss' scoped>
.mechanism{
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
    .jiedaoban{
      margin-left: 24px;
      margin-right: 24px;
      background-color: rgba(245,245,245,1);
      border-radius: 4px;
      height: 38px;
      h3{
        line-height: 38px;
      }
    }
  }
}
</style>