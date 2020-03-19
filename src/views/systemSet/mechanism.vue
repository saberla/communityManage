<template>
  <div class="mechanism">
    <div class="mechanism_header">
      <p>机构管理</p>
    </div>
  </div>
</template>

<script>
export default {
  
}

</script>
<style lang='scss' scoped>
.mechanism{
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