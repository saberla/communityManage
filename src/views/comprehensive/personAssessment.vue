<template>
  <div class="personAssessment">
    <div class="personAssessment_header">
      <p>人员考核</p>
    </div>
    <div class="personAssessment_content">
      <el-tabs v-model="activeName">
        <el-tab-pane label="按完成数量统计" name="first">
          <amount v-if="amountState"></amount>
        </el-tab-pane>
        <el-tab-pane label="按完成质量统计" name="second">
          <quality v-if="qualityState"></quality>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import amount from '@/components/detail/personAssessment/amount'
import quality from '@/components/detail/personAssessment/quality'
export default {
  data() {
    return {
      activeName: 'first',
      amountState: true,
      qualityState: false
    }
  },
  components: {
    amount,
    quality
  },
  watch: {
    'activeName':function(newVal,oldVal){
        if (newVal === 'second') {
          this.qualityState = true
          this.amountState = false
        } else {
          this.qualityState = false
          this.amountState = true
        }
      }
  }
}

</script>
<style lang='scss' scoped>
.personAssessment{
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
.personAssessment{
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