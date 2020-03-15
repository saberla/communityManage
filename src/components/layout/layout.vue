<template>
  <div id="layout">
    <div class="navTop">
      <navTop></navTop>
    </div>
    <div class="bottom">
      <div class="left-menu">
          <leftMenu></leftMenu>
      </div>
      <div class="right-content">
          <router-view class="container"/>
      </div>
    </div>
  </div>
</template>

<script>
import navTop from '../nav/nav'
import leftMenu from '../leftMenu/leftMenu'
export default {
  components: {
    navTop,
    leftMenu
  }
}

</script>
<style lang='scss' scoped>
#layout{
  width: 100%;
  height: 100%;
}
.bottom {
  height: calc(100% - 48px);
  width: 100%;
  display: flex;
  justify-content: flex-start;
  .left-menu{
    height: 100%;
    width: 192px;
    background-color: #384EA0;
  }
  .right-content{
    box-sizing: border-box;
    width: calc(100% - 192px);
    height: 100%;
    background-color: #f5f5f5;
    padding: 24px;
  }
}
</style>

<style lang="scss">
// 表格通用样式
.table_pzp{
  margin: 12px 24px 0 24px;
  border: 1px solid rgba(217,217,217,1);
  border-radius:4px;
  overflow: auto;
  th{
    padding: 0 ;
    height: 40px;
    line-height: 40px;
    background-color: #E8E8E8;
    .cell{
      font-weight: 600;
      color: #5A5A5A;
      font-size: 13px
    }
  }
  td{
    padding: 0;
    height: 60px;
    line-height: 60px;
    .cell{
      height: 32px;
      line-height: 32px;
      color: #5A5A5A;
    }
  }
  .el-table .cell {
    padding-left: 16px;
  }
}

// dialog通用样式
.el-dialog__wrapper{
  // 表单宽高
  .el-input__inner {
     width: 338px !important;
     height: 36px !important;
     border: 1px solid silver !important;
  }
  // 表单行高
  .el-form-item__content {
    line-height: 36px;
  }
   // dialog头
  .el-dialog__title {
    width:72px;
    height:18px;
    font-size:18px;
    font-family:Source Han Sans CN;
    font-weight:400;
    line-height:18px;
    color:rgba(0,0,0,0.85);
    opacity:1;
  }
  .el-dialog__header {
    padding: 16px 0 0 16px;
  }
  // dialog内容
  .el-dialog__body {
    padding: 40px 0 0 0;
  }
  .el-form-item {
    padding-left: 17px;
    margin-bottom: 20px;
  }
  .el-form-item__label {
    padding-right: 4px;
    line-height: 36px;
  }
  // dialog footer
  .el-dialog__footer {
    padding: 0 0 20px 0;
    text-align: center;
  }
}
</style>