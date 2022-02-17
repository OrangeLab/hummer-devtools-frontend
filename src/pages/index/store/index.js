import Vue from 'vue'
import Vuex from 'vuex'
import {
  processViewTree
} from '@/utils/processViewTree'

Vue.use(Vuex)

const state = () => ({
  logList: [],
  netWorkList: [],
  storageList: {},
  memoryList: {},
  pageList: [],
  pageInfoMap: {},
  defaultActivePage: {},
  activePan: 'console',
  visiblePans: ['page', 'tree', 'view'],
  webPath:null,
  devToolType:null,
})

// getters
const getters = {}

// actions
const actions = {
  setActivePan({
    commit
  }, pan) {
    commit('ACTIVE_PAN', pan)
  },
}

// mutations
const mutations = {
  setStorageList(state, msg) {
    const {
      tenonIp,
      storageAll
    } = msg?.params || msg;
    Vue.set(state.storageList, tenonIp, storageAll)
  },
  updateStorageList(state, msg) {
    debugger
    const {
      tenonIp,
      key,
      value,
    } = msg.params||msg;
    let isHashKey = state.storageList[tenonIp]?.findIndex(item => item.key === key)
    if (isHashKey === -1 || isHashKey == undefined) {
      state.storageList[tenonIp]?.push(msg.params||msg)
    } else {
      if (state.storageList[tenonIp][isHashKey].value !== value) {
        let data = JSON.parse(JSON.stringify(state.storageList[tenonIp][isHashKey]))
        data.value = value
        Vue.set(state.storageList[tenonIp], isHashKey, data)
      }
    }
  },
  setMemoryList(state, msg) {
    const {
      tenonIp,
      memoryAll
    } = msg?.params || msg;
    Vue.set(state.memoryList, tenonIp, memoryAll)
  },
  updateMemoryList(state, msg) {
    const {
      tenonIp,
      key,
      value,
    } = msg.params||msg;
    let isHashKey = state.memoryList[tenonIp]?.findIndex(item => item.key === key)
    if (isHashKey === -1 || isHashKey == undefined) {
      state.memoryList[tenonIp]?.push(msg.params||msg)
    } else {
      if (state.memoryList[tenonIp][isHashKey].value !== value) {
        let data = JSON.parse(JSON.stringify(state.memoryList[tenonIp][isHashKey]))
        data.value = value
        Vue.set(state.memoryList[tenonIp], isHashKey, data)
      }
    }
  },
  updateNetWorkList(state, msg) {
    const {
      requestInfo,
      responseInfo,
      id
    } = msg.params;
    if (requestInfo) {
      state.netWorkList.push(msg)
    } else if (responseInfo) {
      let index = state.netWorkList.findIndex(e => e.params.id === id)
      let data = JSON.parse(JSON.stringify(state.netWorkList[index]))
      data.params.responseInfo = responseInfo
      Vue.set(state.netWorkList, index, data)
    }
    console.log(state.netWorkList)
  },
  clearNetWorkList(state) {
    state.netWorkList = []
  },
  updateLogList(state, msg) {
    state.logList.push(msg.params)
  },
  clearLogList(state) {
    state.logList = []
  },
  updatePageList(state, msg) {
    state.pageList = msg.params.pageList
    if (state.pageList && state.pageList.length) {
      Vue.set(state.defaultActivePage, state.pageList[0])
    }
  },
  updatePageInfoMap(state, msg) {
    Vue.set(state.pageInfoMap, msg.params.tenonId, {
      webPath:msg.params?.path&&msg.params.path.split('.js')[0],
      viewTree: msg.params.viewTree,
      baseInfo: msg.params.baseInfo,
      viewTreeData: processViewTree(msg.params.viewTree)
    })
    state.devToolType = msg.params.devToolType
  },
  updateViewInfo(state, msg) {
    Vue.set(state.pageInfoMap, msg.params.tenonId, {
      ...state.pageInfoMap[msg.params.tenonId],
      currentViewInfo: {
        rect: msg.params.rect,
        style: msg.params.style,
        className: msg.params.className,
        viewId: msg.params.viewId
      }
    })
  },
  ACTIVE_PAN(state, pan) {
    state.activePan = pan
  },
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})