<template>
  <div class="commonSearch">
    <div class="searchForm" style="overflow: auto">
        <el-form :inline="true" :model="formData" ref="searchForm">
          <el-form-item :label="mainPage=== 'first' ? '门牌号' : (mainPage === 'second' ? '姓名' : '车牌号')" prop="userName" class="userName">
            <el-input v-model="formData.userName"></el-input>
          </el-form-item
          ><el-form-item label="姓名:" prop="name" class="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item
          ><el-form-item label="角色：" prop="role" class="role">
            <el-select v-model="formData.role" placeholder="请选择">
              <el-option label="网格员用户" value="网格员用户"></el-option>
              <el-option label="查询用户" value="查询用户"></el-option>
              <el-option label="领导" value="领导"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="btns">
          <el-button size="mini" @click.native="resetForm('searchForm')">重置</el-button>
          <el-button type="primary" size="mini" @click="getUsers()">查询</el-button>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      state: false,
      formData: {
        userName: '',
        name: '',
        role: ''
      },
    }
  },
  props: {
    mainPage: String
  }
}

</script>
<style lang='scss' scoped>
.searchForm{
  border-radius:4px;
  height: 106px;
  background:rgba(245,245,245,1);
  margin: 0 24px 12px 24px;
  .btns{
    text-align: center;
  }
}
</style>

<style lang="scss">
.searchForm {
  .el-form-item {
    margin-left: 28px;
    margin-top: 12px;
    margin-bottom: 12px;
  }
  .el-input__inner {
    width: 310px;
    height: 32px;
  }
  .role .el-input__inner {
    width: 180px;
  }
}
</style>