import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import Users from '@/components/Users'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: 'welcome',
      children: [
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: Users
        }
      ]
    }
  ]
})

// 设置导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    // 访问登录页面 则直接放行
    return next()
  }
  // 检查是否有 token
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    // 未登录 重定向到登录页
    return next('/login')
  }
  // 一切OK 允许后续访问
  next()
})

export default router
