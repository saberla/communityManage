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
    redirect: '/information/girdPort',  //初始化跳转页
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
      // {
      //   path: '/system/mechanism',  // 机构管理页面
      //   name: 'mechanism',
      //   component: () => import('../views/systemSet/mechanism.vue')
      // },
      {
        path: '/system/dictionary',  // 字典维护页面
        name: 'dictionary',
        component: () => import('../views/systemSet/dictionary.vue')
      },
      {
        path: '/system/dataManage',  // 数据管理页面
        name: 'dataManage',
        component: () => import('../views/systemSet/dataManage.vue')
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
        path: '/comprehensive/girdManage', // 网格管理
        name: 'gridManage',
        component: () => import('../views/comprehensive/gridManage.vue')
      },
      {
        path: '/comprehensive/taskManage', // 任务管理
        name: 'taskManage',
        component: () => import('../views/comprehensive/taskManage.vue')
      },
      {
        path: '/comprehensive/personAssessment', // 人员审核
        name: 'personAssessment',
        component: () => import('../views/comprehensive/personAssessment.vue')
      },

      
      //信息门户
      {
        path: '/information/girdPort', // 网格门户
        name: 'girdPort',
        component: () => import('../views/informationPortal/gridPort.vue')
      },
      {
        path: '/information/searchPort',  // 查询门户
        name: 'searchPort',
        component: () => import('../views/informationPortal/searchPort.vue')
      },
      {
        path: '/information/leaderPort',  // 领导大屏
        name: 'leaderPort',
        component: () => import('../views/informationPortal/leaderPort.vue')
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
      // Message.error('token失效，请重新登录')
      next('/')
    }
  }
})
export default router
