<template>
  <el-container direction="vertical">
    <div class="debug-tools-container">
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
          :label="'Page-'+ item.tenonId"
          :name="item.tenonId + ''"
          style="height:100%;"
          lazy>
          <TabPaneContent 
            :tenonId="item.tenonId" 
            @getViewTree="getViewTree" 
            @getViewInfo="getViewInfo"
            @setViewStyle="setViewStyle"/>
        </el-tab-pane>
      </el-tabs>
      <console-pan :toolsContainerStyle="toolsContainerStyle"></console-pan>
    </div>
  </el-container>
</template>

<script>
import ConsolePan from './components/ConsolePan.vue'
import TabPaneContent from './components/TabPaneContent.vue'
import { mapState } from 'vuex'
import Event from '@/utils/event'
export default {
  name: "App",
  components: {
    TabPaneContent,
    ConsolePan
  },
  data: () => ({
    currentShowPage: '',
    model: '0',
    tab: '',
    codeLoading: false,
    toolsContainerHeight: 400,
    clientSocket: null,
    defaultActivePage: {},
    style: {}
  }),
  watch: {
    currentShowPage (val) {
      console.log('currentShowPage', val)
    }
  },
  computed: {
    ...mapState({
      pageList: state => state.pageList
    }), 
    toolsContainerStyle() {
      return `height: ${this.toolsContainerHeight}px;`
    },
  },
  mounted() {
    this.handleWebSocket()
    this.styleInit()
  },
  methods: {
    handleWebSocket() {
      let that = this
      // Create WebSocket connection.
      this.clientSocket = new WebSocket(`ws://${window.location.host}/proxy/client`);

      // Connection opened
      this.clientSocket.addEventListener('open', ()=>{
        this.sendMsgToServer('getPageList', null)
      });

      // Listen for messages
      this.clientSocket.addEventListener('message',  (event) => {
          let msg = JSON.parse(event.data)
          console.log('Message from server ', msg);
          
          switch (msg.method) {
            case 'setPageList':
              that.$store.commit('updatePageList', msg)
              if (msg.params.pageList && msg.params.pageList.length) {
                that.$set(that, 'defaultActivePage', msg.params.pageList[0])
                that.currentShowPage = that.defaultActivePage.tenonId + ''
              }
              break;
            case 'setViewTree':
              that.$store.commit('updatePageInfoMap', msg)
              break;
            case 'setViewInfo':
              console.log(msg)
              that.$store.commit('updateViewInfo', msg)
              break;
            case 'setNotify':
              console.log(msg)
              this.$notify(msg.params.notifyConfig);
              break;
            case 'updateLogList':
              console.log('updateLogList', typeof msg)
              that.$store.commit('updateLogList', msg)
              break;
            default:
              break;
          }
      });
    },
    sendMsgToServer(method, params) {
      let data = {}
      switch (method) {
        case 'getPageList':
          data = {
            type: 'page',
            method: 'getPageList'
          }
          break;
        case 'getViewTree':
          data = {
            type: 'view',
            method: 'getViewTree',
            params
          }
          break;
        case 'getViewInfo':
          data = {
            type: 'view',
            method: 'getViewInfo',
            params
          }
          break;
        case 'setViewStyle':
          data = {
            type: 'view',
            method: 'setViewStyle',
            params
          }
          break;
        default:
          break;
      }
      this.clientSocket.send(JSON.stringify(data))
    },
    getViewTree(tenonId) {
      this.sendMsgToServer('getViewTree', {tenonId})
    },
    getViewInfo(data) {
      this.sendMsgToServer('getViewInfo', data)
    },
    setViewStyle(data) {
      this.sendMsgToServer('setViewStyle', data)
    },
    handleClick(name) {
      console.log('handleClick', name)
    },
    styleInit() {
      Event.$on(`set-tab-pan-style`, style => {
        this.style = {
          ...this.style,
          ...style
        }
      })
      this.style = { height: `calc(100% - ${this.toolsContainerHeight}px)` }
    }
  } 
};
</script>

<style lang="less">
html, body{
  height: 100%;
  margin: 0;
}
.el-container{
  height: 100%;
}
.debug-tools-container{
  height: 100%;
  .el-tabs__content{
    height: calc(100% - 70px);
  }
}
.drag-down {
  resize: vertical;
  overflow: scroll;
}
</style>
