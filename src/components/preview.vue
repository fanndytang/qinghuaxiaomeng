<!-- 预览文件 -->
<template>
    <div class="rs-preview">
       <!-- <input type="hidden" :value="value" @input="value = $event.target.value">-->

        <div class="thumb-img">
            <div class="item" v-for="item,i in data" :key="i" @click="active = i">
                <slot :data="item" :index="i">
                    <!-- 目前支持视频只有mp4格式 -->
                    <video v-if="item.match(/\.mp4/) !== null" :src="item"></video>
                    <img :src="item" v-else>
                </slot>
            </div>
        </div>

        <div class="carousel" v-show="active >= 0">
            <div class="box">
                <div class="close" @click="active = -1">&times;</div>

                <div v-if="data && data.length > 1">
                    <span class="fa fa-chevron-circle-left" @click="active = active-1>=0 ? active-1 : data.length-1"> < </span>
                    <span class="fa fa-chevron-circle-right" @click="active = active+1<=data.length-1 ? active+1 : 0"> > </span>
                </div>

                <div class="item" v-for="item,i in data" :key="i" :style="'transform: translate(' +(i - active)*100+ '%, 0)'">
                    <div class="can-box">
                        <div class="can-td">
                            <!-- 目前支持视频只有mp4格式 -->
                            <video v-if="item.match(/\.mp4/) !== null" :src="item"></video>
                            <img :src="item" v-else>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    /** @vue */
    export default {
        props: {
            active: Number,                                        //  设置当前要显示的元素在所有元素中的索引值
            url: [Array, String]                                   //  需要预览的图片或视频的路径（string类型，规定只有一个元素）
        },
        data () {
            return {
                data: []                                            //  所有元素（处理 url 后的数据）
            }
        },
        mounted () {
            /** 处理url, 如果为string类型，则转换为数组 */
            this.data = typeof this.url === 'string' ? this.url.split(',') : this.url
        },
        watch: {
            /** 监测 url 变化，同步修改 data */
            url (val) {
                this.data = typeof val === 'string' ? val.split(',') : val
            }
        }
    }
</script>

<style lang="less" scoped>
  /** 预览图片、文件 */
  .rs-preview {
    .thumb-img {
      .item {
        cursor: pointer;
        display: inline-block;
        vertical-align: middle;
        margin: 10px 10px 10px 0;
        border: 1px solid #ddd;
      }
      img {
        max-width: 100px;
        max-height: 100px;
      }
    }
    .carousel {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, .3);
      z-index: 10001;
      .box {
        width: 40%;
        height: 80%;
        background: #fff;
        position: absolute;
        top: 10%;
        left: 30%;
        border-radius: 5px;
        overflow: hidden;
        video {
          height: 50vh;
        }
        .item {
          width: 100%;
          height: 100%;
          padding: 30px 15px 15px 15px;
          text-align: center;
          position: absolute;
          top: 0;
          left: 0;
          overflow: auto;
          transition: all .4s ease-in-out;
        }
        .can-box {
          height: 100%;
          width: 100%;
          display: table;
          .can-td {
            display: table-cell;
            text-align: center;
            vertical-align: middle;
          }
        }
        img {
          margin: 0 auto;
          max-width: 100%;
        }
        &:hover {
          .fa {
            display: block;
          }
        }
      }
      .fa, .close {
        position: absolute;
        color: #ddd;
        cursor: pointer;
        z-index: 10;
        font-size: 30px;
      }
      .close {
        right: 15px;
        top: 0;
      }

      .fa-chevron-circle-right, .fa-chevron-circle-left {
        top: 50%;
        margin: 0 20px;
        display: none;
      }

      .fa-chevron-circle-right {
        right: 10px;
      }
      .fa-chevron-circle-left {
        left: 0;
      }
    }
  }


  @media (max-width: 1000px) {
    .carousel .box {
      width: 98%;
      left: 1%;
    }
  }
</style>
