<template>
  <div class="login">
    <div class="container">
        <el-form ref="loginForm" :rules="loginRules" :model="form" label-width="100px">
            <h1 style="margin-top:40px">pzp社区综合治理管理系统</h1>
            <h3 style="margin-bottom:50px">———Community Comprehensive Management System ———</h3>
            <el-form-item label="用户名" prop="userName">
                <el-input v-model="form.userName"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="form.password" show-password></el-input>
            </el-form-item>
            <div class="bottom">
                <el-button type="primary" style="text-align:center" size="medium" @click="loginPost()">登录</el-button>
            </div>
        </el-form>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import jwtDecode from 'jwt-decode'
export default {
  data () {
    return {
        form: {
            userName: '',
            password: ''
        },
        loginRules: {
            userName: [{
                required: true, message: '请输入用户名', trigger: 'blur' 
            }],
            password: [{
                required: true, message: '请输入密码', trigger: 'blur'
            }]
        }
    }
  },
  methods: {
      // 登录
    loginPost () {
      this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            this.$axios
                .post('/user/login', this.form)
                .then(res => {
                    if (res.data.code === 200) {
                        Message.success('登录成功')
                        // token存到localstorage
                        var token = res.data.token
                        localStorage.setItem('loginToken', token)
                        const decode = jwtDecode(token)
                        //记录登录日志
                        this.$axios
                          .post('/records/writeRecords', decode)
                          .then(res => {
                            if (res.data.code === 200) {
                              console.log('写入记录成功')
                            }
                          })
                          .catch(err => {
                            decode.wrongPlace = '登录日志记录出错'
                            decode.wrongInfo = String(err)
                            this.writeSysLog(decode)
                            console.log('发生错误', err)
                          })
                        // token存到vuex
                        this.$store.dispatch('setUser', decode)
                        // 第一次显示的角色和值
                        let params = {
                            userName: decode.userName
                        }
                        this.$axios
                          .post('/user/getLoginUser', params)
                          .then(res => {
                              if(res.data.code === 200) {
                                  this.$store.dispatch('setLoginUser', res.data.user[0])
                              }
                          })
                        this.$router.push('/mainPage')
                    } else if (res.data.code === 404) {
                        Message.error('用户不存在')
                    } else {
                        Message.error('密码错误')
                    }
                })
                .catch(err => {
                  console.log('发生错误', err)
                })
          }
      })
      
    }
  },
}

</script>
<style lang='scss' scoped>
.login{
  width: 100%;
  height: 100%;
  background: url(../assets/timg.png) no-repeat;
  background-position-x: center;
  background-position-y: center;
  background-size: cover;
  position: relative;
  .container{
    position: absolute;
    margin: auto;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width:596px;
    height:444px;
    background:rgb(140, 161, 230);
    box-shadow:0px 5px 12px rgba(0,0,0,0.2);
    opacity:0.69;
    border-radius:4px;
    h1 {
      text-align: center;
    }
    .bottom{
      display: flex;
      justify-content: center;
    }
  }
}
</style>

<style lang="scss">
.login {
  .el-input__inner {
    width:410px !important;
    height:36px !important;
    background:rgb(255, 255, 255) !important;
    border:1px solid rgba(217,217,217,1) !important;
    opacity:1 !important;
    border-radius:4px !important;
  }
  .el-form-item__label {
    color: black !important;
    font-weight: bolder;
  }
  .el-form-item {
    margin-bottom: 30px !important;
  }
  .el-input .el-input__clear {
    position: absolute;
    right: 92px;
  }
  .el-button--medium {
      width: 410px;
      background-color: rgb(31, 31, 204);
  }
  .el-button--medium:hover {
      background-color: rgb(5, 5, 252);
  }
  .el-form-item__error {
      color: red;
  }
}
</style>