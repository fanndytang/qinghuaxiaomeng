import Vue from 'vue'
import Router from 'vue-router'

import demo from '@/articles/demo'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      redirect: '/demo'
    },
    {
      path: '/demo',
      name: 'demo',
      component: demo
    }
  ]
})
