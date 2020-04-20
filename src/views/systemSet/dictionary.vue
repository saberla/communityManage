<template>
  <div class="dictionary">
    <div class="dictionary_header">
      <p>字典维护</p>
    </div>
    <div class="dictionary_content">
      <el-button type="primary" size="small" style="margin-left:24px;margin-top:12px" @click="addDic">新增字典</el-button>
      <div class="table_pzp">
        <el-table
          v-loading="loading"
          element-loading-spinner="el-icon-loading"
          element-loading-text="拼命加载中"
          :data="tableData"
          @expand-change = 'expandMethod'
          style="width: 100%;border-bottom:1px solid rgba(217,217,217,1)"
          :header-cell-style="{'background-color':'rgba(232, 232, 232, 1)','color':'rgba(90, 90, 90, 1)'}">
          <el-table-column type="expand" prop="insideData">
            <template slot-scope="scope">
              <div class="insideTableContainer">
                <div class="insideTableContainer_h">
                  <p>数据字典明细</p>
                  <!-- 按钮组 -->
                  <el-button type="primary" size="small" style="padding-left:14px;padding-right:14px" @click="addDicDetail(scope.row)">新增字典明细</el-button>
                </div>
                <div class="insideTableContainer_c">
                  <!-- 表格 -->
                  <div class="table_pzp">
                    <el-table
                      :data="scope.row.insideData"
                      :header-cell-style="{'background-color':'rgba(232, 232, 232, 1)','color':'rgba(90, 90, 90, 1)'}"
                      style="width: 100%;border-bottom:1px solid rgba(217,217,217,1)">
                      <el-table-column type="index" label="排序" width="300"></el-table-column>
                      <el-table-column prop="option" label="选项名称" width="300"></el-table-column>
                      <el-table-column label="操作">
                        <template slot-scope="scope">
                          <el-button type="primary" size="mini" @click="modDetail(scope.row)">修改</el-button
                          ><el-button size="mini" @click="deleteDetail(scope.row)">删除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="序号" type="index" width="216"></el-table-column>
          <el-table-column label="字典名称" prop="dictionaryName" width="216"></el-table-column>
          <el-table-column label="字典类型" prop="dictionaryType" width="216"></el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="modDic(scope.row)">修改</el-button
              ><el-button size="mini" @click="deleteDic(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 新增字典dialog -->
      <el-dialog
        :close-on-click-modal="false"
        title="新增字典"
        :visible.sync="addDialogVisible"
        width="512px"
        :append-to-body="true">
        <el-form v-if="addDialogVisible" ref="add_form" :model="add_dialogData" label-width="86px" :rules="addRules">
          <el-form-item label="字典名称：" prop="dicName">
            <el-input v-model="add_dialogData.dicName" placeholder="请输入字典名称"></el-input>
          </el-form-item>
          <el-form-item label="字典类型：" prop="dicType">
            <el-input v-model="add_dialogData.dicType" placeholder="请输入字典类型"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible=false" class="tableBtn" size="medium" style="width:78px">取消</el-button
          ><el-button @click="addDicFinal('add_form')" type="primary" size="medium" style="width:78px;margin-left:10px">确认</el-button>
        </span>
      </el-dialog>

      <!-- 新增字典明细dialog -->
      <el-dialog
        :close-on-click-modal="false"
        title="新增字典明细"
        :visible.sync="addDetailVisible"
        width="512px"
        :append-to-body="true">
        <el-form v-if="addDetailVisible" ref="addDetail_form" :model="add_detailData" label-width="86px" :rules="rulesDetail">
          <el-form-item label="选项名称：" prop="option">
            <el-input v-model="add_detailData.option" placeholder="请输入选项名称"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDetailVisible = false" class="tableBtn" size="medium" style="width:78px">取消</el-button
          ><el-button @click="addDetailDicFinal('addDetail_form')" type="primary" size="medium" style="width:78px;margin-left:10px">确认</el-button>
        </span>
      </el-dialog>

      <!-- 修改字典dialog -->
      <el-dialog
        :close-on-click-modal="false"
        title="修改字典"
        :visible.sync="mod_dialogVisible"
        width="512px"
        :append-to-body="true">
        <el-form v-if="mod_dialogVisible" ref="mod_form" :model="mod_dialogData" label-width="86px" :rules="modRules">
          <el-form-item label="字典名称：" prop="dicName">
            <el-input v-model="mod_dialogData.dicName" placeholder="请输入字典名称"></el-input>
          </el-form-item>
          <el-form-item label="字典类型：" prop="dicType">
            <el-input v-model="mod_dialogData.dicType" placeholder="请输入字典类型"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="mod_dialogVisible=false" class="tableBtn" size="medium" style="width:78px">取消</el-button
          ><el-button @click="editFinal('mod_form')" type="primary" size="medium" style="width:78px;margin-left:10px">确认</el-button>
        </span>
      </el-dialog>

      <!-- 修改字典明细dialog -->
      <el-dialog
        :close-on-click-modal="false"
        title="修改字典明细"
        :visible.sync="mod_detailVisible"
        width="512px"
        :append-to-body="true">
        <el-form v-if="mod_detailVisible" ref="mod_detail" :model="mod_detailData" label-width="86px" :rules="rulesDetail">
          <el-form-item label="选项名称：" prop="option">
            <el-input v-model="mod_detailData.option" placeholder="请输入选项名称"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="mod_detailVisible = false" class="tableBtn" size="medium" style="width:78px">取消</el-button
          ><el-button @click="modDetailDicFinal('mod_detail')" type="primary" size="medium" style="width:78px;margin-left:10px">确认</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      tableData:[],
      tempRow: {}, // 保存当前展开的行
      tempDictionaryName: '',
      tempModName: '',
      tempModType: '',
      tempOption: '',
      addDialogVisible: false,
      addDetailVisible: false,
      mod_dialogVisible: false,
      mod_detailVisible: false,
      add_dialogData:{
        dicName: '',
        dicType: ''
      },
      add_detailData: {
        option: ''
      },
      mod_dialogData: {
        dicName: '',
        dicType: ''
      },
      mod_detailData: {
        option: ''
      },
      // 新增字典表单验证
      addRules: {
        dicName: [{
          validator: (rule, value, callback) => {
            for (let item in this.tableData) {
              if (value === this.tableData[item].dictionaryName) {
                callback(new Error('该字典已存在，请重新输入！'))
              }
            }
            callback()
          },
          trigger: 'change'
        },
        { required: true, message: '请输入字典名称', trigger: 'change' }],
        dicType: [{
          validator: (rule, value, callback) => {
            for (let item in this.tableData) {
              if (value === this.tableData[item].dictionaryType) {
                callback(new Error('该字典类型已存在，请重新输入！'))
              }
            }
            callback()
          },
          trigger: 'change'
        },
        { required: true, message: '请输入字典类型', trigger: 'change' }]
      },
      modRules: {
        dicName: [{
          validator: (rule, value, callback) => {
            for (let item in this.tableData) {
              if (value === this.tableData[item].dictionaryName && value !== this.tempModName) {
                callback(new Error('该字典已存在，请重新输入！'))
              }
            }
            callback()
          },
          trigger: 'change'
        },
        { required: true, message: '请输入字典名称', trigger: 'change' }],
        dicType: [{
          validator: (rule, value, callback) => {
            for (let item in this.tableData) {
              if (value === this.tableData[item].dictionaryType && value !== this.tempModType) {
                callback(new Error('该字典类型已存在，请重新输入！'))
              }
            }
            callback()
          },
          trigger: 'change'
        },
        { required: true, message: '请输入字典类型', trigger: 'change' }]
      },
      rulesDetail: {
        option: [{
          validator: (rule, value, callback) => {
            for (let i = 0; i < this.tableData.length; i++) {
              for (let j = 0; j < this.tableData[i].insideData.length; j++) {
                if (this.tableData[i].isExpand === true) {
                  if (value === this.tableData[i].insideData[j].option && value !== this.tempOption) {
                    callback(new Error('该选项已存在，请重新输入！'))
                  }
                }
              }
            }
            callback()
          },
          trigger: 'change'
        },
        { required: true, message: '请输入选项名称', trigger: 'change' }]
      }
    }
  },
  created() {
    // 初始设置展开表格btn的标志符 区分各个展开子表格
    for (let item in this.tableData) {
      this.$set(this.tableData[item],'isExpand', false)
    }
    this.getDic()
  },
  computed: {
    loginUser() {
      return this.$store.getters.getLoginUser
    }
  },
  methods: {
    // 行展开方法
    expandMethod(row,rowlist) {
      for (let item in this.tableData) {
        this.tableData[item].isExpand = false
      }
      row.isExpand = true
      this.tempDictionaryName = row.dictionaryName
    },
    // 获取字典数据
    getDic () {
      this.$axios
        .post('/dictionary/getDic',{})
        .then(res => {
          if (res.data.code === 200) {
            this.tableData = res.data.dic
            this.$store.dispatch('setNations', res.data.dic[0].insideData)
            this.$store.dispatch('setEdus', res.data.dic[1].insideData)
            this.$store.dispatch('setGird', res.data.dic[2].insideData)
          }
        })
        .catch(err => {
          this.loginUser.wrongPlace = '字典维护-获取字典数据'
          this.loginUser.wrongInfo = String(err)
          this.writeSysLog(this.loginUser)
          console.log('发生错误', err)
        })
    },
    
    // 新增字典
    addDic () {
      this.add_dialogData.dicName = ''
      this.add_dialogData.dicType = ''
      this.addDialogVisible = true
    },
    addDicFinal (formName) {
      let params = {
        dictionaryName: this.add_dialogData.dicName,
        dictionaryType: this.add_dialogData.dicType
      }
      this.loginUser.operate = '字典管理-新增字典'
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post('/dictionary/addDic', params)
            .then(res => {
              if (res.data.code === 200) {
                this.getDic()
                this.addDialogVisible = false
                this.writeOpLog(this.loginUser)
              }
            })
            .catch(err => {
              this.loginUser.wrongPlace = '字典维护-新增字典'
              this.loginUser.wrongInfo = String(err)
              this.writeSysLog(this.loginUser)
              console.log('发生错误', err)
            })
        }
      })
    },

    // 新增字典明细
    addDicDetail (row) {
      this.tempRow = row
      this.add_detailData.option = ''
      this.addDetailVisible = true
    },
    addDetailDicFinal (formName) {
      this.loginUser.operate = '字典管理-新增字典明细'
      let params = {
        dictionaryName: this.tempRow.dictionaryName,
        dictionaryType: this.tempRow.dictionaryType,
        option: this.add_detailData.option
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post('/dictionary/addDicDetail', params)
            .then(res => {
              if(res.data.code === 200) {
                this.getDic()
                this.addDetailVisible = false
                this.writeOpLog(this.loginUser)
              }
            })
            .catch(err => {
              this.loginUser.wrongPlace = '字典维护-新增字典明细'
              this.loginUser.wrongInfo = String(err)
              this.writeSysLog(this.loginUser)
              console.log('发生错误', err)
            })
        }
      })
    },

    // 修改字典
    modDic(row) {
      this.tempModName = row.dictionaryName
      this.tempModType = row.dictionaryType
      this.mod_dialogData.dicName = row.dictionaryName
      this.mod_dialogData.dicType = row.dictionaryType
      this.mod_dialogVisible = true
    },
    editFinal (formName) {
      this.loginUser.operate = '字典管理-修改字典'
      let params = {
        dictionaryName1: this.tempModName,
        dictionaryName: this.mod_dialogData.dicName,
        dictionaryType: this.mod_dialogData.dicType
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post('/dictionary/modDic', params)
            .then(res => {
              if(res.data.code === 200) {
                this.getDic()
                this.mod_dialogVisible = false
                this.writeOpLog(this.loginUser)
              }
            })
            .catch(err => {
              this.loginUser.wrongPlace = '字典维护-修改字典数据'
              this.loginUser.wrongInfo = String(err)
              this.writeSysLog(this.loginUser)
              console.log('发生错误', err)
            })
        }
      })
    },

    // 修改字典明细
    modDetail(row) {
      this.mod_detailData.option = row.option
      this.tempOption = row.option
      this.mod_detailVisible = true
    },
    modDetailDicFinal (formName) {
      this.loginUser.operate = '字典管理-修改字典明细'
      let params = {
        dictionaryName: this.tempDictionaryName,
        option1: this.tempOption,
        option: this.mod_detailData.option
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post('/dictionary/modDicDetail', params)
            .then(res => {
              if(res.data.code === 200) {
                this.getDic()
                this.mod_detailVisible = false
                this.writeOpLog(this.loginUser)
              }
            })
            .catch(err => {
              this.loginUser.wrongPlace = '字典维护-修改字典明细'
              this.loginUser.wrongInfo = String(err)
              this.writeSysLog(this.loginUser)
              console.log('发生错误', err)
            })
        }
      })
    },

    // 删除字典
    deleteDic(row) {
      this.loginUser.operate = '字典管理-删除字典'
      this.$confirm('删除后不可恢复，确定要删除吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'delete_icon',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.$axios
          .post('/dictionary/deleteDic', {dictionaryName: row.dictionaryName})
          .then(res => {
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getDic()
              this.writeOpLog(this.loginUser)
            }
          })
          .catch(err => {
            this.loginUser.wrongPlace = '字典维护-删除字典'
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

    //删除字典明细
    deleteDetail(row) {
      this.loginUser.operate = '字典管理-删除字典明细'
      let params = {
        dictionaryName: this.tempDictionaryName,
        option: row.option
      }
      this.$confirm('删除后不可恢复，确定要删除吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'delete_icon',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.$axios
          .post('/dictionary/deleteDetail', params)
          .then(res => {
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getDic()
              this.writeOpLog(this.loginUser)
            }
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
.dictionary {
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
    .insideTableContainer_h{
      margin-left: 24px;
    }
    .insideTableContainer_c{
      margin-bottom: 24px;
    }
  }
}
</style>

<style lang="scss">
.delete_icon{
  .el-message-box__message{
    > p {
      background:url('../../assets/deleteIcon.png') no-repeat left center;
      padding-left: 32px;
    }
  }
}
.table_pzp{
  .el-table__expanded-cell[class*=cell] {
    padding: 0;
  }
}
.dictionary {
  &_content{
    .table_pzp td{
      line-height: 24px;
    }
  }
}
</style>