<template>
<!-- 按数量统计 -->
  <div class="quality">
    <div class="qualityContainer">
      <el-button type="primary" size="small" style="margin-left:24px" @click="exportMeth">数据导出</el-button>
      <!-- 表格 -->
      <div class="table_pzp">
        <div class="user_tableContent">
          <el-table
            v-loading="loading"
            @selection-change="handleSelectionChange"
            ref="multipleTable"
            :data="tableData"
            :header-cell-style="{'background-color':'rgba(232, 232, 232, 1)','color':'rgba(90, 90, 90, 1)'}"
            style="width: 100%;border-bottom:1px solid rgba(217,217,217,1)">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="userName" label="账号" width="122"></el-table-column>
            <el-table-column prop="name" label="姓名" width="122"></el-table-column>
            <el-table-column prop="tel" label="联系方式" width="196"></el-table-column>
            <el-table-column prop="education" label="学历" width="166"></el-table-column>
            <el-table-column prop="nation" label="民族" width="111"></el-table-column>
            <el-table-column prop="quality" label="任务完成质量"></el-table-column>
            <el-table-column type="index" label="排名" width="131"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 导出的表格 -->
    <el-table
      v-show="false"
      id='qualityTable'
      ref="multipleTable"
      :data="tableData1"
      :header-cell-style="{'background-color':'rgba(232, 232, 232, 1)','color':'rgba(90, 90, 90, 1)'}"
      style="width: 100%;border-bottom:1px solid rgba(217,217,217,1)">
      <el-table-column prop="userName" label="账号" width="177"></el-table-column>
      <el-table-column prop="name" label="姓名" width="177"></el-table-column>
      <el-table-column prop="tel" label="联系方式" width="177"></el-table-column>
      <el-table-column prop="education" label="学历" width="177"></el-table-column>
      <el-table-column prop="nation" label="民族" width="177"></el-table-column>
      <el-table-column prop="quality" label="任务完成质量" width="199"></el-table-column>
      <el-table-column type="index" label="排名"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      tableData1: []
    }
  },
  computed: {
    gridPersons () {
      return this.$store.getters.getgrids
    },
  },
  created() {
    this.getUsers()
  },
  methods: {
    // 导出选中的表格
    exportMeth() {
      if (this.tableData1.length !== 0) {
        let wb = XLSX.utils.table_to_book(document.querySelector('#qualityTable'));   // 这里就是表格
        let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
        try {
          FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '数量审核排名.xlsx');  //table是自己导出文件时的命名，随意
        } catch (e) {
          console.log(e, wbout)
        }
        this.loginUser.operate = '小区治理-房屋数据导出'
        this.writeOpLog(this.loginUser)
        return wbout
      } else {
        Message.error('请选择需要导出的数据')
      }
    },
    handleSelectionChange(val) {
      this.tableData1 = val
    },

    async getUsers() {
      let query1 = {}
      query1.process = '已完成'
      query1.checked = '已审核'
      let tempArr = JSON.parse(JSON.stringify(this.gridPersons))
      for (let i=0;i<tempArr.length;i++) {
        query1.gridPerson = tempArr[i].option
        let params = {
          query: query1
        }
        // 获取已完成已审核任务列表
        await this.$axios
          .post('/task/getTasks', params)
          .then(res => {
            if (res.data.code === 200) {
              let sum = 0
              let params1 = {
                query: {
                  name: tempArr[i].option
                }
              }
              for (let j in res.data.task) {
                if (res.data.task[j].quality === '优') {
                  sum += 30
                } else if (res.data.task[j].quality === '良') {
                  sum += 10
                } else {
                  sum += 1
                }
              }
              // 获取该网格员信息
              this.$axios
                .post('/user/getUsers', params1)
                .then(res1 => {
                  if (res1.data.code === 200) {
                    res1.data.user[0].taskAmount = sum
                    res1.data.user[0].quality = res.data.task[0].quality
                    let params2 = res1.data.user[0]
                    // 删除原有的
                    this.$axios
                      .post('/user/deleteUserDetail', {
                        userName: params2.userName,
                        name: params2.name
                      })
                      .then(res2 => {
                        if (res2.data.code === 200) {
                          // 写入user insideData中
                          this.$axios
                            .post('/user/registerDetail', params2)
                            .then(res3 => {
                              if (res3.data.code === 200) {
                                let params3 = {
                                  query: {
                                    name: tempArr[i].option
                                  }
                                }
                                // 获取网格员数据
                                this.$axios
                                  .post('/user/getUsers', params3)
                                  .then(res4 => {
                                    if (res4.data.code === 200) {
                                      res4.data.user[0].insideData[0].taskAmount = Number(res4.data.user[0].insideData[0].taskAmount)
                                      this.tableData.push(res4.data.user[0].insideData[0])
                                      function compare(property){
                                        return function(a,b){
                                            var value1 = a[property];
                                            var value2 = b[property];
                                            return value2 - value1;
                                        }
                                      }
                                      this.tableData.sort(compare('taskAmount'))
                                    }
                                  })
                              }
                            })
                        }
                      })
                    
                  }
                })
            }
          })
      }
      this.loading = false
    }
  },
}

</script>
<style lang='scss' scoped>
</style>