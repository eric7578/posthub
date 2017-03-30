import Vue from 'vue'
import Router from 'vue-router'
import Index from '../pages/index/Index.vue'
import Regist from '../pages/regist/Regist.vue'
import { requireLogin } from './hooks'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/regist',
      component: Regist
    }
  ]
})
