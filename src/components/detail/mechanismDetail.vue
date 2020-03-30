<template>
  <div class="mechaDetail">
    <div class="mechaBtn">
      <el-button type="primary" size="mini" @click="returnMain()">返回上一级</el-button>
    </div>
    <div class="mechaHeader">
      <div class="header_content" style="text-align:center">
        <h2 style="display:inline-block">{{mainPage.mechaName}}</h2>
        <p class="subTitle" style="text-align:center">
          <span>填报时间：{{mainPage.reportTime}}</span>
          <span style="margin-left:90px">责任单位：{{mainPage.responsibility}}</span>
        </p>
      </div>
    </div>
    <div class="mechaContent">
      <p style="position:relative">
        <span><b>主要负责人：</b>{{mainPage.chargePerson}}</span>
        <span style="position:absolute;left:429px"><b>职务：</b>{{mainPage.peopleDuty}}</span>
      </p>
      <p style="position:relative">
        <span><b>办公电话：</b>{{mainPage.officeTel}}</span>
        <span style="position:absolute;left:429px"><b>办公地址：</b>{{mainPage.officeAdd}}</span>
      </p>
      <p>
        <span><b>工作职能：</b>{{mainPage.streetDuty}}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mainPage: Object
  },
  data() {
    return {
      detailState: false
    }
  },
  methods: {
    returnMain () {
      this.detailState = true
      this.$emit('setValue', this.detailState)
    }
  },
}

</script>
<style lang='scss' scoped>
.mechaDetail {
  margin-left: 24px;
  margin-right: 24px;
  margin-top: 12px;
  .mechaHeader {
    border-bottom: 1px dashed rgb(167, 164, 164);
  }
  .mechaContent{
    span{
      line-height: 39px;
      font-size: 15px;
    }
  }
}
</style>