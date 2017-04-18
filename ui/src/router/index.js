import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'

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
      name: 'Hello',
      component: Hello
    }
  ]
})
