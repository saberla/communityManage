import Vue from 'vue'
import VueRouter from 'vue-router'
import { Message } from 'element-ui'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../views/login.vue')
  },
  {
    path: '/mainPage',
    name: 'mainPage',
    component: () => import('../components/layout/layout.vue'),
    redirect: '/system/personal',  //初始化跳珠页
    children: [
      {
        path: '/system/userManage',  // 用户管理页面
        name: 'system',
        component: () => import('../views/systemSet/userManage.vue')
      },
      {
        path: '/system/personal',  // 个人设置页面
        name: 'personal',
        component: () => import('../views/personalSet/person.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    next()
  } else {
    const isLogin = localStorage.getItem('loginToken')
    if (isLogin) {
      next()
    } else {
      Message.error('token失效，请重新登录')
      next('/')
    }
  }
})
export default router
