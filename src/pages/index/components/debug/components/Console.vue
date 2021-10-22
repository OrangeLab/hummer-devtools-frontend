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
          <template v-if="isObject(logItem.message)">
            <!-- <div v-if="objectOpen"> -->
              {{logItem.message}}<Detail :detailValue="getMessageObject(logItem.message)" :detailIndex="index"></Detail>
            <!-- </div>
            <div v-else>
              {{logItem.message}}<el-tree :data="stringToTreeArr(logItem.message)" :props="defaultProps"></el-tree>
            </div> -->
          </template>
          <template v-else >
            <div v-html="formatWrap(logItem.message)">
            </div>
          </template>
        </div>
      </div>

  </div>
</template>
<script>
import Detail from './logDetail'
import { getUrlParam } from '@/utils/index'
export default {
  components: {
    Detail
  },
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
      keyword: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      objectOpen: getUrlParam('objectOpenType'),
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
      console.log(logList);
      return logList
    }
  },
  methods: {
    formatWrap(val) {
      return val.replace(/\n/g, '<br>');
    },
    clearLog() {
      this.$store.commit('clearLogList')
    },
    // stringToTreeArr(val) {
    //     let message = this.getMessageObject(val);
    //     let data,treeArr;
    //     data = this.transformToTreeData(message)
    //     treeArr = [{
    //       label:val,
    //       children:data,
    //     }]
    //     return treeArr;
    // },
    getMessageObject(val){
      try {
        let message = JSON.parse(val.slice(val.indexOf(' ') + 1));
        return message
      } catch (error) {
        return {}
      }
    },
    // transformToTreeData(obj) {
    //   const treeArr = [];
    //   if (typeof obj === 'object') {
    //     for (const key in obj) {
    //       if (Object.prototype.hasOwnProperty.call(obj, key)) {
    //         if (Object.prototype.toString.call(obj[key]) === '[object Array]') {
    //           const arr = obj[key];
    //           const children = [];
    //           for (let i = 0; i < arr.length; i++) {
    //             const arrItem = arr[i];
    //             children.push({
    //               label: i,
    //               children: this.transformToTreeData(arrItem)
    //             });
    //           }
    //           const item = {
    //             label: `${key}：Array(${arr.length})`,
    //             children
    //           };
    //           treeArr.push(item);
    //         } else if (
    //           Object.prototype.toString.call(obj[key]) === '[object Object]'
    //         ) {
    //           const item = {
    //             label: key,
    //             children: this.transformToTreeData(obj[key])
    //           };
    //           treeArr.push(item);
    //         } else {
    //           const val = key + ' : ' + obj[key];
    //           treeArr.push({ label: val });
    //         }
    //       }
    //     }
    //   } else {
    //     treeArr.push({
    //       label: obj
    //     });
    //   }
    //   return treeArr;
    // },
    isObject(val) {
      try {
        let newVal = JSON.parse(val.slice(val.indexOf(' ') + 1));
        return Object.prototype.toString.call(newVal) === '[object Object]';
      } catch (error) {
        return false;
      }
    },
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