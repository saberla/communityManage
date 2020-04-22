<template>
  <div id="nav">
      <div class="leftNav">
          <img src="../../assets/logo1.png" alt="logo" height="100%">
      </div>
      <div class="rightNav">
          <div class="headImg">
              <img src="../../assets/no_user.png" alt="head_logo" height="70%">
          </div>
          <el-dropdown @command="handleCommand" class="drop" trigger="click" placement='bottom-end'>
                <span class="el-dropdown-link">
                    {{loginUser.role}}-{{loginUser.name}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="b">编辑资料</el-dropdown-item>
                    <el-dropdown-item command="a">退出登录</el-dropdown-item>
                </el-dropdown-menu>
           </el-dropdown>
      </div>
  </div>
</template>

<script>
export default {
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
    created() {
        this.getLoginUser()
    },
  methods: {
      handleCommand (command) {
          switch(command) {
              case 'a':
                  localStorage.removeItem('loginToken')
                  this.$store.dispatch('clearData')
                  this.$router.push('/')
                  break
              case 'b':
                  this.$router.push('/system/personal')
                  break
          }
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
#nav{
    width: 100%;
    height:48px;
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    .leftNav {
        width: 100px;
        height: 100%;
        margin-left: 25px;
    }
    .rightNav{
        width: 201px;
        height: 100%;
        padding-right: 40px;
        display: flex;
        justify-content: flex-start;
        .headImg {
            margin-top: 10px;
        }
        .drop{
            margin-top: 13px;
            margin-left: 5px;
            .el-dropdown-link {
                cursor: pointer;
            }
            .el-dropdown-link:hover {
                color: #384EA0;
            }
        }
    }
}
</style>