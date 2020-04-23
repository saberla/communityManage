<template>
  <div class="leaderPort">
    <div class="leaderPort_header" style="text-align:center">
      <h2 class="header">新都小区治理数据库</h2>
      <p>
        <span class="totalWord">小区总数:<span class="totalCount">{{totalObj.communityTotal}}</span></span>
        <span class="totalWord">房屋总数:<span class="totalCount">{{totalObj.houseTotal}}</span></span>
        <span class="totalWord">人员总数:<span class="totalCount">{{totalObj.personTotal}}</span></span>
        <span class="totalWord">车辆总数:<span class="totalCount">{{totalObj.carTotal}}</span></span>
        <span class="totalWord">管理员总数:<span class="totalCount">{{totalObj.userTotal}}</span></span>
      </p>
    </div>
    <div id="leaderPort_content">
      <div id="leaderPort_main" style="width:100%;height: 470px" v-if="mainState"></div>
      <communityInfo v-if="communityState"></communityInfo>
      <houseInfo v-if="houseState"></houseInfo>
      <carInfo v-if="carState"></carInfo>
      <personInfo v-if="personState"></personInfo>
      <userInfoSearch v-if="userState"></userInfoSearch>
    </div>
  </div>
</template>

<script>
import houseInfo from '@/components/detail/infomationDetail/houseInfo'
import carInfo from '@/components/detail/infomationDetail/carInfo'
import personInfo from '@/components/detail/infomationDetail/personInfo'
import userInfoSearch from '@/components/detail/infomationDetail/userInfoSearch'
import communityInfo from '@/components/detail/infomationDetail/communityInfo'
export default {
  data() {
    return {
      mainState: true,
      houseState: false,
      carState: false,
      personState: false,
      userState: false,
      communityState: false,
      totalObj:{
        communityTotal: '',
        houseTotal: '',
        carTotal: '',
        personTotal: '',
        userTotal: ''
      },
      echartsData: [],
    }
  },
  components: {
    houseInfo,
    carInfo,
    personInfo,
    userInfoSearch,
    communityInfo
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