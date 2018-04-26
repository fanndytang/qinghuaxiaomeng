<template>
  <div class="demo">
    <div class="box">
      <label>日历插件</label>
      <my-datetime class="com" v-model="value"></my-datetime>
    </div>

    <div class="box">
      <label @click="showmodal=true">弹窗(点击)</label>
      <my-modal class="com" title="提示" v-model="showmodal">哈哈</my-modal>
    </div>

    <div class="box">
      <label>数字输入</label>
      <my-number class="com" v-model="num"></my-number>
    </div>

    <div class="box">
      <label>预览图片</label>
      <my-preview class="com" :url="list"></my-preview>
    </div>

    <div class="box">
      <label>下拉选框</label>
      <my-select class="com" :list="selectList" v-model="sel" :prop="{label: 'name', value: 'id'}"></my-select>
    </div>

    <div class="box" style="background: #fff;">
      <label>上传图片</label>
      <my-upload class="com" v-model="img"></my-upload>
    </div>

    <div class="box">
      <label @click="$alert('测试一下')">提示框(点击)</label>
    </div>

    <div class="box">
      <label>加载中</label>
      <div class="com" style="height: 100px;width: 300px;" v-loading="{load: true, msg: '加载中'}"></div>
    </div>

    <div class="box">
      <label @click="$message.success('成功')">提示(点击)</label>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        value: '',
        showmodal: false,
        num: '',
        list: ['http://d.hiphotos.baidu.com/image/pic/item/bd315c6034a85edff62cdd7045540923dc5475c4.jpg', 'http://d.hiphotos.baidu.com/image/pic/item/bd315c6034a85edff62cdd7045540923dc5475c4.jpg', 'http://d.hiphotos.baidu.com/image/pic/item/bd315c6034a85edff62cdd7045540923dc5475c4.jpg'],
        sel: '',
        selectList: [{name: '中国', id: 1}, {name: '英国', id: 2}],
        img: ''
      }
    }
  }
</script>

<style lang="less" scoped>
  .demo {
    padding: 20px;
    text-align: center;
    .box {
      display: flex;
      border: 1px solid #bfcbd9;
      margin-bottom: 30px;
      padding: 20px;
      .com {
        flex: 1;
        margin-left: 10px;
      }
    }
  }
</style>
