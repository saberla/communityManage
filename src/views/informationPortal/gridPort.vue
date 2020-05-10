<template>
  <div class="gridPort">
    <div class="gridPort_header" style="text-align:center">
      <h2 class="header">新都区网格门户</h2>
      <p>
        <span class="totalWord">小区总数:<span class="totalCount">{{totalObj.communityTotal}}</span></span>
        <span class="totalWord">房屋总数:<span class="totalCount">{{totalObj.houseTotal}}</span></span>
        <span class="totalWord">人员总数:<span class="totalCount">{{totalObj.personTotal}}</span></span>
        <span class="totalWord">车辆总数:<span class="totalCount">{{totalObj.carTotal}}</span></span>
      </p>
    </div>
    <div class="gridPort_content">
      <div id="gridPort_main" style="width:700px;height: 470px" v-if="mainState"></div>
        <gridCommunity v-if="communityState"></gridCommunity>
        <houseSearch v-if="houseState"></houseSearch>
        <carSearch v-if="carState"></carSearch>
        <personSearch v-if="personState"></personSearch>
      </div>
      <div class="gridNotice" style="width:470px;height: 600px" v-if="mainState">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span v-if="!gridState">你的任务</span>
            <span v-if="gridState">待审核任务</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="pushTasks">>>全部任务</el-button>
          </div>
          <template v-if="!gridState">
            <div v-for="(i,index) in tableData" :key="index" style="margin-top:10px">
              {{(index+1) + ': ' + i.gridRange + ' ' + i.taskType + '任务' + ' '}}<span style=" margin-left:20px">{{ '任务状态: ' + i.process + ' ' + i.checked}}</span>
            </div>
          </template>
          <template v-if="gridState">
            <div v-for="(i,index) in tableData1" :key="index" style="margin-top:10px">
              {{(index+1) + ': ' + i.gridRange + ' ' + i.taskType + '任务' + ' '}}<span style=" margin-left:20px">{{ '任务状态: ' + i.process + ' ' + i.checked}}</span>
            </div>
          </template>
        </el-card>
      </div>
  </div>
</template>

<script>
import houseSearch from '@/components/detail/communitySearch/houseSearch'
import carSearch from '@/components/detail/communitySearch/carSearch'
import personSearch from '@/components/detail/communitySearch/personSearch'
import gridCommunity from '@/components/detail/infomationDetail/gridCommunity'
export default {
  data() {
    return {
      mainState: true,
      houseState: false,
      carState: false,
      personState: false,
      userState: false,
      communityState: false,
      gridState: false,
      tableData: [],
      tableData1: [],
      totalObj:{
        communityTotal: '',
        houseTotal: '',
        carTotal: '',
        personTotal: ''
      }
    }
  },
  components: {
    houseSearch,
    carSearch,
    personSearch,
    gridCommunity
  },
  created() {
    this.getInfos()
    this.getTasks()
    this.getManagerTasks()
  },
  mounted() {
    this.initData()
  },
  computed: {
    userData() {
      if (this.$store.getters.userInfo) {
          return this.$store.getters.userInfo
      } else {
          return {}
      }
    }
  },
  methods: {
    // 获取初始数据并赋值
    // 获取管理员信息
    getInfos () {
      let params1 = {
          userName: this.userData.userName
      }
      this.$axios
        .post('/user/getLoginUser', params1)
        .then(res => {
            if(res.data.code === 200) {
              let loginUser = res.data.user[0]
              for (let i in loginUser.insideData) {
                if (loginUser.insideData[i].gridNum) {
                  var gridNum1 = loginUser.insideData[i].gridNum
                  var gridRange1 = loginUser.insideData[i].gridRange
                  break
                }
              }
              let query1 = {}
              query1.gridRange = gridRange1
              query1.gridNum = gridNum1
              let params = {
                query: query1
              }
              // 获取小区人员信息
              this.$axios
                .post('/persons/getInfoPersons', params)
                .then(res => {
                  if (res.data.code === 200) {
                    this.totalObj.personTotal = res.data.totalCount
                  }
                })
              // 获取小区房屋信息
              this.$axios
                .post('/house/getInfoHouses', params)
                .then(res => {
                  if (res.data.code === 200) {
                    this.totalObj.houseTotal = res.data.totalCount
                  }
                })
              // 获取小区信息
              this.$axios
                .post('/community/getSearchComs', params)
                .then(res => {
                  if (res.data.code === 200) {
                    this.totalObj.communityTotal = res.data.totalCount
                  }
                })
              // 获取车辆信息
              this.$axios
                .post('/cars/getInfoCars', params)
                .then(res => {
                  if (res.data.code === 200) {
                    this.totalObj.carTotal = res.data.totalCount
                  }
                })
            }
        })
    },

    pushTasks () {
      this.$router.push('/comprehensive/taskManage')
    },

    // 获取任务列表
    getTasks () {
      let params1 = {
          userName: this.userData.userName
      }
      this.$axios
        .post('/user/getLoginUser', params1)
        .then(res => {
            if(res.data.code === 200) {
              let loginUser = res.data.user[0]
              if (loginUser.role === 'gridManager') {
                this.gridState = true
              } else {
                var query1 = {
                  gridPerson: loginUser.name
                }
              }
              let params = {
                query: query1
              }
              this.$axios
                .post('/task/getTasks', params)
                .then(res => {
                  if (res.data.code === 200) {
                    this.tableData = res.data.task
                  }
                })
            }
        })
    },

    getManagerTasks () {
      let params1 = {
          userName: this.userData.userName
      }
      this.$axios
        .post('/user/getLoginUser', params1)
        .then(res => {
            if(res.data.code === 200) {
              let loginUser = res.data.user[0]
              if (loginUser.role === 'gridManager') {
                this.gridState = true
              }
              var query1 = {
                checked: '未审核'
              }
              let params = {
                query: query1
              }
              this.$axios
                .post('/task/getTasks', params)
                .then(res => {
                  if (res.data.code === 200) {
                    this.tableData1 = res.data.task
                  }
                })
            }
        })
    },

    //初始化数据
    initData() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('gridPort_main'));
      // 绘制图表
      myChart.setOption({
          title : {
              text: '工作统计',//主标题
              x:'center',//x轴方向对齐方式
          },
          tooltip : {
              trigger: 'item',
              formatter: "{a} </br>{b} : {c} ({d}%)",
              backgroundColor: 'rgba(44, 136, 212, 0.7)'
          },
          legend: {
              orient: 'horizontal', // vertical horizontal
              // top: 'bottom',
              x: 'center',//'center' | 'right' | {number}     
              y: 'bottom', //'center' | 'bottom' | {number}     
              y: '390px',
              data: ['房屋总数','人员总数','小区总数','车辆总数']
          },
          series : []
          // 写在series里面
          // normal: {
          //   label: {
          //     show: false,
          //     position: 'inner', //显示在内部
          //     textStyle: {
          //       align:"center",
          //       fontWeight: 200,
          //       fontSize: 20   //文字的字体大小
          //     },
          //     formatter: '{d}%',/*饼状图内显示百分比*/
          //   },
          //   labelLine: {
          //     show: false,//去除指引线
          //   }
          // }
      })
      let params1 = {
        userName: this.userData.userName
      }
      this.$axios
        .post('/user/getLoginUser', params1)
        .then(res => {
            if(res.data.code === 200) {
              let loginUser = res.data.user[0]
              for (let i in loginUser.insideData) {
                if (loginUser.insideData[i].gridNum) {
                  var gridNum1 = loginUser.insideData[i].gridNum
                  var gridRange1 = loginUser.insideData[i].gridRange
                  break
                }
              }
              let query1 = {}
              query1.gridRange = gridRange1
              query1.gridNum = gridNum1
              let params = {
                query: query1
              }
              this.$axios
                .post('/records/getNowTotals', params)
                .then(res => {
                  if (res.data.code === 200) {
                    myChart.setOption({
                      series: [{
                        name: '小区治理',
                        type: 'pie',
                        radius : '50%',
                        center: ['50%', '40%'],
                        data: res.data.totalRes,
                        itemStyle: {
                          emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'silver'
                          }
                        }
                      }]
                    })
                  }
                })
            }
        })
      myChart.on('click', (param) => {
        this.mainState = false
        if (param.name === '房屋总数') {
          this.houseState = true
        } else if (param.name === '人员总数') {
          this.personState = true
        } else if (param.name === '小区总数') {
          this.communityState = true
        } else {
          this.carState = true
        }
      })
    }
  }
}

</script>
<style lang='scss' scoped>
.gridPort{
  width: 100%;
  height: 100%;
  background-color: rgb(255, 255, 255);
  overflow: auto;
  &_header {
    .header{
      text-decoration-color: skyblue;
      text-shadow: silver -2px 2px ;
    }
    .totalWord {
      margin-left: 40px;
      color: rgb(9, 19, 107);
      font-weight: bolder;
    }
    .totalCount {
      margin-left: 4px;
      color: rgb(212, 96, 18);
      // color: rgba(44, 136, 212, 0.7);
      font-weight: bolder;
    }
  }
  .gridNotice {
    position: fixed;
    right: 100px;
    top: 240px
  }
} 
</style>

<style lang="scss">
.searchForm {
  .el-form-item {
    margin-left: 40px;
    margin-top: 12px;
    margin-bottom: 12px;
  }
  .el-input__inner {
    width: 199px;
    height: 32px;
  }
}
</style>