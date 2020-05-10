<template>
  <div class="personalSet">
    <div class="personalSet_container">
      <div class="personImg">
        <img src="../../assets/用户.png" class="portrait" alt="personImg">
        <p class="userInfo">账号：<span class="rightInfo">{{userData.userName}}</span></p>
        <p class="userInfo">角色：<span class="rightInfo">{{loginUser.role}}</span></p>
        <p class="userInfo">
          姓名：<span class="rightInfo">{{loginUser.name}}</span>
          <img src="../../assets/write.png" class="rightImg" @click="updateName" alt="writeImg">
        </p>
        <p class="userInfo">
          密码：<span class="rightInfo">*******</span>
          <img src="../../assets/write.png" class="rightImg" @click="updatePass" alt="writeImg">
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

      <!-- 修改密码 -->
      <el-dialog
        :close-on-click-modal="false"
        title="修改密码"
        :visible.sync="modPassVisible"
        width="512px"
        custom-class="passWord"
        :append-to-body="true">
        <el-form ref="pass_form" v-if="modPassVisible" :model="password_data" label-width="100px" :rules="passRules">
          <el-form-item label="设置新密码：" prop="newPass">
            <el-input v-model="password_data.newPass" placeholder="请输入新密码" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认新密码：" prop="confirmNew">
            <el-input v-model="password_data.confirmNew" placeholder="确认新密码" show-password></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="modPassVisible = false" class="tableBtn" size="medium" style="width:78px">取消</el-button
          ><el-button @click="modPass('pass_form')" type="primary" size="medium" style="width:78px;margin-left:10px">确认</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'
export default {
  data() {
    return {
      modNameVisible: false,
      modPassVisible: false,
      name_data: {
        name: ''
      },
      password_data: {
        newPass: '',
        confirmNew: ''
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
      },
      passRules: {
        newPass: [{required: true, min: 6, max: 12, message: '请输入6~12位密码', trigger: 'blur'}],
        confirmNew: [{
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码确认'))
            } else if (value !== this.password_data.newPass) {
              callback(new Error('两次密码输入不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur',
          required: true
        }]
      }
    }
  },
  computed: {
      userData() {
        if (this.$store.getters.userInfo) {
            return this.$store.getters.userInfo
        } else {
            return {}
        }
      },
      loginUser() {
        return this.$store.getters.getLoginUser
      }
  },
  methods: {
    // 修改姓名
    updateName () {
      this.name_data.name = ''
      this.modNameVisible = true
    },
    modName (formName) {
      let params = {
        userName: this.userData.userName,
        name: this.name_data.name
      }
      this.$refs[formName].validate((valid) => {
        if(valid) {
          this.$axios
            .post('/user/updateName', params)
            .then(res => {
              if (res.data.code === 200) {
                Message.success('修改成功')
                this.getLoginUser()
                this.modNameVisible = false
              }
            })
        }
      })
    },

    // 修改密码
    updatePass () {
      this.password_data.newPass = ''
      this.password_data.confirmNew = ''
      this.modPassVisible = true
    },
    modPass (formName) {
      let params = {
        userName: this.userData.userName,
        password: this.password_data.newPass
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post('/user/updatePass', params)
            .then(res => {
              if (res.data.code === 200) {
                localStorage.removeItem('loginToken')
                this.$store.dispatch('clearData')
                Message.error('token失效，请重新登录')
                this.$router.push('/')
              }
            })
        } else {
          Message.error('请按要求填写必须字段')
        }
      })
    },

    //获取登录用户信息
    getLoginUser () {
        let params = {
            userName: this.userData.userName
        }
        this.$axios
          .post('/user/getLoginUser', params)
          .then(res => {
              if(res.data.code === 200) {
                  this.$store.dispatch('setLoginUser', res.data.user[0])
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
        position: relative;
        .rightInfo{
          margin-left: 16px;
        }
        .rightImg{
          // display: inline-block;
          // margin-top: 12px;
          // margin-bottom: -2px;
          position: absolute;
          top: 1px;
          left: 188px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.passWord{
  .el-dialog__wrapper .el-input__inner{
    width: 280px !important;
  }
}
.el-dialog__wrapper {
  .el-input .el-input__clear {
    position: absolute;
    right: 62px;
  }
}
</style>