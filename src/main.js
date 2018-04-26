// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import '@/assets/main.less'

import CommonComponent from '@/components/index'
/** 全局注册自定义的公共组件 */
Vue.use(CommonComponent)

import dialog from '@/plugin/dialog'
import loading from '@/plugin/loading'
import message from '@/plugin/message'
import validator from '@/plugin/validator'

Vue.use(dialog)
Vue.use(loading)
Vue.use(message)
Vue.use(validator)

Vue.config.productionTip = false



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  data () {
    return {
      eventHub: new Vue()
    }
  }
})
