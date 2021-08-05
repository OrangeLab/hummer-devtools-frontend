<template>
  <el-container 
    direction="vertical"
    
  >
    <div 
      class="debug-tools-container"
      
    >
      <el-tabs 
        v-model="currentShowPage"
        type="card"
        id="tree-view-container"
        :style="treeViewContainerStyle"
        v-loading="pageList.length === 0"
        element-loading-text="等待runtime devtools scoket连接"
        element-loading-spinner="el-icon-loading">
        <el-tab-pane
          :key="item.tenonId"
          v-for="item in pageList"
          :label="'Page-'+ item.tenonId"
          :name="item.tenonId + ''"
          style="height:100%;"
          lazy
        >
          <ViewTree :tenonId="item.tenonId" @getViewTree="getViewTree" @getViewInfo="getViewInfo"/>
        </el-tab-pane>
      </el-tabs>
      <el-tabs type="border-card" v-model="currentTool" id="tools-container" :style="toolsContainerStyle">
        <el-tab-pane label="CONSOLE" name="console" style="height:100%;">
          <Console/>
        </el-tab-pane>
        <el-tab-pane label="MEMORY" name="memory" style="height:100%;">在做了(新建文件夹</el-tab-pane>
      </el-tabs>
    </div>
  </el-container>
</template>

<script>
import Console from './components/Console.vue'
import ViewTree from './components/ViewTree.vue'
import { mapState } from 'vuex'

export default {
  name: "App",
  components: {
    Console,
    ViewTree
  },
  data: () => ({
    currentShowPage: '',
    model: '0',
    tab: '',
    codeLoading: false,
    currentTool: 'console',
    toolsContainerHeight: 400,
    clientSocket: null
  }),
  computed: {
    ...mapState({
      pageList: state => state.pageList
    }), 
    toolsContainerStyle() {
      return `height: ${this.toolsContainerHeight}px;`
    },
    treeViewContainerStyle() {
      return `height: calc(100% - ${this.toolsContainerHeight}px);`
    }
  },
  mounted() {
    this.handleWebSocket()
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
</style>
