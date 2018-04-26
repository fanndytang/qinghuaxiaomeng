/** 提示小弹窗 */
export default {
  install (Vue, options) {
    Vue.prototype.$alert = (obj) => {
      let tpl = Vue.extend({
        template:
        '<div class="rs-modal" v-if="show">'+
        '<div class="m-content" :style="stylecon">' +
        '<span class="m-close" @click="cancel()">&times;</span>' +
        '<div class="m-head">{{title}}</div>' +
        '<div class="m-body">' +
        '<div style="height:100%;display:flex;align-items:center;justify-content: center;">{{msg}}</div>' +
        '</div>' +
        '<div class="m-foot">' +
        '<button class="btn" type="button" @click="cancel()" v-show="!hideCancelButton">{{cancelText}}</button>' +
        '<button class="btn btn-primary" type="button" v-show="!hideConfirmButton" @click="confirm()">{{confirmText}}</button>' +
        '</div>' +
        '</div>'
        +'</div>',
        data () {
          return {
            show: true,
            title: obj.title || '提示',
            msg: obj.msg,
            confirmText: obj.confirmText || '确定',
            cancelText: obj.cancelText || '取消',
            hideCancelButton: obj.hideCancelButton || false,
            hideConfirmButton: obj.hideConfirmButton || false,
            stylecon: obj.stylecon ? obj.stylecon : 'width:500px;height:330px;'
          }
        },
        methods: {
          confirm () {
            if(obj.confirm) obj.confirm()
            this.show = false
          },
          cancel () {
            this.show = false
          }
        }
      })

      let node = new tpl().$mount().$el
      document.body.appendChild(node)
    }
  }
}
