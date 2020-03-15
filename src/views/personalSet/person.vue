<template>
  <div class="personalSet">
    <div class="personalSet_container">
      <div class="personImg">
        <img src="../../assets/用户.png" class="portrait" alt="personImg">
        <p class="userInfo">账号：<span class="rightInfo">账号</span></p>
        <p class="userInfo">
          姓名：<span class="rightInfo">姓名</span>
          <img src="../../assets/write.png" class="rightImg" @click="updateName" alt="writeImg">
        </p>
        <p class="userInfo">
          密码：<span class="rightInfo">密码</span>
          <img src="../../assets/write.png" class="rightImg" alt="writeImg">
        </p>
      </div>

      <!-- 修改姓名 -->
      <el-dialog
        :close-on-click-modal="false"
        title="修改姓名"
        :visible.sync="modNameVisible"
        width="512px"
        :append-to-body="true">
        <el-form ref="name_form" v-if="modNameVisible" :model="name_data" label-width="86px" :rules="modRules">
          <el-form-item label="新姓名：" prop="name">
            <el-input v-model="name_data.name" placeholder="请输入新姓名"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="modNameVisible = false" class="tableBtn" size="medium" style="width:78px">取消</el-button
          ><el-button @click="modName('name_form')" type="primary" size="medium" style="width:78px;margin-left:10px">确认</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      modNameVisible: false,
      name_data: {
        name: ''
      },
      modRules: {
        name: [{
          validator: (rule, value, callback) => {
            if ((/[\u4e00-\u9fa5]{1,40}/).test(value) === false) {
              callback(new Error('请输入1-40汉字！'))
            } else {
              callback()
            }
          },
          trigger: 'blur',
          required: true
        }],
      }
    }
  },
  methods: {
    // 修改姓名
    updateName () {
      this.modNameVisible = true
    },
    modName (formName) {
      this.$refs[formName].validate((valid) => {
        if(valid) {
          this.modNameVisible = false
        }
      })
    }
  },
}

</script>
<style lang='scss' scoped>
.personalSet{
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow: auto;
  &_container{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    .personImg {
      margin-top: 157px;
      .userInfo{
        margin-left: -50px;
        .rightInfo{
          margin-left: 16px;
          margin-right: 66px;
        }
        .rightImg{
          display: inline-block;
          margin-top: 12px;
          margin-bottom: -2px;
        }
      }
    }
  }
}
</style>