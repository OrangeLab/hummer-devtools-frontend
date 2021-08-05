<template lang="">
  <div class="console-container">
      <el-form :inline="true">
        <el-form-item>
          <el-select v-model="logLevel" clearable placeholder="ALL TYPE">
            <el-option
              v-for="item in options"
              :key="item.level"
              :label="item.label"
              :value="item.level">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            placeholder="请输入筛选内容"
            v-model="keyword"
            clearable>
          </el-input>
        </el-form-item>
        <el-button type="text" @click="clearLog"><i class="el-icon-circle-close"></i></el-button>
      </el-form>
      <div class="log-container">
        <div v-for="(logItem, index) in logList" :class="'log-' + logMap[logItem.level]" :key="index" >
          {{logItem.message}}
        </div>
      </div>

  </div>
</template>
<script>
export default {
  data() {
    return {
      logMap: {
        1: 'log',
        2: 'debug',
        3: 'info',
        4: 'warn',
        5: 'error'
      },
      options: [{
        level: 1,
        label: 'LOG'
      }, {
        level: 2,
        label: 'DEBUG'
      }, {
        level: 3,
        label: 'INFO'
      }, {
        level: 4,
        label: 'WARN'
      }, {
        level: 5,
        label: 'ERROR'
      }, {
        level: 6,
        label: 'EXCEPTION'
      }],
      logLevel: '',
      keyword: ''
    }
  },
  computed: {
    logList() {
      let logList = this.$store.state.logList
      if (this.logLevel) {
        logList = logList.filter((logItem) => {
          return logItem.level === this.logLevel
        })
      }

      if (this.keyword) {
        logList = logList.filter((logItem) => {
          return logItem.message.indexOf(this.keyword) > -1
        })
      }

      return logList
    }
  },
  methods: {
    clearLog() {
      this.$store.commit('clearLogList')
    }
  },
}
</script>
<style lang="less">
.console-container{
  height: 100%;
  .log-container{
    height: calc(100% - 62px);
    overflow: scroll;
    .log-log{
      color: #1802C7;
      border-top: 1px solid #F0F0F0;
    }
    .log-info{
      background-color: #EFF1F7;
      color: #373D44;
      border-top: 1px solid #D6E0F1;
    }
    .log-warn{
      background-color: #FEFBE7;
      color: #573D10;
      border-top: 1px solid #FDF4C7;
    }
    .log-error{
      background-color: #FCF1F0;
      color: #F56C6C;
      border-top: 1px solid #F8D8D7;
    }
  }
}
</style>