<template>
  <div class="commons">
    <div class="headerBtn">
      <el-button type="primary" size="mini" @click="returnMain()">返回上一级</el-button>
    </div>
    <div class="commonHeader">
      <div class="header_content" style="text-align:center">
        <h3 style="display:inline-block">{{mainPage.communityName}}</h3>
      </div>
      <div class="commonContent">
        <div class="totalCount" style="text-align:center">
          <p style="margin:6px 0">
            <span><b>房屋总数：</b>{{houseTotal}}</span>
            <span style="margin-left:33px"><b>人口总数：</b>{{peopleTotal}}</span>
            <span style="margin-left:33px"><b>车辆总数：</b>{{carTotal}}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="detailContent">
      <el-tabs v-model="activeName">
        <el-tab-pane label="房屋建档" name="first">
          <house :mainPage='mainPage' @houseTotal='getHouses'></house>
        </el-tab-pane>
        <el-tab-pane label="人员建档" name="second">
          <person :mainPage='mainPage' @personTotal='getPersons'></person>
        </el-tab-pane>
        <el-tab-pane label="车辆建档" name="third">
          <car :mainPage='mainPage' @carTotal='getCars'></car>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import house from './houseDetial'
import person from './personDetail'
import car from './carDetail'
export default {
  data() {
    return {
      detailState: true,
      activeName: 'first',
      houseTotal: 0,
      peopleTotal: 0,
      carTotal: 0
    }
  },
  props: {
    mainPage: Object
  },
  components: {
    person,
    house,
    car
  },
  methods: {
    returnMain() {
      this.detailState = false
      this.$emit('setDetailValue', this.detailState)
    },
    getHouses(val) {
      this.houseTotal = val
    },
    getPersons(val) {
      this.peopleTotal = val
    },
    getCars(val) {
      this.carTotal = val
    }
  }
}

</script>
<style lang='scss' scoped>
.headerBtn {
  padding: 12px 0 6px 24px
}
.commonContent{
  span{
      line-height: 12px;
      font-size: 15px;
    }
}
</style>
<style lang="scss">
  .el-tabs__nav{
    margin: 0 24px;
    height: 24px;
  }
  .el-tabs__item{
    padding-right: 48px;
    padding-left: 0;
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
  }
</style>