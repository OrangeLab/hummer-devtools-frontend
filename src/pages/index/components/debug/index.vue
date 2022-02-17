<template>
  <el-container direction="vertical">
    <div class="debug-tools-container" v-if="!newUser">
      <div class="left-tools-box">
        <el-tabs
          v-model="currentShowPage"
          type="card"
          id="tree-view-container"
          :style="style"
          v-loading="pageList.length === 0"
          element-loading-text="等待runtime devtools scoket连接"
          element-loading-spinner="el-icon-loading"
        >
          <el-tab-pane
            :key="item.tenonId"
            v-for="item in pageList"
            :label="'Page-' + item.tenonId"
            :name="item.tenonId + ''"
            style="height: 100%"
            lazy
          >
            <TabPaneContent
              :tenonId="item.tenonId"
              :tenonIp="item.ip"
              @getViewTree="getViewTree"
              @getStorage="getStorage"
              @getMemory="getMemory"
              @getViewInfo="getViewInfo"
              @setViewStyle="setViewStyle"
            />
          </el-tab-pane>
        </el-tabs>
        <console-pan
          :toolsContainerStyle="toolsContainerStyle"
          :currentTenonIp="currentTenonIp"
          :currentTenonId="currentShowPage"
          @setStorage="setStorage"
          @setMemory="setMemory"
        ></console-pan>
      </div>
      <div class="right-tools-box" id="right-tools-box" v-if="pageList.length !== 0">
        <WebSimulator :currentTenonId="currentShowPage" @getViewInfo="getViewInfo"></WebSimulator>
      </div>
    </div>
    <Empty v-else-if="pageList.length === 0 && newUser"></Empty>
  </el-container>
</template>

<script>
import ConsolePan from "./components/ConsolePan.vue";
import TabPaneContent from "./components/TabPaneContent.vue";
import Empty from "./components/Empty.vue";
import { mapState } from "vuex";
import Event from "@/utils/event";
import WebSimulator from "./components/WebSimulator.vue";
export default {
  name: "App",
  components: {
    TabPaneContent,
    ConsolePan,
    Empty,
    WebSimulator,
  },
  data: () => ({
    currentShowPage: "",
    model: "0",
    tab: "",
    codeLoading: false,
    toolsContainerHeight: 400,
    clientSocket: null,
    defaultActivePage: {},
    style: {},
    newUser: true,
    currentTenonIp: null,
  }),
  watch: {
    currentShowPage(val) {
      this.currentTenonIp = this.pageList.find((item) => {
        return item.tenonId + "" === val;
      })?.ip;
    },
  },
  computed: {
    ...mapState({
      pageList: (state) => state.pageList,
    }),
    toolsContainerStyle() {
      return `height: ${this.toolsContainerHeight}px;`;
    },
  },
  mounted() {
    this.handleWebSocket();
    this.styleInit();
  },
  methods: {
    handleWebSocket() {
      let that = this;
      // Create WebSocket connection.
      this.clientSocket = new WebSocket(
        `ws://${window.location.host}/proxy/client`
      );

      // Connection opened
      this.clientSocket.addEventListener("open", () => {
        this.sendMsgToServer("getPageList", null);
      });

      // Listen for messages
      this.clientSocket.addEventListener("message", (event) => {
        let msg = JSON.parse(event.data);
        console.log("Message from server ", msg);

        switch (msg.method) {
          case "setPageList":
            msg.params?.pageList?.length && (this.newUser = false);
            that.$store.commit("updatePageList", msg);
            const index = msg.params?.pageList?.findIndex((item) => {
              return item.tenonId === parseInt(that.currentShowPage);
            });
            if (msg.params.pageList && msg.params.pageList.length) {
              that.$set(that, "defaultActivePage", msg.params.pageList[0]);
              (that.currentShowPage === "" || index === -1) &&
                (that.currentShowPage = that.defaultActivePage.tenonId + "");
              // that.currentTenonIp = that.defaultActivePage.ip + ;
            }
            break;
          case "setViewTree":
            that.$store.commit("updatePageInfoMap", msg);
            break;
          case "setViewInfo":
            console.log(msg);
            that.$store.commit("updateViewInfo", msg);
            break;
          case "setNotify":
            console.log(msg);
            this.$notify(msg.params.notifyConfig);
            break;
          case "updateLogList":
            console.log("updateLogList", typeof msg);
            that.$store.commit("updateLogList", msg);
            break;
          case "setStyleSuccess":
            console.log("setStyleSuccess", typeof msg);
            this.$message.success("修改样式成功~");
            break;
          case "updateNetWorkList":
            console.log("updateNetWorkList", msg);
            that.$store.commit("updateNetWorkList", msg);
            break;
          case "setStorageList":
            console.log("setStorageList", msg);
            that.$store.commit("setStorageList", msg);
            break;
          case "updateStorageList":
            console.log("updateStorageList", msg);
            that.$store.commit("updateStorageList", msg);
            break;
          case "setStorageSuccess":
            console.log("setStorageSuccess", msg);
            this.$message.success("修改Storage成功~");
            break;
          case "setMemoryList":
            console.log("setMemoryList", msg);
            that.$store.commit("setMemoryList", msg);
            break;
          case "updateMemoryList":
            console.log("updateMemoryList", msg);
            that.$store.commit("updateMemoryList", msg);
            break;
          case "setMemorySuccess":
            console.log("setMemorySuccess", msg);
            this.$message.success("修改Memory成功~");
            break;
          default:
            break;
        }
      });
    },
    sendMsgToServer(method, params) {
      let data = {};
      switch (method) {
        case "getPageList":
          data = {
            type: "page",
            method: "getPageList",
          };
          break;
        case "getViewTree":
          data = {
            type: "view",
            method: "getViewTree",
            params,
          };
          break;
        case "getViewInfo":
          data = {
            type: "view",
            method: "getViewInfo",
            params,
          };
          break;
        case "setViewStyle":
          data = {
            type: "view",
            method: "setViewStyle",
            params,
          };
          break;
        case "setStorage":
          data = {
            type: "storage",
            method: "setStorage",
            params,
          };
          break;

        case "getStorage":
          data = {
            type: "storage",
            method: "getStorage",
            params,
          };
          break;
        case "setMemory":
          data = {
            type: "storage",
            method: "setMemory",
            params,
          };
          break;
        case "getMemory":
          data = {
            type: "storage",
            method: "getMemory",
            params,
          };
          break;
        default:
          break;
      }
      this.clientSocket.send(JSON.stringify(data));
    },
    getViewTree(tenonId) {
      this.sendMsgToServer("getViewTree", { tenonId });
    },
    getStorage(tenonId, tenonIp) {
      this.sendMsgToServer("getStorage", { tenonId, tenonIp });
    },
    getMemory(tenonId, tenonIp) {
      this.sendMsgToServer("getMemory", { tenonId, tenonIp });
    },
    getViewInfo(data) {
      this.sendMsgToServer("getViewInfo", data);
    },
    setViewStyle(data) {
      this.sendMsgToServer("setViewStyle", data);
    },
    handleClick(name) {
      console.log("handleClick", name);
    },
    styleInit() {
      Event.$on(`set-tab-pan-style`, (style) => {
        this.style = {
          ...this.style,
          ...style,
        };
      });
      this.style = { height: `calc(100% - ${this.toolsContainerHeight}px)` };
    },
    setStorage(tenonId, storage) {
      this.sendMsgToServer("setStorage", {
        tenonId: parseInt(tenonId),
        storage,
      });
    },
    setMemory(tenonId, memory) {
      this.sendMsgToServer("setMemory", {
        tenonId: parseInt(tenonId),
        memory,
      });
    },
  },
};
</script>

<style lang="less">
html,
body {
  height: 100%;
  margin: 0;
}
.el-container {
  height: 100%;
}
.debug-tools-container {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
  .el-tabs__content {
    height: calc(100% - 70px);
    overflow: auto;
  }
}
.drag-down {
  resize: vertical;
  overflow: scroll;
}
.index-main {
  position: relative;
}
.left-tools-box {
  width: 100%;
  position: relative;
  height: 100%;
}
.right-tools-box {
  position: relative;
  border-left: 1px solid gainsboro;
  padding: 5px 0 0 10px;
}
</style>
