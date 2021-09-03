
import Vue from 'vue'
import Vuex from 'vuex'
import { processViewTree } from '@/utils/processViewTree'

Vue.use(Vuex)

const state = () => ({
  logList: [],
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
    console.log(1111111)
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
        className:  msg.params.className
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