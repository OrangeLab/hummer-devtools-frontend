<template>
    <div class="index-container">
      <div class="index-aside-box">
        <div :class="`index-aside ${isPutAway?'aside-put-away':''}`">
          <div class="img-box" @click="goOfficialWebsite">
            <el-image
              style="width: 200px;"
              src="//pt-starimg.didistatic.com/static/starimg/img/9E6O0ZOwok1604372834424.png"
              fit="fit">
            </el-image>
          </div>
          <div style="height:calc(100% - 450px);overflow-y:scroll;">
            
            <el-menu
              :default-active="model"
            >
              <el-menu-item :index="index + ''" v-for="(item, index) in srcList" :key="item" @click="selectItem(index)">
                <span slot="title">{{item}}</span>
              </el-menu-item>
            </el-menu>
          </div>
          <div style="text-align:center;height:300px;">
            <el-divider><i class="el-icon-mobile-phone"></i></el-divider>
            <a class="qrcode" id="qrcode" target="_blank"></a>
            <div>
              使用
              <a href="https://page.xiaojukeji.com/m/ddPage_0szxLMtT.html" target="_blank">
                <el-button type="success" size="mini" plain round>Hummer Playground</el-button>
              </a>
              扫码
            </div>
            <el-divider></el-divider>
            <!-- <a href="debug.html" target="_blank">
              <el-button type="info" size="mini" plain round><i class="el-icon-cpu"></i> 开启调试</el-button>
            </a> -->
          </div>
          
        </div>
        <div class="put-away" @click="putAway(true)" v-if="!isPutAway">收起<i class="el-icon-s-fold"></i></div>
        <div class="put-away" @click="putAway(false)" v-else>展开<i class="el-icon-s-unfold"></i></div>
      </div>
      <div
        v-loading="codeLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        class="index-main"
        id="index-main"
      >
          <!-- <highlightjs autodetect :code="currentCode" class="code" /> -->
          <debug></debug>
      </div>
    </div>
</template>

<script>
import debug from './components/debug/index.vue'
export default {
  name: "App",
  components: {
    debug,
  },
  data: () => ({
    srcList: [],
    model: '',
    currentCode: '',
    codeLoading: false,
    isPutAway: false,
  }),
  mounted() {
    console.log('是否生效')
    this.xhr('./fileList', (res) => {
      this.srcList = [...res.data]
      if (this.srcList.length) {
        this.selectItem(0)
        this.model = '0'
      }
    })
  },
  methods: {
      putAway(val) {
        this.isPutAway = val;
      },
      xhr(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
              console.log(xhr)
              let result = null
              try {
                result = JSON.parse(xhr.response)
              } catch (error) {
                result = xhr.response
              }
              callback(result)
            }
          }
        }
        // 设置请求头
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        // 异常处理
        xhr.onerror = function () {
          console.log('Network request failed')
          callback({
            code: 999
          })
        }
        // 发出请求
        xhr.send();
      },
      selectItem(i) {
        this.codeLoading =true
        this.currentIndex = i
        this.createQRCode(i)
        let name = this.srcList[i]

        const url = `${location.origin}/${name}`
        this.xhr(url, (res) => {
          this.currentCode = res
          this.codeLoading = false

        })
      },
      createQRCode(i) {
        let name = this.srcList[i]
        const url = `${location.origin}/${name}`
        var $QR = document.querySelector('#qrcode')
        var QR = window.qrcode(0, 'L')
        $QR.setAttribute('href', url)
        QR.addData(url)
        QR.make()
        $QR.innerHTML = QR.createImgTag(6, 12)
      },
      goOfficialWebsite() {
        window.open('https://hummer.didi.cn/')
      },
    }
};
</script>
<style lang="less">
  html, body{
    height: 100%;
    margin: 0;
    background-color: #efefef;
  }
  .index-container{
    display: flex;
    height: 100vh;
  }
  .index-aside-box{
    position: relative;
    margin: 10px 20px 10px 0;
    .put-away{
      position: absolute;
      font-size:13px;
      background: #fff;
      padding: 4px;
      padding-right: 2px;
      border-radius: 0 5px 5px 0;
      width: 15px;
      top: 30px;
      right: -19px;
    }
  }
  .index-aside{
    background-color: #ffffff;
    box-sizing: border-box;
    height: 100%;
    width: 256px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    position: relative;
    transition: all 0.3s;
    overflow: hidden;
    flex-shrink: 0;
    .img-box{
      width: 256px;
      cursor: pointer;
    }
  }
  .aside-put-away{
    width: 0px;
  }
  .index-main{
    margin: 10px;
    padding: 10px;
    // padding-top: 0;
    height: calc(100% -20px);
    width: 100%;
    box-sizing: border-box;
    overflow: scroll;
    background-color: #ffffff;
    border-radius: 10px;
    .code {
      border-radius: 10px;
    }
  }
  .el-container{
    height: 100%;
  }
  .qrcode {
    width: 100%;
  }

  .qrcode>img {
    display: block;
    width: 160px;
    height: 160px;
    margin: 0 auto;
  }
  .button-gtoup{
    position: fixed;
    top: 25px;
    right: 25px;
  }
</style>