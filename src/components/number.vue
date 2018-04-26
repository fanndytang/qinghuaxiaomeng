<template>
  <div class="rs-number">
    <input type="hidden" :value="value" @input="value=$event.target.value">

    <div class="px left" v-if="pos != 'right' && !!unit">{{ unit }}</div>

    <input type="text" v-model="val" @keyup="checkNum()" :placeholder="placeholder || ''">

    <div class="icon" @click="reduce()">-</div>
    <div class="icon" @click="add()">+</div>

    <div class="px" v-if="pos == 'right' && !!unit">{{ unit }}</div>
  </div>
</template>

<script>
    /** @vue */
    export default {
        props: {
            value: [Number, String],
            placeholder: String,               //  提示语
            unit: String,                      //  单位
            pos: String,                       //  单位在左侧还是右侧，默认在左侧
            min: String,                       //  最小值
            max: String,                       //  最大值
            dot: {                             //  小数点后的位数，不传则默认为0(整数)
                type: String,
                default: '0'
            }
        },
        data () {
            return {
                val: '',
                fix: {}
            }
        },
        mounted () {
            this.fix.hasMin = this.min && this.min.toString() !== ''
            this.fix.hasMax = this.max && this.max.toString() !== ''
            this.fix.min = this.fix.hasMin ? parseFloat(this.min) : Number.NEGATIVE_INFINITY
            this.fix.max = this.fix.hasMax ? parseFloat(this.max) : Number.POSITIVE_INFINITY
            this.fix.dot = parseFloat(this.dot)

            let v = parseFloat(this.value.toString().replace('$', '').replace('￥', ''))
            this.val = isNaN(v) ? '' : v
        },
        methods: {
            /** 减1 */
            reduce () {
                let data = parseFloat(this.val)

                if(isNaN(data)) {
                    this.val = this.fix.hasMin ? Math.max(-1, this.fix.min) : -1
                }else {
                    this.val = this.fix.hasMin && this.fix.min > (data-1) ? this.fix.min : data-1
                }
            },
            /** 加1 */
            add () {
                let data = parseFloat(this.val)
                if(isNaN(data)) {
                    this.val = this.fix.hasMax ? Math.min(1, this.fix.max) : 1
                }else {
                    this.val = this.fix.hasMax && this.fix.max < (data+1) ? this.fix.max : data+1
                }
            },
            /** 数字有效性 */
            checkNum () {
                let dot = this.fix.dot
                let val = this.val.toString()
                if(!isNaN(parseFloat(val))) {  //  是有效数字
                    let pos = val.indexOf('.')
                    if(dot >= 0) {
                        this.val = pos > 0 ? val.substr(0, dot === 0 ? pos : pos+1+dot) : parseFloat(val)
                    }
                }else {
                    this.val = ''
                }
                if(this.fix.hasMin && parseFloat(this.val) < this.fix.min) {
                    this.val = this.fix.min
                }
                if(this.fix.hasMax && parseFloat(this.val) > this.fix.max) {
                    this.val = this.fix.max
                }
            }
        },
        watch: {
            val (val) {
                let v = parseFloat(val)
                v = isNaN(v) ? -1 : v
                this.$emit('input', v)
                this.$emit('change', v)
            },
            value (val) {
                if(val !== this.val) {
                    let v = parseFloat(this.value.toString().replace('$', '').replace('￥', ''))
                    this.val = isNaN(v) ? '' : v
                }
            }
        }
    }
</script>


<style lang="less" scoped>
  .rs-number {
    display: flex;
    width: 180px;
    border: 1px solid #bfcbd9;
    line-height: 26px;
    border-radius: 2px;
    input {
      flex: 1;
      border: 0 !important;
      width: auto;
      min-width: 0;
      padding: 0 5px;
    }
    .icon, .px {
      border-left: 1px solid #bfcbd9;
      color: #97a8be;
      cursor: pointer;
      text-align: center;
    }
    .px.left {
      border-right: 1px solid #bfcbd9;
      border-left: 0;
    }
    .icon {
      width: 25px;
      font-size: 22px;
    }
    .px {
      min-width: 25px;
      font-size: 14px;
      background: #fbfdff;
      padding: 0 2px;
    }
  }
</style>
