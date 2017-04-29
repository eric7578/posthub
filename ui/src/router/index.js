import Vue from 'vue'
import Router from 'vue-router'
import HeaderLayout from '@/components/layout/HeaderLayout'
import Index from '@/components/Index'
import Dashboard from '@/components/Dashboard'

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior () {
    return {
      y: 0
    }
  },
  routes: [
    {
      path: '/',
      component: HeaderLayout,
      children: [
        { path: '', component: Index },
        { path: '/dashboard', component: Dashboard }
      ]
    }
  ]
})
