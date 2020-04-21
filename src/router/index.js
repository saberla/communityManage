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
    redirect: '/system/userManage' || '/system/mechanism',  //初始化跳转页
    children: [
      // 系统设置
      {
        path: '/system/userManage',  // 用户管理页面
        name: 'system',
        component: () => import('../views/systemSet/userManage.vue')
      },
      {
        path: '/system/personal',  // 个人设置页面
        name: 'personal',
        component: () => import('../views/personalSet/person.vue')
      },
      {
        path: '/system/logAudit',  // 日志审计页面
        name: 'logAudit',
        component: () => import('../views/systemSet/logAudit.vue')
      },
      {
        path: '/system/mechanism',  // 机构管理页面
        name: 'mechanism',
        component: () => import('../views/systemSet/mechanism.vue')
      },
      {
        path: '/system/dictionary',  // 字典维护页面
        name: 'dictionary',
        component: () => import('../views/systemSet/dictionary.vue')
      },

      // 小区治理
      {
        path: '/community/communityManage', // 建档
        name: 'communityManage',
        component: () => import('../views/communityManage/community.vue')
      },
      {
        path: '/community/infoSearch',  // 信息查询
        name: 'infoSearch',
        component: () => import('../views/communityManage/infoSearch.vue')
      },

      // 综治管理
      {
        path: '/comprehensive/girdManage',
        name: 'gridManage',
        component: () => import('../views/comprehensive/gridManage.vue')
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
