<template>
  <div class="comInfoSearch">
    <div class="comInfoSearch_header">
      <p>信息查询</p>
    </div>
    <div class="comInfoSearch_content">
      <el-tabs v-model="activeName">
        <el-tab-pane label="小区查询" name="first">
          <communitySearch></communitySearch>
        </el-tab-pane>
        <el-tab-pane label="房屋查询" name="second">
          <houseSearch></houseSearch>
        </el-tab-pane>
        <el-tab-pane label="人员查询" name="third">
          <personSearch></personSearch>
        </el-tab-pane>
        <el-tab-pane label="车辆查询" name="fourth">
          <carSearch></carSearch>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import communitySearch from '@/components/detail/communitySearch/communitySearch'
import houseSearch from '@/components/detail/communitySearch/houseSearch'
import carSearch from '@/components/detail/communitySearch/carSearch'
import personSearch from '@/components/detail/communitySearch/personSearch'
export default {
  data() {
    return {
      activeName: 'first'
    }
  },
  components: {
    houseSearch,
    personSearch,
    carSearch,
    communitySearch
  }
}

</script>
<style lang='scss' scoped>
.comInfoSearch{
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
    margin-top: 12px;
  }
}
</style>

<style lang="scss">
.comInfoSearch{
  &_content{
    .el-tabs__nav{
      margin: 0 24px;
      height: 24px;
    }
    .el-tabs__item{
      padding-right: 48px;
      padding-left: 0;
      font-size: 14px;
      line-height: 24px;
      font-weight: 400;
    }
  }
}
</style>