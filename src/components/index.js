import datetime from '@/components/datetime-picker'
import modal from '@/components/modal'
import number from '@/components/number'
import preview from '@/components/preview'
import select from '@/components/select'
import upload from '@/components/upload'
import tree from '@/components/tree'


// 导出组件
export default {
  install: function(Vue){
    Vue.component('my-datetime',datetime)
    Vue.component('my-modal',modal)
    Vue.component('my-number',number)
    Vue.component('my-preview',preview)
    Vue.component('my-select',select)
    Vue.component('my-upload',upload)
    Vue.component('my-tree',tree)
  }
}
