<!-- 上传图片 -->
<template>
    <div class="rs-upload">
        <input type="hidden" :value="value" @input="value = $event.target.value">

        <input type="file" @change="upload">
        <!-- 多用于上传图片 -->
        <div class="upload-img" v-if="!isfile">
            <div class="trigger" :style="stylecon || ''" @click="triggerUpload">
                <div class="icon">+</div>
                <div>上传文件</div>

                <div class="img-box" v-show="!!showUrl"><img :src="showUrl"></div>
            </div>
        </div>

        <!--  多用于上传文件  -->
        <div class="upload-file" v-if="isfile">
            <button class="btn btn-primary btn-sm" type="button" @click="triggerUpload">上传文件</button>
            {{ fileName }}
            <span v-show="!!fileName" class="el-icon-circle-close-outline" @click="delFile()"></span>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            value: String,
            stylecon: String,                     //  上传图片时，自定义图片显示宽度、高度等样式
            url: String,                          //  显示路径
            isfile: Boolean,                      //  是否是上传文件
            filename: String,                        //  文件名称
            beforeupload: Function                //  上传之前检查是否合法
        },
        data () {
            return {
                showUrl: '',
                fileName: ''
            }
        },
        watch: {
            filename(val) {
                this.fileName = this.filename || ''
            }
        },
        mounted () {
            this.showUrl = this.url || ''
            this.fileName = this.filename || ''
        },
        methods: {
            /** 上传文件 */
            upload(event) {
                let that = this
                let check = true
                if(this.beforeupload) {
                    check = this.beforeupload(event.target.files[0])
                }
                if(check) {
                   /* new Upload().postData({
                        file: event.target.files[0],
                        isfile: that.isfile,
                        httpSuccess (res) {
                            that.$emit('input', res.data.fileinfo.fid)*/
                            that.showUrl = URL.createObjectURL(event.target.files[0])
                            that.fileName = event.target.files[0].name
                      /*  }
                    })*/
                }
            },
            /** 触发上传文件 */
            triggerUpload(event) {
                let target = event.target,
                    parent = target.parentNode,
                    file = parent.querySelector('input[type=file]')
                for(let i=0;i<10;i++) {  //  向上寻找 input[type=file],最多查找10次
                    if(file) {
                        file.click()
                        break;
                    }
                    parent = parent.parentNode
                    file = parent.querySelector('input[type=file]')
                }
            },
            /** 删除上传的文件 */
            delFile() {
                if(this.isfile) {
                    this.fileName = ''
                    this.$emit('input', '')
                }
            }
        }
    }
</script>

<style lang="less" scoped>
  /** 上传图片、文件 */
  .rs-upload {
    position: relative;
    input[type=file] {
      opacity: 0;
      height: 1px;
      width: 1px;
      position: absolute;
      left: 0;
      top: 0;
    }
    .upload-img {
      .trigger {
        width: 130px;
        height: 130px;
        border: 1px dashed #dfe6ec;
        border-radius: 3px;
        color: #ccc;
        cursor: pointer;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .icon {
          font-size: 60px;
          color: #ddd;
          margin-bottom: 10px;
        }
      }
      .img-box {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .upload-file {

    }
  }
</style>
