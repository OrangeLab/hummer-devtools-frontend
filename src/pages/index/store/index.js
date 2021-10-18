
import Vue from 'vue'
import Vuex from 'vuex'
import { processViewTree } from '@/utils/processViewTree'

Vue.use(Vuex)

const state = () => ({
  logList: [],
  netWorkList: [],
  pageList: [],
  pageInfoMap: {},
  defaultActivePage: {},
  activePan: 'console',
  visiblePans: ['page', 'tree', 'view'],
})

// getters
const getters = {}

// actions
const actions = {
  setActivePan({ commit }, pan) {
    commit('ACTIVE_PAN', pan)
  },
}

// mutations
const mutations = {
  updateNetWorkList (state, msg) {
    console.log(msg)
    state.netWorkList.push(msg)
  },
  clearNetWorkList (state) {
    state.netWorkList = []
  },
  updateLogList (state, msg) {
    console.log(msg)
    state.logList.push(msg.params)
  },
  clearLogList (state) {
    state.logList = []
  },
  updatePageList (state, msg) {
    state.pageList = msg.params.pageList
    if (state.pageList && state.pageList.length) {
      Vue.set(state.defaultActivePage, state.pageList[0])
    }
  },
  updatePageInfoMap (state, msg) {
    Vue.set(state.pageInfoMap, msg.params.tenonId, {
      
      viewTree: msg.params.viewTree,
      baseInfo: msg.params.baseInfo,
      viewTreeData: processViewTree(msg.params.viewTree)
    })
  },
  updateViewInfo (state, msg) {
    Vue.set(state.pageInfoMap, msg.params.tenonId, {
      ...state.pageInfoMap[msg.params.tenonId],
      currentViewInfo: {
        rect: msg.params.rect,
        style: msg.params.style,
        className:  msg.params.className,
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