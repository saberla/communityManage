<template>
  <div class="dataMange">
    <div class="dataMange_header">
      <p>数据管理</p>
    </div>
    <div class="dataMange_content" style="text-align:center;margin-top:20px">
      <h1>数据备份</h1>
      <div style="margin-top:20px"><el-button type="primary" @click="exportAll">全库信息备份</el-button></div>
      <div style="margin-top:20px"><el-button type="primary" @click="exportCommunity">小区数据备份</el-button></div>
      <div style="margin-top:20px"><el-button type="primary" @click="exportPerson">人员信息备份</el-button></div>
      <div style="margin-top:20px"><el-button type="primary" @click="exportHouse">房屋数据备份</el-button></div>
      <div style="margin-top:20px"><el-button type="primary" @click="exportCar">车辆数据备份</el-button></div>
      <div style="margin-top:20px"><el-button type="primary" @click="exportUser">管理员数据备份</el-button></div>
    </div>

    <!-- 小区备份 -->
    <el-table
      v-show="false"
      id='communitytable1'
      ref="multipleTable"
      :data="tableDataCom"
      :header-cell-style="{'background-color':'rgba(232, 232, 232, 1)','color':'rgba(90, 90, 90, 1)'}"
      style="width: 100%;border-bottom:1px solid rgba(217,217,217,1)">
      <el-table-column prop="gridNum" label="网格编号" width="177"></el-table-column>
      <el-table-column prop="gridRange" label="网格区域" width="177"></el-table-column>
      <el-table-column prop="communityName" label="小区名" width="177"></el-table-column>
      <el-table-column prop="communityAdd" label="小区地址" width="177"></el-table-column>
      <el-table-column prop="developCompany" label="开发商" width="177"></el-table-column>
      <el-table-column prop="property" label="物业团队" width="199"></el-table-column>
      <el-table-column prop="date" label="建档日期"></el-table-column>
    </el-table>

    <!-- 车辆备份 -->
    <el-table
      v-show="false"
      id='table1'
      ref="multipleTable"
      :data="tableDataCar"
      :header-cell-style="{'background-color':'rgba(232, 232, 232, 1)','color':'rgba(90, 90, 90, 1)'}"
      style="width: 100%;border-bottom:1px solid rgba(217,217,217,1)">
      <el-table-column prop="gridNum" label="网格编号" width="177"></el-table-column>
      <el-table-column prop="gridRange" label="网格区域" width="177"></el-table-column>
      <el-table-column prop="carNum" label="车牌号" width="177"></el-table-column>
      <el-table-column prop="carHolder" label="车主" width="177"></el-table-column>
      <el-table-column prop="carColor" label="车身颜色" width="177"></el-table-column>
      <el-table-column prop="communityName" label="所属小区" width="199"></el-table-column>
      <el-table-column prop="date" label="建档日期"></el-table-column>
    </el-table>

    <!-- 房屋备份 -->
    <el-table
      v-show="false"
      id='housetable1'
      ref="multipleTable"
      :data="tableDataHouse"
      :header-cell-style="{'background-color':'rgba(232, 232, 232, 1)','color':'rgba(90, 90, 90, 1)'}"
      style="width: 100%;border-bottom:1px solid rgba(217,217,217,1)">
      <el-table-column prop="gridNum" label="网格编号" width="177"></el-table-column>
      <el-table-column prop="gridRange" label="网格区域" width="177"></el-table-column>
      <el-table-column prop="houseNum" label="门牌号" width="177"></el-table-column>
      <el-table-column prop="houseSize" label="房屋大小" width="177"></el-table-column>
      <el-table-column prop="houseHolder" label="户主" width="177"></el-table-column>
      <el-table-column prop="communityName" label="所属小区" width="199"></el-table-column>
      <el-table-column prop="date" label="建档日期"></el-table-column>
    </el-table>

    <!-- 管理员备份 -->
      <el-table
        v-show="false"
        id='usertable1'
        ref="multipleTable"
        :data="tableDataUser"
        :header-cell-style="{'background-color':'rgba(232, 232, 232, 1)','color':'rgba(90, 90, 90, 1)'}"
        style="width: 100%;border-bottom:1px solid rgba(217,217,217,1)">
        <el-table-column prop="userName" label="账号" width="96"></el-table-column>
        <el-table-column prop="name" label="姓名" width="161"></el-table-column>
        <el-table-column prop="tel" label="联系方式" width="161"></el-table-column>
        <el-table-column prop="role" label="角色"  width="151"></el-table-column>
        <el-table-column prop="education" label="学历"  width="130"></el-table-column>
        <el-table-column prop="nation" label="民族"  width="130"></el-table-column>
      </el-table>

    <!-- 人员备份 -->
    <el-table
      v-show="false"
      id='persontable1'
      ref="multipleTable"
      :data="tableDataPerson"
      :header-cell-style="{'background-color':'rgba(232, 232, 232, 1)','color':'rgba(90, 90, 90, 1)'}"
      style="width: 100%;border-bottom:1px solid rgba(217,217,217,1)">
      <el-table-column prop="gridNum" label="网格编号" width="177"></el-table-column>
      <el-table-column prop="gridRange" label="网格区域" width="177"></el-table-column>
      <el-table-column prop="personName" label="姓名" width="177"></el-table-column>
      <el-table-column prop="personSex" label="性别" width="177"></el-table-column>
      <el-table-column prop="personTel" label="电话" width="177"></el-table-column>
      <el-table-column prop="personAdd" label="住址" width="177"></el-table-column>
      <el-table-column prop="communityName" label="所属小区" width="199"></el-table-column>
      <el-table-column prop="date" label="建档日期"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  data() {
    return {
      tableDataPerson: [],
      tableDataUser: [],
      tableDataHouse: [],
      tableDataCar: [],
      tableDataCom: []
    }
  },
  computed: {
    loginUser() {
      return this.$store.getters.getLoginUser
    }
  },
  methods: {
    // 小区导出
    exportCommunity() {
      let query1 = {}
      let params = {
        query: query1
      }
      this.$axios
        .post('community/getSearchComs', params)
        .then(res => {
          if (res.data.code === 200) {
            this.tableDataCom = res.data.coms
            setTimeout(() => {
              let wb = XLSX.utils.table_to_book(document.querySelector('#communitytable1'));   // 这里就是表格
              let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
              try {
                FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '小区建档信息.xlsx');  //table是自己导出文件时的命名，随意
              } catch (e) {
                console.log(e, wbout)
              }
              this.loginUser.operate = '小区数据备份'
              this.writeOpLog(this.loginUser)
              return wbout
            },100)
          }
        })
    },
    //人员导出
    exportPerson() {
      let query1 = {}
      let params = {
        query: query1
      }
      this.$axios
        .post('/persons/getInfoPersons', params)
        .then(res => {
          if (res.data.code === 200) {
            this.tableDataPerson = res.data.person
            setTimeout(() => {
              let wb = XLSX.utils.table_to_book(document.querySelector('#persontable1'));   // 这里就是表格
              let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
              try {
                FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '人员建档信息.xlsx');  //table是自己导出文件时的命名，随意
              } catch (e) {
                console.log(e, wbout)
              }
              this.loginUser.operate = '人员数据备份'
              this.writeOpLog(this.loginUser)
              return wbout
            },100)
          }
        })
    },
    // 房屋导出
    exportHouse() {
      let query1 = {}
      let params = {
        query: query1
      }
      this.$axios
        .post('/house/getInfoHouses', params)
        .then(res => {
          if (res.data.code === 200) {
            this.tableDataHouse = res.data.house
            setTimeout(() => {
              let wb = XLSX.utils.table_to_book(document.querySelector('#housetable1'));   // 这里就是表格
              let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
              try {
                FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '房屋建档信息.xlsx');  //table是自己导出文件时的命名，随意
              } catch (e) {
                console.log(e, wbout)
              }
              this.loginUser.operate = '房屋数据备份'
              this.writeOpLog(this.loginUser)
              return wbout
            },100)
          }
        })
    },
    // 车辆导出
    exportCar() {
      let query1 = {}
      let params = {
        query: query1
      }
      this.$axios
        .post('/cars/getInfoCars', params)
        .then(res => {
          if (res.data.code === 200) {
            this.tableDataCar = res.data.cars
            setTimeout(() => {
              let wb = XLSX.utils.table_to_book(document.querySelector('#table1'));   // 这里就是表格
              let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
              try {
                FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '车辆建档信息.xlsx');  //table是自己导出文件时的命名，随意
              } catch (e) {
                console.log(e, wbout)
              }
              this.loginUser.operate = '车辆数据备份'
              this.writeOpLog(this.loginUser)
              return wbout
            },100)
          }
        })
    },
    // 管理员导出
    exportUser() {
      let query1 = {}
      let params = {
        query: query1
      }
      this.$axios
        .post('/user/getUsers', params)
        .then(res => {
          if (res.data.code === 200) {
            this.tableDataUser = res.data.user
            setTimeout(() => {
              let wb = XLSX.utils.table_to_book(document.querySelector('#usertable1'));   // 这里就是表格
              let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
              try {
                FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '管理员建档信息.xlsx');  //table是自己导出文件时的命名，随意
              } catch (e) {
                console.log(e, wbout)
              }
              this.loginUser.operate = '管理员数据备份'
              this.writeOpLog(this.loginUser)
              return wbout
            },100)
          }
        })
    },
    // 导出所有
    exportAll () {
      this.exportCommunity()
      this.exportPerson()
      this.exportHouse()
      this.exportCar()
      this.exportUser()
    }
  }
}

</script>
<style lang='scss' scoped>
.dataMange {
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
}
</style>

<style lang="scss">
</style>