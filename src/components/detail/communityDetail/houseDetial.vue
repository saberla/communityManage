<template>
  <div class="house">
    <div class="addHouse">
      <el-button type="primary" size="mini" style="margin-left:24px" @click="addHouse">房屋建档</el-button>
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
          <el-table-column prop="houseNum" label="门牌号" width="196"></el-table-column>
          <el-table-column prop="houseSize" label="房屋面积" width="231"></el-table-column>
          <el-table-column prop="houseHolder" label="户主" width="231"></el-table-column>
          <el-table-column prop="date" label="建档日期" width="231"></el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <div>
                <el-button size="mini" type="primary" @click="modHouse(scope.row)">
                  编辑
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <pagination :paginationObj='paginationObj'></pagination>

    <!-- 房屋建档dialog -->
    <el-dialog
      :close-on-click-modal="false"
      title="房屋建档"
      :visible.sync="addDialogVisible"
      width="512px"
      :append-to-body="true">
      <el-form ref="add_form" v-if="addDialogVisible" :model="add_dialogData" label-width="86px" :rules="addRules">
        <el-form-item label="小区名：" prop="communityName">
          <el-input v-model="add_dialogData.communityName" disabled :placeholder="mainPage.communityName"></el-input>
        </el-form-item>
        <el-form-item label="门牌号：" prop="houseNum">
          <el-input v-model="add_dialogData.houseNum" placeholder="请输入房屋门牌号"></el-input>
        </el-form-item>
        <el-form-item label="房屋面积：" prop="houseSize" class="houseSize">
          <el-input v-model.number="add_dialogData.houseSize" placeholder="请输入房屋面积"></el-input>
          <div style="position:absolute;left:211px;top:-6px">m<sup>2</sup></div>
        </el-form-item>
        <el-form-item label="户主：" prop="houseHolder">
          <el-input v-model="add_dialogData.houseHolder" placeholder="请输入房屋户主"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" class="tableBtn" size="medium" style="width:78px">取消</el-button
        ><el-button @click="addHouseFinal('add_form')" type="primary" size="medium" style="width:78px;margin-left:10px">确认</el-button>
      </span>
    </el-dialog>

    <!-- 编辑房屋dialog -->
    <el-dialog
      :close-on-click-modal="false"
      title="编辑房屋信息"
      :visible.sync="modDialogVisible"
      width="512px"
      :append-to-body="true">
      <el-form ref="mod_form" v-if="modDialogVisible" :model="mod_dialogData" label-width="86px" :rules="modRules">
        <el-form-item label="小区名：" prop="communityName">
          <el-input v-model="mod_dialogData.communityName" disabled :placeholder="mainPage.communityName"></el-input>
        </el-form-item>
        <el-form-item label="门牌号：" prop="houseNum">
          <el-input v-model="mod_dialogData.houseNum" disabled placeholder="请输入房屋门牌号"></el-input>
        </el-form-item>
        <el-form-item label="房屋面积：" prop="houseSize">
          <el-input v-model.number="mod_dialogData.houseSize" disabled placeholder="请输入房屋面积"></el-input>
        </el-form-item>
        <el-form-item label="户主：" prop="houseHolder">
          <el-input v-model="mod_dialogData.houseHolder" placeholder="请输入房屋户主"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modDialogVisible = false" class="tableBtn" size="medium" style="width:78px">取消</el-button
        ><el-button @click="modHouseFinal('mod_form')" type="primary" size="medium" style="width:78px;margin-left:10px">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import pagination from '../../pagination/pagination'
export default {
  data () {
    return {
      tableData: [],
      loading: false,
      addDialogVisible: false,
      modDialogVisible: false,
      add_dialogData: {
        communityName: '',
        houseNum: '',
        houseHolder: '',
        houseSize: ''
      },
      mod_dialogData: {
        communityName: '',
        houseNum: '',
        houseHolder: '',
        houseSize: ''
      },
      //分页
      paginationObj: {
        total: 0,
        currentPage: 1,
        pageSize: 3,
        handleCurrentChange: (val) => {
          this.paginationObj.currentPage = val
          this.getHouses()
        }
      },

      //房屋建档验证规则
      addRules: {
        houseNum: [{
          validator: (rule, value, callback) => {
            for (let item in this.tableData) {
              if (value === this.tableData[item].houseNum) {
                callback(new Error('该门牌号已存在，请重新输入！'))
              }
            }
            callback()
          },
          trigger: 'blur'
        },
        { required: true, min: 1, max: 29, message: '请输入房屋索引号!', trigger: 'blur' }],
        houseHolder: [{
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
        houseSize: [
          { required: true, message: '请输入房屋面积', trigger: 'blur'},
          { type: 'number', message: '房屋面积必须为数字值'}
        ]
      },
      //房屋建档验证规则
      modRules: {
        houseHolder: [{
          validator: (rule, value, callback) => {
            if ((/[\u4e00-\u9fa5]{1,29}/).test(value) === false) {
              callback(new Error('请输入1-29字符！'))
            } else {
              callback()
            }
          },
          trigger: 'blur',
          required: true
        }]
      }
    }
  },
  props: {
    mainPage: Object
  },
  components: {
    pagination
  },
  created() {
    this.getHouses()
  },
  methods: {
    // 获取当前小区的房屋信息
    getHouses () {
      let params = {
        communityName: this.mainPage.communityName,
        pageSize: this.paginationObj.pageSize,
        currentPage: this.paginationObj.currentPage
      }
      this.loading = true
      this.$axios
        .post('/house/getHouses', params)
        .then(res => {
          if (res.data.code === 200) {
            this.loading = false
            res.data.house.forEach((el, index) => {
              let newDate = new Date(el.date)
              el.date = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate()
            })
            this.tableData = res.data.house
            this.paginationObj.total = res.data.totalCount
            this.$emit('houseTotal', this.paginationObj.total)
          }
        })
        .catch(err => {console.log('saber发生错误:', err)})
    },

    // 房屋建档
    addHouse () {
      this.add_dialogData.houseNum = '',
      this.add_dialogData.houseSize = '',
      this.add_dialogData.houseHolder = '',
      this.addDialogVisible = true
    },
    addHouseFinal (formName) {
      let params = {
        communityName: this.mainPage.communityName,
        houseNum: this.add_dialogData.houseNum,
        houseSize: this.add_dialogData.houseSize + '平方米',
        houseHolder: this.add_dialogData.houseHolder
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios 
            .post('/house/addhouse', params)
            .then(res => {
              if (res.data.code === 200) {
                Message.success('房屋建档成功')
                this.getHouses()
                this.addDialogVisible = false
              } else {
                Message.error('与已有房屋信息重合')
              }
            })
        }
      })
    },

    // 编辑房屋
    modHouse (row) {
      this.mod_dialogData.communityName = this.mainPage.communityName,
      this.mod_dialogData.houseNum = row.houseNum,
      this.mod_dialogData.houseSize = row.houseSize
      this.mod_dialogData.houseHolder = row.houseHolder
      this.modDialogVisible = true
    },
    modHouseFinal (formName) {
      let params = {
        communityName: this.mainPage.communityName,
        houseNum: this.mod_dialogData.houseNum,
        houseHolder: this.mod_dialogData.houseHolder
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios 
            .post('/house/modHouse', params)
            .then(res => {
              if (res.data.code === 200) {
                Message.success('编辑房屋信息成功')
                this.getHouses()
                this.modDialogVisible = false
              } 
            })
            .catch(err => {console.log('错误：', err)})
        }
      })
    }
  }
}

</script>
<style lang='scss' scoped>
</style>

<style lang="scss">
  .houseSize{
    // 面积表单宽高
    .el-input__inner {
      width: 199px;
      height: 36px;
      border: 1px solid silver;
    }
    // 表单行高
    .el-form-item__content {
      line-height: 36px;
    }
  }
</style>