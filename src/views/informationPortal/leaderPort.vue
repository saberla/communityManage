<template>
  <div class="leaderPort">
    <div class="leaderPort_header" style="text-align:center">
      <h2 class="header">新都社区治理数据库</h2>
      <p>
        <span class="totalWord">小区总数:<span class="totalCount">{{totalObj.communityTotal}}</span></span>
        <span class="totalWord">房屋总数:<span class="totalCount">{{totalObj.houseTotal}}</span></span>
        <span class="totalWord">人员总数:<span class="totalCount">{{totalObj.personTotal}}</span></span>
        <span class="totalWord">车辆总数:<span class="totalCount">{{totalObj.carTotal}}</span></span>
        <span class="totalWord">管理员总数:<span class="totalCount">{{totalObj.userTotal}}</span></span>
      </p>
    </div>
    <div id="leaderPort_content">
      <div class="leaderPortLeft" style="position:fixed; top:200px">
        <div id="leaderPort_main" style="width: 500px;height: 470px" v-if="mainState"></div>
      </div>
      <div class="leaderPortRight" style="position:fixed; top:200px; right:90px">
        <div id="leaderPortRight" style="width: 500px;height: 470px" v-if="mainState"></div>
      </div>
      <communityInfo v-if="communityState"></communityInfo>
      <houseInfo v-if="houseState"></houseInfo>
      <carInfo v-if="carState"></carInfo>
      <personInfo v-if="personState"></personInfo>
      <userInfoSearch v-if="userState"></userInfoSearch>
      <leaderDetail v-if="leaderState" :parent='parentValue'></leaderDetail>
    </div>
  </div>
</template>

<script>
import houseInfo from '@/components/detail/infomationDetail/houseInfo'
import carInfo from '@/components/detail/infomationDetail/carInfo'
import personInfo from '@/components/detail/infomationDetail/personInfo'
import userInfoSearch from '@/components/detail/infomationDetail/userInfoSearch'
import communityInfo from '@/components/detail/infomationDetail/communityInfo'
import leaderDetail from '@/components/detail/leaderDetail/leaderDetail'
export default {
  data() {
    return {
      mainState: true,  // 主页面状态
      houseState: false, // 房屋状态
      carState: false,  // 车辆状态
      personState: false, // 人员状态
      userState: false, // 管理员用户状态
      communityState: false, // 小区详情状态
      leaderState: false, // 按网格区查看状态
      parentValue: '', // 传给组件的值
      totalObj:{
        communityTotal: '',
        houseTotal: '',
        carTotal: '',
        personTotal: '',
        userTotal: ''
      },
    }
  },
  components: {
    houseInfo,
    carInfo,
    personInfo,
    userInfoSearch,
    communityInfo,
    leaderDetail
  },
  created() {
    this.getInfos()
  },
  mounted() {
    this.initData()
  },
  methods: {
    // 获取初始数据并赋值
    // 获取管理员信息
    async getInfos () {
      let params = {}
      await this.$axios
        .post('/user/getUsers', params)
        .then(res => {
          if (res.data.code === 200) {
            res.data.user.forEach((el, index) => {
              let nowDate = new Date(el.date)
              el.date = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate()
            })
            this.totalObj.userTotal = res.data.totalCount
          }
        })
      // 获取小区人员信息
      await this.$axios
        .post('/persons/getInfoPersons', params)
        .then(res => {
          if (res.data.code === 200) {
            this.totalObj.personTotal = res.data.totalCount
          }
        })
      // 获取小区房屋信息
      await this.$axios
        .post('/house/getInfoHouses', params)
        .then(res => {
          if (res.data.code === 200) {
            this.totalObj.houseTotal = res.data.totalCount
          }
        })
      // 获取小区信息
      await this.$axios
        .post('/community/getSearchComs', params)
        .then(res => {
          if (res.data.code === 200) {
            this.totalObj.communityTotal = res.data.totalCount
          }
        })
      // 获取车辆信息
      await this.$axios
        .post('/cars/getInfoCars', params)
        .then(res => {
          if (res.data.code === 200) {
            this.totalObj.carTotal = res.data.totalCount
          }
        })
    },

    //初始化数据
    initData() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('leaderPort_main'));
      // 绘制图表
      myChart.setOption({
          title : {
              text: '新都街道综治中心',//主标题
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
              data: ['房屋总数','人员总数','小区总数','管理员总数','车辆总数']
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
      this.$axios
        .post('/records/getTotals', {})
        .then(res => {
          if (res.data.code === 200) {
            myChart.setOption({
              series: [{
                name: '社区治理',
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
      myChart.on('click', (param) => {
        this.mainState = false
        if (param.name === '房屋总数') {
          this.houseState = true
        } else if (param.name === '人员总数') {
          this.personState = true
        } else if (param.name === '小区总数') {
          this.communityState = true
        } else if (param.name === '管理员总数') {
          this.userState = true
        } else {
          this.carState = true
        }
      })

      
      // 基于准备好的dom，初始化echarts实例
      var myChart1 = this.$echarts.init(document.getElementById('leaderPortRight'));
      myChart1.setOption({
        title : {
            text: '新都街道综治中心',//主标题
            x:'center',//x轴方向对齐方式
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} </br>{b} : {c} ({d}%)",
            backgroundColor: 'rgba(44, 136, 212, 0.7)'
        },
        legend: {},
        series : []
      })
      let query1 = {
        role: '网格员用户'
      }
      let params = {
        query: query1
      }
      let objs = {}
      let arr = []
      let arr1 = []
      this.$axios
        .post('/user/getUsers', params)
        .then(res => {
          if (res.data.code === 200) {
            for (let i in res.data.user) {
              if (res.data.user[i].insideData.length !== 0) {
                for (let j in res.data.user[i].insideData) {
                  if (res.data.user[i].insideData[j].gridNum) {
                    objs = {}
                    objs.name = res.data.user[i].insideData[j].gridRange
                    objs.value = 1
                    arr1.push(res.data.user[i].insideData[j].gridRange)
                    arr.push(objs)
                  }
                }
              }
            }
            myChart1.setOption({
              legend: {
                  orient: 'horizontal', // vertical horizontal
                  // top: 'bottom',
                  x: 'center',//'center' | 'right' | {number}     
                  y: 'bottom', //'center' | 'bottom' | {number}     
                  y: '390px',
                  data: arr1
              },
              series: [{
                name: '社区治理',
                type: 'pie',
                radius : '50%',
                center: ['50%', '40%'],
                data: arr,
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
      myChart1.on('click', (param) => {
        this.mainState = false
        this.leaderState = true
        this.parentValue = param.name
      })
    }
  }
}

</script>
<style lang='scss' scoped>
.leaderPort{
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