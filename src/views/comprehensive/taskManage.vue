<template>
  <div class="taskManage">
    <div class="taskManage_header">
      <p>任务管理</p>
    </div>
    <div class="taskManage_content">
      <div class="searchForm" style="overflow: auto">
        <el-form :inline="true" :model="formData" ref="searchForm">
          <el-form-item label="网格区域:" prop="gridRange" class="gridRange">
            <el-select v-model="formData.gridRange">
              <el-option
                v-for="item in gridRanges"
                :key="item.id"
                :label="item.option"
                :value="item.option">
              </el-option>
            </el-select>
          </el-form-item
          ><el-form-item label="任务类别:" prop="taskType" class="taskType">
            <el-select v-model="formData.taskType">
              <el-option
                v-for="item in types"
                :key="item.id"
                :label="item.option"
                :value="item.option">
              </el-option>
            </el-select>
          </el-form-item
          ><el-form-item label="网格员：" prop="gridPerson" class="gridPerson">
            <el-select v-model="formData.gridPerson">
              <el-option
                v-for="item in gridPersons"
                :key="item.id"
                :label="item.option"
                :value="item.option">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="btns">
          <el-button size="mini" @click.native="resetForm('searchForm')">重置</el-button>
          <el-button type="primary" size="mini" @click="getTasks()">查询</el-button>
        </div>
      </div>
      <el-button type="primary" size="small" style="margin-left:24px" v-if="loginUser.userName === 'manage'" @click="addTask">新建任务</el-button>

      <!-- 表格 -->
      <div class="table_pzp">
        <div class="user_tableContent">
          <el-table
            v-loading="loading"
            ref="multipleTable"
            :data="tableData"
            :header-cell-style="{'background-color':'rgba(232, 232, 232, 1)','color':'rgba(90, 90, 90, 1)'}"
            style="width: 100%;border-bottom:1px solid rgba(217,217,217,1)">
            <el-table-column prop="gridRange" label="网格区域" width="131"></el-table-column>
            <el-table-column prop="taskType" label="网格任务" width="151"></el-table-column>
            <el-table-column prop="taskAmount" label="任务数量"  width="101"></el-table-column>
            <el-table-column label="完成质量"  width="100">
              <template slot-scope="scope">
                <span class="font-size-12">
                  <span v-if="scope.row.quality === ''" style="color: red">——</span>
                  <span v-else-if="scope.row.quality === '待评估'" style="color:#D9B001">待评估</span>
                  <span v-else-if="scope.row.quality === '优'" style="color:green">优</span>
                  <span v-else-if="scope.row.quality === '良'" style="color:#D9B001">良</span>
                  <span v-else style="color:red">差</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="任务进展"  width="100">
              <template slot-scope="scope">
                <span class="font-size-12">
                  <span v-if="scope.row.process === ''" style="color: red">未分配</span>
                  <span v-else-if="scope.row.process === '未确认'" style="color:#DD3E37">未确认</span>
                  <span v-else-if="scope.row.process === '进行中'" style="color:#6AA2EF">进行中</span>
                  <span v-else style="color:green">已完成</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="核实状态"  width="100">
              <template slot-scope="scope">
                <span class="font-size-12">
                  <span v-if="scope.row.checked === ''" style="color: red">——</span>
                  <span v-else-if="scope.row.checked === '未审核'" style="color:#D9B001">未审核</span>
                  <span v-else style="color:green">已审核</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="负责人员" width="101">
              <template slot-scope="scope">
                <span class="font-size-12">
                  <span v-if="scope.row.gridPerson === ''" style="color: red">未指派</span>
                  <span v-else style="color:black">{{scope.row.gridPerson}}</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right">
              <template slot-scope="scope">
                <div>
                  <el-button size="mini" type="primary" v-if="scope.row.gridPerson === '' && loginUser.userName === 'manage'" @click="assignTask(scope.row)">
                    任务指派
                  </el-button
                  ><el-button size="mini" type="primary" v-if="scope.row.process == '未确认' && loginUser.name === scope.row.gridPerson" @click="startTask(scope.row)">
                    接收任务
                  </el-button
                  ><el-button size="mini" type="primary" v-if="scope.row.process === '未确认' && loginUser.userName === 'manage'" @click="recall(scope.row)">
                    撤回任务
                  </el-button
                  ><el-button size="mini" type="primary" v-if="scope.row.process == '进行中' && loginUser.name === scope.row.gridPerson" @click="finishTask(scope.row)">
                    申报审核
                  </el-button
                  ><el-button size="mini" type="primary" v-if="scope.row.process === '已完成' && loginUser.userName === 'manage'" @click="judgeTask(scope.row)">
                    任务审核
                  </el-button
                  ><el-button size="mini" @click="modTask(scope.row)">
                    详情
                  </el-button
                  ><el-button size="mini" v-if="loginUser.userName === 'manage'" @click="delMeth(scope.row)">
                    删除
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <pagination :paginationObj='paginationObj'></pagination>

      <!-- 新建任务dialog -->
      <el-dialog
        :close-on-click-modal="false"
        title="新建任务"
        :visible.sync="addDialogVisible"
        width="512px"
        :append-to-body="true">
        <el-form ref="add_form" v-if="addDialogVisible" :model="user_dialogData" label-width="90px" :rules="addRules">
          <el-form-item label="网格区域：" prop="gridRange">
            <el-select v-model="user_dialogData.gridRange">
              <el-option
                v-for="item in gridRanges"
                :key="item.id"
                :label="item.option"
                :value="item.option">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="网格任务：" prop="taskType">
            <el-select v-model="user_dialogData.taskType">
              <el-option
                v-for="item in types"
                :key="item.id"
                :label="item.option"
                :value="item.option">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务数量：" prop="taskAmount">
            <el-input v-model.number="user_dialogData.taskAmount" placeholder="请输入任务量"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false" class="tableBtn" size="medium" style="width:78px">取消</el-button
          ><el-button @click="addTaskFinal('add_form')" type="primary" size="medium" style="width:78px;margin-left:10px">确认</el-button>
        </span>
      </el-dialog>

      <!-- 任务指派dialog -->
      <el-dialog
        :close-on-click-modal="false"
        title="任务指派"
        :visible.sync="modDialogVisible"
        width="512px"
        :append-to-body="true">
        <el-form ref="mod_form" v-if="modDialogVisible" :model="mod_dialogData" label-width="90px" :rules="modRules">
          <el-form-item label="网格区域：" prop="gridRange">
            <el-select v-model="mod_dialogData.gridRange">
              <el-option
                v-for="item in gridRanges"
                :key="item.id"
                :label="item.option"
                :value="item.option">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="网格任务：" prop="taskType">
            <el-select v-model="mod_dialogData.taskType">
              <el-option
                v-for="item in types"
                :key="item.id"
                :label="item.option"
                :value="item.option">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务数量：" prop="taskAmount">
            <el-input v-model.number="mod_dialogData.taskAmount" placeholder="请输入任务量"></el-input>
          </el-form-item>
          <el-form-item label="负责人员：" prop="gridPerson">
            <el-select v-model="mod_dialogData.gridPerson">
              <el-option
                v-for="item in gridPersons"
                :key="item.id"
                :label="item.option"
                :value="item.option">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="modDialogVisible = false" class="tableBtn" size="medium" style="width:78px">取消</el-button
          ><el-button @click="assignTaskFinal('mod_form')" type="primary" size="medium" style="width:78px;margin-left:10px">确认</el-button>
        </span>
      </el-dialog>

      <!-- 任务审核dialog -->
      <el-dialog
        :close-on-click-modal="false"
        title="任务审核"
        :visible.sync="judgeDialogVisible"
        width="512px"
        :append-to-body="true">
        <el-form ref="jud_form" v-if="judgeDialogVisible" :model="jud_dialogData" label-width="90px" :rules="judRules">
          <el-form-item label="完成质量：" prop="quality">
            <el-select v-model="jud_dialogData.quality">
              <el-option label="优" value="优"></el-option>
              <el-option label="良" value="良"></el-option>
              <el-option label="差" value="差"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="judgeDialogVisible = false" class="tableBtn" size="medium" style="width:78px">取消</el-button
          ><el-button @click="judgeTaskFinal('jud_form')" type="primary" size="medium" style="width:78px;margin-left:10px">确认</el-button>
        </span>
      </el-dialog>

      <!-- 详情dialog -->
      <el-dialog
        :close-on-click-modal="false"
        title="任务详情"
        :visible.sync="detailDialogVisible"
        width="512px"
        :append-to-body="true">
        <el-form ref="detail_form" v-if="detailDialogVisible" :model="detail_dialogData" label-width="90px" :rules="modRules">
          <el-form-item label="网格区域：" prop="gridRange">
            <el-select v-model="detail_dialogData.gridRange" :disabled="loginUser.role !== 'gridManager'">
              <el-option
                v-for="item in gridRanges"
                :key="item.id"
                :label="item.option"
                :value="item.option">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="网格任务：" prop="taskType">
            <el-select v-model="detail_dialogData.taskType" :disabled="loginUser.role !== 'gridManager'">
              <el-option
                v-for="item in types"
                :key="item.id"
                :label="item.option"
                :value="item.option">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务数量：" prop="taskAmount">
            <el-input v-model.number="detail_dialogData.taskAmount" placeholder="请输入任务量" :disabled="loginUser.role !== 'gridManager'"></el-input>
          </el-form-item>
          <el-form-item label="负责人员：" prop="gridPerson">
            <el-select v-model="detail_dialogData.gridPerson" :disabled="loginUser.role !== 'gridManager'">
              <el-option
                v-for="item in gridPersons"
                :key="item.id"
                :label="item.option"
                :value="item.option">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="detailDialogVisible = false" class="tableBtn" size="medium" style="width:78px">取消</el-button
          ><el-button @click="modTaskFinal('detail_form')" type="primary" size="medium" style="width:78px;margin-left:10px">确认</el-button>
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
      tempRow: '',
      addDialogVisible: false, // 新建任务dia
      modDialogVisible: false, // 任务指派dia
      judgeDialogVisible: false, // 任务审核dia
      detailDialogVisible: false, // 详情dia
      tempQuality: '',
      tempProcess: '',
      tempChecked: '',
      formData: {
        gridRange: '',
        taskType: '',
        gridPerson: ''
      },
      //分页
      paginationObj: {
        total: 0,
        currentPage: 1,
        pageSize: 5,
        handleCurrentChange: val => {
          this.paginationObj.currentPage = val,
          this.getTasks()
        }
      },
      user_dialogData: {
        gridRange: '',
        taskType: '',
        taskAmount: '',
        quality: '',
        process: '',
        checked: '',
        gridPerson: ''
      },
      mod_dialogData: {
        gridRange: '',
        taskType: '',
        taskAmount: '',
        gridPerson: ''
      },
      detail_dialogData: {
        gridRange: '',
        taskType: '',
        taskAmount: '',
        gridPerson: ''
      },
      jud_dialogData: {
        quality: ''
      },
      // 新增任务规则验证
      addRules: {
        gridRange: [{ required: true, message: '请选择网格区域!', trigger: 'change' }],
        taskType: [{ required: true, message: '请选择网格任务!', trigger: 'change' }],
        taskAmount: [{ required: true, type: 'number', message: '请输入任务量（数字）', trigger: 'blur' }]
      },
      // 任务指派规则验证
      modRules: {
        gridRange: [{ required: true, message: '请选择网格区域!', trigger: 'change' }],
        taskType: [{ required: true, message: '请选择网格任务!', trigger: 'change' }],
        taskAmount: [{ required: true, type: 'number', message: '请输入任务量（数字）', trigger: 'blur' }],
        gridPerson: [{ required: true, message: '请指派负责人员!', trigger: 'change' }]
      },
      judRules: {
        quality: [{ required: true, message: '审核该网格员完成任务的质量!', trigger: 'change' }]
      }
    }
  },
  components: {
    pagination
  },
  computed: {
    types() {
      return this.$store.getters.gettypes
    },
    gridPersons () {
      return this.$store.getters.getgrids
    },
    loginUser() {
      return this.$store.getters.getLoginUser
    },
    gridRanges() {
      return this.$store.getters.getgridInfo
    }
  },
  created() {
    this.getTasks()
  },
  methods: {
    // 新键任务
    addTask () {
      this.user_dialogData.gridRange = ''
      this.user_dialogData.taskType = ''
      this.user_dialogData.taskAmount = ''
      this.addDialogVisible = true
    },
    addTaskFinal (formName) {
      this.loginUser.operate = '综治管理-新建任务'
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post('/task/addTask', this.user_dialogData)
            .then((res) => {
              if (res.data.code === 200) {
                Message.success('新增成功')
                this.getTasks()
                this.writeOpLog(this.loginUser)
                this.addDialogVisible = false
              }
            })
            .catch(err => {
              this.loginUser.wrongPlace = '综治管理-新建任务'
              this.loginUser.wrongInfo = String(err)
              this.writeSysLog(this.loginUser)
              console.log('发生错误', err)
            })
        } else {
          return this.$message.error('请按提示输入完整信息')
        }
      })
    },

    // 任务指派
    assignTask (row) {
      this.mod_dialogData.gridRange = row.gridRange
      this.mod_dialogData.taskType = row.taskType
      this.mod_dialogData.gridPerson = ''
      this.mod_dialogData.taskAmount = Number(row.taskAmount)
      this.tempRow = row
      this.modDialogVisible = true
    },
    assignTaskFinal (formName) {
      this.loginUser.operate = '综治管理-任务指派'
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            id: JSON.parse(JSON.stringify(this.tempRow._id)),
            quality: '待评估',
            process: '未确认',
            checked: '未审核',
            gridRange: this.mod_dialogData.gridRange,
            taskType: this.mod_dialogData.taskType,
            taskAmount: this.mod_dialogData.taskAmount,
            gridPerson: this.mod_dialogData.gridPerson
          }
          this.$axios
            .post('/task/assignTask', params)
            .then(res => {
              if (res.data.code === 200) {
                Message.success('指派成功')
                this.getTasks()
                this.writeOpLog(this.loginUser)
                this.modDialogVisible = false
              }
            })
            .catch(err => {
              this.loginUser.wrongPlace = '综治管理-任务指派'
              this.loginUser.wrongInfo = String(err)
              this.writeSysLog(this.loginUser)
              console.log('发生错误', err)
            })
        }
      })
    },
    
    // 任务详情
    modTask (row) {
      this.tempProcess = row.process
      this.tempChecked = row.checked
      this.tempQuality = row.quality
      this.detail_dialogData.gridRange = row.gridRange
      this.detail_dialogData.taskType = row.taskType
      this.detail_dialogData.gridPerson = row.gridPerson
      this.detail_dialogData.taskAmount = Number(row.taskAmount)
      this.tempRow = row
      this.detailDialogVisible = true
    },
    modTaskFinal (formName) {
      this.loginUser.operate = '综治管理-任务详情修改'
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.loginUser.role === 'gridManager') {
            let params = {
              id: JSON.parse(JSON.stringify(this.tempRow._id)),
              quality: this.tempQuality,
              process: this.tempProcess,
              checked: this.tempChecked,
              gridRange: this.detail_dialogData.gridRange,
              taskType: this.detail_dialogData.taskType,
              taskAmount: this.detail_dialogData.taskAmount,
              gridPerson: this.detail_dialogData.gridPerson
            }
            this.$axios
              .post('/task/assignTask', params)
              .then(res => {
                if (res.data.code === 200) {
                  Message.success('修改成功')
                  this.getTasks()
                  this.writeOpLog(this.loginUser)
                  this.detailDialogVisible = false
                }
              })
              .catch(err => {
                this.loginUser.wrongPlace = '综治管理-任务详情'
                this.loginUser.wrongInfo = String(err)
                this.writeSysLog(this.loginUser)
                console.log('发生错误', err)
              })
          } else {
            this.detailDialogVisible = false
          }
        }
      })
    },

    // 任务审核
    judgeTask(row) {
      this.jud_dialogData.quality = ''
      this.tempRow = row
      this.judgeDialogVisible = true
    },
    judgeTaskFinal (formName) {
      this.loginUser.operate = '综治管理-任务审核'
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            id: JSON.parse(JSON.stringify(this.tempRow._id)),
            quality: this.jud_dialogData.quality,
            process: this.tempRow.process,
            checked: '已审核',
            gridRange: this.tempRow.gridRange,
            taskType: this.tempRow.taskType,
            taskAmount: this.tempRow.taskAmount,
            gridPerson: this.tempRow.gridPerson
          }
          this.$axios
            .post('/task/assignTask', params)
            .then(res => {
              if (res.data.code === 200) {
                Message.success('审核成功')
                this.getTasks()
                this.writeOpLog(this.loginUser)
                this.judgeDialogVisible = false
              }
            })
        }
      })
    },

    // 任务撤回
    recall(row) {
      this.loginUser.operate = '综治管理-任务撤回'
      this.$alert('确认撤回此任务？', '撤回任务', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
          let params = {
            id: JSON.parse(JSON.stringify(row._id)),
            quality: '',
            process: '',
            checked: '',
            gridRange: row.gridRange,
            taskType: row.taskType,
            taskAmount: row.taskAmount,
            gridPerson: ''
          }
          this.$axios
            .post('/task/assignTask', params)
            .then(res => {
              if (res.data.code === 200) {
                Message.success('撤回成功')
                this.getTasks()
                this.writeOpLog(this.loginUser)
                this.modDialogVisible = false
              }
            })
        })
    },

    // 接收任务
    startTask(row) {
      this.loginUser.operate = '综治管理-接收任务'
      this.$alert('请确认接收此任务并尽快完成，确认后无法退回该任务，如需退回请联系管理员', '接收任务', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
          let params = {
            id: JSON.parse(JSON.stringify(row._id)),
            quality: '待评估',
            process: '进行中',
            checked: '未审核',
            gridRange: row.gridRange,
            taskType: row.taskType,
            taskAmount: row.taskAmount,
            gridPerson: row.gridPerson
          }
          this.$axios
            .post('/task/assignTask', params)
            .then(res => {
              if (res.data.code === 200) {
                Message.success('接收成功，请尽快完成')
                this.getTasks()
                this.writeOpLog(this.loginUser)
                this.modDialogVisible = false
              }
            })
        })
    },

    // 完成任务
    finishTask(row) {
      this.loginUser.operate = '综治管理-完成任务'
      this.$alert('确认完成任务，等待接受审核？', '完成任务', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
          let params = {
            id: JSON.parse(JSON.stringify(row._id)),
            quality: '待评估',
            process: '已完成',
            checked: '未审核',
            gridRange: row.gridRange,
            taskType: row.taskType,
            taskAmount: row.taskAmount,
            gridPerson: row.gridPerson
          }
          this.$axios
            .post('/task/assignTask', params)
            .then(res => {
              if (res.data.code === 200) {
                Message.success('确认成功，请耐心等待')
                this.getTasks()
                this.writeOpLog(this.loginUser)
                this.modDialogVisible = false
              }
            })
        })
    },

    // 表单重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.getTasks()
    },
    // 获取任务列表
    getTasks () {
      let query1 = {}
      if (this.formData.gridRange === '' && this.formData.taskType === '' && this.formData.gridPerson === '') query1 = {}
      if (this.formData.gridRange !== '') {query1.gridRange = this.formData.gridRange}
      if (this.formData.taskType !== '') {query1.taskType = this.formData.taskType}
      if (this.formData.gridPerson !== '') {query1.gridPerson = this.formData.gridPerson}
      let params = {
        currentPage: this.paginationObj.currentPage,
        pageSize: this.paginationObj.pageSize,
        query: query1
      }
      this.loading = true
      this.$axios
        .post('/task/getTasks', params)
        .then(res => {
          if (res.data.code === 200) {
            this.tableData = res.data.task
            this.paginationObj.total = res.data.totalCount
            this.loading = false
          }
        })
        .catch(res => {
          this.loginUser.wrongPlace = '任务管理-获取任务列表'
          this.loginUser.wrongInfo = String(err)
          this.writeSysLog(this.loginUser)
          console.log('发生错误', err)
        })
    },

    // 删除任务
    delMeth (row) {
      this.loginUser.operate = '任务管理-删除任务'
      this.$confirm('删除后不可恢复，确定要删除吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'delete_icon',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.$axios
          .post('/task/deleteTask', {id: JSON.parse(JSON.stringify(row._id))})
          .then(res => {
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getTasks()
              this.writeOpLog(this.loginUser)
            }
          })
          .catch(res => {
            this.loginUser.wrongPlace = '综治管理-删除任务'
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
.taskManage {
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
      height: 106px;
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
      // color: rgb(60, 255, 0);
    }
  }
}
.taskManage{
  &_content{
    .searchForm {
      .el-form-item {
        margin-left: 28px;
        margin-top: 12px;
        margin-bottom: 12px;
      }
      .el-input__inner {
        width: 270px;
        height: 32px;
      }
      .gridPerson .el-input__inner {
        width: 180px;
      }
    }
  }
}
</style>