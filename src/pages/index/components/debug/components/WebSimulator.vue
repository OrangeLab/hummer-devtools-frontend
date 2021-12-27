<template>
  <div class="web-simulator-containers">
    <div class="col-title flex">
      <div class="col-title-text">WebSimulator</div>
    </div>
    <div class="simulator-box">
      <div class="hummer__doc-demo__phone-border">
        <div class="hummer__doc-demo__phone-top-box">
          <div class="hummer__doc-demo__phone-top">
            <div class="phone-title">{{ name }}</div>
          </div>
          <div class="hummer__doc-demo__phone-time">{{ nowTime }}</div>
          <div class="hummer__doc-demo__phone-battery"></div>
          <div class="hummer__doc-demo__phone-signal"></div>
        </div>
        <div
          class="hummer__doc-demo__phone-container"
          v-loading="!iframeReady"
          element-loading-text="等待页面加载"
          element-loading-spinner="el-icon-loading"
        >
          <iframe
            :src="webUrl"
            frameborder="0"
            class="simulator-iframe"
            ref="iframe"
            id="iframe"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { updateQueryStringParameter } from "@/utils/index";
export default {
  props: {
    currentTenonIp: {
      type: String,
    },
  },
  components: {},
  data() {
    return {
      webServerPort: null,
      name: "模拟器",
      iframeReady: false,
      nowTime: null,
    };
  },
  computed: {
    ...mapState({
      pageInfoMap: (state) => state.pageInfoMap,
    }),
    webUrl() {
      if (
        window.location.hostname &&
        this.webServerPort &&
        this.pageInfoMap[this.currentTenonIp]?.webPath
      ) {
        let url = `http://${window.location.hostname}:${this.webServerPort}/${
          this.pageInfoMap[this.currentTenonIp]?.webPath
        }`;
        return updateQueryStringParameter(url, "navBar", "1");
      } else {
        return null;
      }
    },
  },
  watch: {
    webUrl() {
      this.iframeReady = false;
    },
  },
  created() {
    this.getwebServerPort();
    this.nowTimes();
  },
  mounted() {
    let oFrm = this.$refs.iframe;
    let that = this;
    // debugger
    if (oFrm.attachEvent) {
      oFrm.attachEvent("onload", function () {
        debugger;
        // iframe加载完毕以后执行操作
        that.iframeReady = true;
      });
    } else {
      oFrm.onload = function () {
        // iframe加载完毕以后执行操作
        that.iframeReady = true;
        // console.log(oFrm.parent.document.getElementById("iframe").contentWindow.location.href)
      };
    }
  },
  destroyed() {
    this.clear();
  },
  methods: {
    getwebServerPort() {
      fetch(`${window.location.origin}/webServerPort`)
        .then((response) => response.json())
        .then((data) => {
          this.webServerPort = data.data;
        });
    },
    timeFormate(timeStamp) {
      let hh =
        new Date(timeStamp).getHours() < 10
          ? "0" + new Date(timeStamp).getHours()
          : new Date(timeStamp).getHours();
      let mm =
        new Date(timeStamp).getMinutes() < 10
          ? "0" + new Date(timeStamp).getMinutes()
          : new Date(timeStamp).getMinutes();
      this.nowTime = hh + ":" + mm;
    },
    nowTimes() {
      this.timeFormate(new Date());
      setTimeout(this.nowTimes, 1000);
    },
    clear() {
      clearTimeout(this.nowTimes);
      this.nowTimes = null;
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/styles/common.scss";
.web-simulator-containers {
  border: none;
  .simulator-box {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 30px;
  }
  .hummer__doc-demo__phone-border {
    width: 338px;
    height: 680px;
    padding-top: 17.4px;
    background: #000000;
    box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 55.87px;
    position: relative;
    .hummer__doc-demo__phone-top-box {
      z-index: 2;
      position: absolute;
      top: 17.4px;
      left: 19px;
      height: 35px;
      background-color: #ffffff;
      width: 300px;
      border-top-right-radius: 40px;
      border-top-left-radius: 40px;
      .hummer__doc-demo__phone-top {
        position: absolute;
        // top: 17.4px;
        left: 50%;
        transform: translateX(-50%);
        height: 35px;
        width: 150px;
        // margin-top: 17.4px;
        border-radius: 0px 0px 15px 15px;
        display: flex;
        z-index: 9;
        background: #000000;
        flex-direction: column;
        // justify-content: center;
        align-items: center;
        // border: 1px solid #eeeeee;
        border-top: none;
        .phone-title {
          margin-top: 5px;
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: #ffffff;
          letter-spacing: 0;
        }
      }
      .hummer__doc-demo__phone-battery {
        background: url("https://pt-starimg.didistatic.com/static/starimg/img/CoNPeWfG861638951714042.png")
          no-repeat center center;
        background-size: 100% 100%;
        width: 20px;
        height: 20px;
        position: absolute;
        right: 18px;
        top: 8px;
      }
      .hummer__doc-demo__phone-signal {
        background: url("https://pt-starimg.didistatic.com/static/starimg/img/bD6NckH0MM1638951711699.png")
          no-repeat center center;
        background-size: 100% 100%;
        width: 14px;
        height: 14px;
        position: absolute;
        right: 47px;
        top: 9px;
      }
      .hummer__doc-demo__phone-time {
        color: #000000;
        position: absolute;
        top: 7px;
        left: 17px;
        font-size: 16px;
        font-weight: bold;
      }
    }
    .hummer__doc-demo__phone-container {
      border: 1px solid #eeeeee;
      overflow: hidden;
      width: 300px;
      height: 660px;
      margin: 0 auto;
      // padding-top: 35px;
      // box-sizing: border-box;
      border-radius: 40px;
      background-color: #f6f7f9;
      position: relative;
      .simulator-iframe {
        width: 100%;
        height: 100%;
        padding-top: 36px;
        box-sizing: border-box;
      }
    }
  }
}
</style>
