import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import elementUI, { Message } from 'element-ui'
//import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import './registerServiceWorker'
import './element-variables.scss'
import echart from 'echarts'

// axios请求拦截器
axios.interceptors.request.use(config => {
  if (localStorage.getItem('loginToken')) {
    // 请求统一设置header
    config.headers.Authorization = localStorage.getItem('loginToken')
  }
  return config
}, error => {
  return Promise.reject(error)
})
// axios响应拦截器
axios.interceptors.response.use(response => {
  return response.data
}, error => {
  // console.log('看一看', error.response)
  const { status } = error.response
  if (status === 401) { // token失效
    Message.error('token失效，请重新登录')
    // 清除token
    localStorage.removeItem('loginToken')
    router.push('/')
  }
  return Promise.reject(error)
})

// 设置基础路径
axios.defaults.baseURL = 'http://localhost:5000/api'

Vue.prototype.$axios = axios
Vue.prototype.$echarts = echart
Vue.config.productionTip = false
Vue.use(elementUI)

// 全局记录操作日志方法
Vue.prototype.writeOpLog = function(params) {
  this.$axios
  .post('/opRecords/writeRecords', params)
  .then(res => {
    if (res.data.code === 200) {
      console.log('记录成功')
    }
  })
  .catch(err => {
    params.wrongPlace = '记录操作日志出错'
    params.wrongInfo = String(err)
    this.writeSysLog(this.loginUser)
    console.log('发生错误', err)
  })
}
// 全局记录系统出错日志方法
Vue.prototype.writeSysLog = function(params) {
  this.$axios
  .post('/sysRecords/writeRecords', params)
  .then(res => {
    if (res.data.code === 200) {
      console.log('记录系统日志成功')
    }
  })
  .catch(err => {console.log('操作记录出错', err)})
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
