<!-- 下拉选择 -->
<template>
    <div class="rs-select form-item" @mouseover="inselect = true" @mouseout="inselect = false">
        <div class="insert-box" :class="{'multi' : !!multiple}" @click="showList = true">
            <span class="multi-item" v-for="val,i in sel.val" :key="i" v-if="!!multiple&&!!val" @click="remove(val)">{{sel.lab[i]}}</span>

            <input :readonly="!hassearch" type="text" v-model="label" :placeholder="placeholder" @keyup="hassearch ? searchList($event) : ''">

            <span @click="!multiple && value ? remove(value) : ''" class="input-icon"
                  :class="{'el-icon-caret-top':showList&&!value, 'el-icon-caret-bottom':!showList&&!value, 'el-icon-circle-close-outline':!multiple&&value}"></span>
        </div>

        <div class="pop-arrow" v-show="showList"></div>

        <ul class="rs-select-down down" :class="{'show': showList}">
            <li v-for="item,i in select.dataList" :key="i" :class="{'active': sel.val.includes(item[prop.value])}"
                @mousedown="selectItem(item)"> {{item[prop.label]}} </li>

            <li class="tip">
                <span v-show="!select.loading && select.current < select.pages" @mousedown="select.current++;getList();">获取更多</span>
                <span v-show="select.loading">加载中 <i class="el-icon-loading"></i></span>
                <span style="color:#aaa;" v-show="!select.loading && select.dataList.length<=0">暂无数据</span>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            value: String,                                        //  选中的值
            list: Array,                                          //  直接传入可选择的列表，list 与 model 互斥
            model: Object,                                        //  传model,则表示是自定义对象，且可以使用getList 一系列方法
            multiple: Boolean,                                    //  是否多选
            labeled: String,                                      //  之前已选择的值对应的label名称
            rows: [String, Number],                               //  请求多少条数据
            placeholder: { type: String, default: '请选择' },
            prop: {                                               //  label, value
                type: Object,
                default: { label: 'name', value: 'id'}
            },
            hassearch: {                                          //  是否可搜索 如果传model，则为远程搜索时字段名，如果传list, 则为true可搜索
                type: [Boolean, String],
                default: false
            },
            split: {                                             //  labeled的默认分隔符（有些元素值有逗号）
                type: String,
                default: ','
            }
        },
        data () {
            return {
                inselect: false,                            //  鼠标是否进入选框区
                showList: false,                            //  是否显示下拉列表
                search: false,                              //  是否正在搜索
                select: {dataList: []},                     //  可以选择的下拉列表
                label: '',                                  //  当前选择的标签名（单选或搜索文字）
                searchTime: '',                             //  获取列表的方法（有搜索，所以延迟获取）
                sel: {lab: [], val: []}                     //  选择的相关值
            }
        },
        watch: {
            'labeled' (val) {
                this.init()
            },
            'sel.val' (val) {
                if(this.value !== this.sel.val.join(',')) {
                    this.$emit('input', this.sel.val.join(','))
                    this.$emit('change', {value: this.sel.val.join(','), label: this.sel.lab.join(this.split)})
                }
            },
            'showList' (val) {                              //  监听是否要请求列表（如果首次展开，则要请求列表）
                if(val && !this.select.dataList.length) this.getList(true)
                if(!val && this.hassearch && this.search) {
                    if(!this.sel.lab.includes(this.label) || !!this.multiple) this.label = ''
                    this.select.model.rsSearch[this.hassearch] = ''
                    this.select.clearCacheList()
                    this.search = false
                }
            },
            'select.dataList' (val) {
                this.select.dataList.forEach((item) => {
                    let val = item[this.prop.value], lab = item[this.prop.label]
                    if(this.sel.val.includes(val) && !this.sel.lab.includes(lab)) {
                        this.sel.lab.splice(this.sel.val.indexOf(val), 1, lab)
                    }
                })
                if(!this.multiple && !this.search) this.label = this.sel.lab.length ? this.sel.lab[0] : ''
            },
            'value' (val) {
                if(!val) {
                    this.sel = {lab: [], val: []}
                }
            }
        },
        mounted () {
            this.init()
            /** 点击其它区域，关闭下拉框  */
            document.onclick = () => { this.$root.eventHub.$emit('select-document-click') }
            this.$root.eventHub.$on('select-document-click', () => { this.showList = this.inselect || false })
        },
        methods: {
            /** 初始化 */
            init() {
                let lab = this.labeled ? (this.multiple ? this.labeled.split(this.split) : [this.labeled]) : [], val = this.value ? this.value.split(',') : []

                this.sel = {lab: lab, val: val}
                typeof this.list !== 'undefined' ?  this.getList() : ''
                this.label = typeof this.model !== 'undefined' && !this.multiple && this.sel.lab.length ? this.sel.lab[0] : ''
            },
            /** 获取列表 */
            getList (clearList) {
                let that = this
                if(typeof that.model !== 'undefined') {
                    if(!that.select.model) that.select = new RsList({model: that.model})
                    that.select.loading = true
                    if(clearList) that.select.clearCacheList()
                    if(that.searchTime) clearTimeout(that.searchTime)
                    that.searchTime = setTimeout(() => {
                        that.select.getList({rows: that.rows || 10})
                    }, 500)
                }else if(typeof that.list !== 'undefined') {
                    that.select.dataList = that.list
                }
            },
            /** 选择某个值 */
            selectItem(item) {
                let val = item[this.prop.value], lab = item[this.prop.label]
                if(this.multiple) {
                    if(this.sel.val.includes(val)) {
                        this.remove(val)
                    }else {
                        this.sel.val.push(val)
                        this.sel.lab.push(lab)
                    }
                }else {
                    this.sel = {val: [val], lab: [lab]}
                    this.label = lab
                    setTimeout(() => { this.showList = false }, 200)
                }
            },
            /** 移除选中的某个值 */
            remove(val) {
                this.search = false
                let index = this.sel.val.indexOf(val)
                this.sel.val.splice(index, 1)
                this.sel.lab.splice(index, 1)

                if(!this.multiple) this.label = ''
                if(!this.multiple && this.hassearch) {
                    this.select.model.rsSearch[this.hassearch] = ''
                    this.getList(true)
                }
            },
            /** 搜索 */
            searchList () {
                this.select.model.rsSearch[this.hassearch] = this.label || ''
                this.getList(true)
                this.search = true
                if(!this.multiple) this.sel = {lab: [], val: []}
            }
        }
    }
</script>

<style lang="less" scoped>.rs-select {
  position: relative;
  .pop-arrow, .pop-arrow:after {
    border-width: 0 6px 6px 6px;
    border-style: solid;
    position: absolute;
    z-index: 101;
  }
  .pop-arrow {
    top: 100%;
    left: 20px;
    border-color: transparent transparent #e4e7ed transparent;
    &:after {
      content: '';
      left: -6px;
      border-color: transparent transparent #fff transparent;
      z-index: 100;
      top: 1px;
    }
  }
  .down {
    position: absolute;
    left: 0;
    top: 100%;
    margin-top: 6px;
    border: 1px solid #e4e7ed;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    min-width: 100%;
    overflow: auto;
    list-style: none;
    background: #fff;
    border-radius: 4px;
    color: #606266;
    transition: all .2s ease-in-out;
    z-index: 100;
    li {
      padding: 0 30px 0 10px;
      line-height: 34px;
      cursor: pointer;
      white-space: nowrap;
      position: relative;
      &:hover {
        background: #f5f7fa;
      }
      &.active {
        color: #409EFF;
        &:after {
          content: '√';
          position: absolute;
          right: 10px;
          line-height: 32px;
        }
      }
    }
    max-height:0;
    opacity:0;
    &.show {
      max-height:200px;
      opacity:1;
    }
  }
  .insert-box {
    position: relative;
    &:before {
      content: '';
      position: absolute;
      background: transparent;
      width: 100%;
      height: 11px;
      bottom: -7px;
    }
    .multi-item {
      display: inline-block;
      cursor: pointer;
      line-height: 20px;
      font-size: 12px;
      white-space: nowrap;
      background: #eee;
      padding: 0 8px;
      border-radius: 3px;
      margin: 2px;

      &:after {
        font-family: element-icons!important;
        speak: none;
        font-style: normal;
        font-weight: 400;
        font-variant: normal;
        text-transform: none;
        line-height: 1;
        vertical-align: baseline;
        display: inline-block;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        content: '\e609';
      }
    }

    &.multi {
      input[type="text"] {
        display: block;
        border: none;
        &:focus {
          outline: none;
          border: 1px solid #20a0ff;
        }
      }
      border-radius: 3px;
      border: 1px solid #dcdfe6;
      min-height: 26px;
      line-height: 24px;
    }
    .input-icon {
      position: absolute;
      right: 5px;
      top: 7px;
    }
  }
  .tip {
    text-align: center;
    color: #20a0ff;
    padding: 0;
    line-height: 50px !important;
    span {
      display: block;
    }
  }
}
</style>
