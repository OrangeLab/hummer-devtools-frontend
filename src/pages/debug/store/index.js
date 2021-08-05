
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = () => ({
  logList: [],
  pageList: [],
  pageInfoMap: {}
})

// getters
const getters = {}

// actions
const actions = {

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
  },
  updatePageInfoMap (state, msg) {
    console.log(1111111)
    Vue.set(state.pageInfoMap, msg.params.tenonId, {
      
      viewTree: msg.params.viewTree,
      baseInfo: msg.params.baseInfo
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
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})