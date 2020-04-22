<template>
  <div class="searchPort">
    <el-tabs v-model="activeName">
      <el-tab-pane label="小区查询" name="first">
        <communityInfo></communityInfo>
      </el-tab-pane>
      <el-tab-pane label="房屋查询" name="second">
        <houseInfo></houseInfo>
      </el-tab-pane>
      <el-tab-pane label="车辆查询" name="third">
        <carInfo></carInfo>
      </el-tab-pane>
      <el-tab-pane label="小区人员查询" name="fourth">
        <personInfo></personInfo>
      </el-tab-pane>
      <el-tab-pane label="系统用户查询" name="fifth">
        <userInfoSearch></userInfoSearch>
      </el-tab-pane>
    </el-tabs>
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
      activeName: 'first'
    }
  },
  components: {
    houseInfo,
    carInfo,
    personInfo,
    userInfoSearch,
    communityInfo
  }
}

</script>
<style lang='scss' scoped>
.searchPort{
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow: auto;
}
</style>

<style lang="scss">
.searchPort{
// 标签页间距 24px;
  .el-tabs__nav{
    margin: 0 24px;
    height: 48px;
  }
  .el-tabs__item{
    padding-right: 48px;
    padding-left: 0;
    font-size: 16px;
    line-height: 48px;
    font-weight: 400;
  }
}
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