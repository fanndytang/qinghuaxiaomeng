<template>
  <div class="datetime" @mouseenter="indatetime=true" @mouseout="indatetime=false">

    <input type="text" :value="value" @input="value = $event.target.value" @focus="showBox = true">

    <div class="content" v-show="showBox" @mouseenter="indatetime=true" @mouseout="indatetime=false">
      <div class="header">
        <span class="icon-left"></span>
        <span class="item" @click="showYear = true;showMon = false">{{year}}年</span>
        <span class="item" @click="showMon = true; showYear = false">{{month}}月</span>
        <span class="icon-right"></span>

        <ul class="year-mon-list" v-show="showYear">
          <li v-for="item,i in 12" :key="i" @click="showYear=false;showMon=true;year=year+item-6;">{{year + item - 6}}</li>
        </ul>
        <ul class="year-mon-list" v-show="showMon">
          <li v-for="item,i in 12" :key="i" @click="showMon=false;setDateList(`${year}-${item}-01`);">{{item}}</li>
        </ul>
      </div>
      <div class="body">
        <table>
          <thead><tr><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th><th>日</th></tr></thead>

          <tbody>
          <tr v-for="item,i in date" :key="i">
            <td @click="selectDate(el)" v-for="el,k in item" :key="k">{{el}}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="foot"></div>
    </div>

  </div>
</template>

<script>
  export default {
    props: {
      value: [String, Date]
    },
    data () {
      return {
        date: [],
        year: '',
        month: '',
        today: '',
        day: '',
        showYear: false,
        showMon: false,
        showBox: false,
        indatetime: false
      }
    },
    mounted () {
      this.setDateList(this.value || new Date())
    },
    methods: {
      setDateList (date) {

        date = new Date(date)

        this.year = date.getFullYear()
        this.month = parseInt(date.getMonth()) + 1
        this.today = date.getDate()
        this.day = date.getDay()


        this.$emit('input', `${this.year}-${this.month}-${this.today}`)
        if(this.value !== `${this.year}-${this.month}-${this.today}`) {
          this.$emit('change', new Date(`${this.year}-${this.month}-${this.today}`))
        }

        this.date = []

        // 闰年 1.不能被100整除，可被4整除  2.能被100整除，能被400整除  闰年二月有29天
        let runyear = !!(this.year%100) && !(this.year%4) || !(this.year%400)

        //  天数
        let len = this.month === 2 ? (runyear ? 29 : 28) : this.month.toString().match(/^1|3|5|7|8|10|12$/) !== null ? 31 : 30

        //  日期列表
        //  分析1号周几
        let oneday = this.day - (this.today % 7 - 1) + 7

        for(let k=0, datelen = Math.ceil((len + (oneday - 1)) / 7); k<datelen; k++) {
          this.date.push([])
          for(let i=0; i<7; i++) {
            let n = k*7 + i - (oneday - 1) + 1
            this.date[k].push(n <= len && n > 0  ?  n : '')
          }
        }
      },
      selectDate (date) {
        this.$emit('input', `${this.year}-${this.month}-${date}`)
        if(this.value !== `${this.year}-${this.month}-${date}`) {
          this.$emit('change', new Date(`${this.year}-${this.month}-${date}`))
        }
      }
    }
  }
</script>

<style>
  .datetime {
    position: relative;
    width: 300px;
    text-align: left;
  }
  .datetime input[type=text], .datetime .content, .datetime .content .header .item, .datetime .content .year-mon-list {
    border: 1px solid #dcdfe6;
    border-radius: 2px;
  }
  .datetime input[type=text] {
    line-height: 22px;
    padding: 0 5px;
  }

  .datetime .content {
    position: absolute;
    top: 100%;
    margin-top: 3px;
    font-size: 12px;
    background: #fff;
  }
  .datetime .content .header {
    text-align: center;
    height: 30px;
    border-bottom: 1px solid #dcdfe6;
    position: relative;
  }
  .datetime .content .year-mon-list {
    position: absolute;
    background: #fff;
    list-style: none;
    min-width: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 3px 0 0 0;
    top: 100%;
  }
  .datetime .content .year-mon-list li {
    width: 25%;
    line-height: 30px;
  }

  .datetime .content .header .item {
    display: inline-block;
    padding: 2px 5px;
    margin: 5px 10px 0 0;
  }
  .datetime .content .header .item , .datetime .content .body table tr td, .datetime .content .year-mon-list li {
    cursor: pointer;
  }
</style>
