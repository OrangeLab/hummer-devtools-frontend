<template>
  <div class="view-tree-comp">
    <PageInfo :baseInfo="baseInfo" />
    
    <TreeView :tenonId="tenonId" @getViewInfo="getViewInfo" />
    
    <ViewInfo :currentViewInfo="currentViewInfo" @setViewStyle="setViewStyle" />
  </div>

</template>
<script>
import { mapState } from 'vuex'
import Event from '@/utils/event'
import PageInfo from './PageInfo.vue'
import TreeView from './TreeView.vue'
import ViewInfo from './ViewInfo.vue'
export default {
  props: {
    tenonId: [String, Number]
  },
  components: {
    PageInfo,
    TreeView,
    ViewInfo
  },
  watch: {
  },
  data() {
    return {
      resizing: false
    }
  },
  computed: {
    ...mapState({
      pageInfoMap: state => state.pageInfoMap
    }),
    viewTree() {
      return this.pageInfoMap[this.tenonId] && this.pageInfoMap[this.tenonId].viewTree || []
    },
    baseInfo() {
      return this.pageInfoMap[this.tenonId] && this.pageInfoMap[this.tenonId].baseInfo || {}
    },
    currentViewInfo() {
      return this.pageInfoMap[this.tenonId] && this.pageInfoMap[this.tenonId].currentViewInfo || {}
    },
  },
  created() {
    this.$emit('getViewTree', this.tenonId)
  },
  mounted() {
    this.pageInit()
  },
  methods: {
    getViewInfo(data) {
      const { viewId } = data
      this.$emit('getViewInfo', {
        tenonId: this.tenonId,
        viewId
      })
    },
    pageInit() {
      Event.$on('mouse-up-event', resizing => {
        this.resizing = resizing
      })
    },
    setViewStyle() {
      // Todo 模拟数据
      this.$emit('setViewStyle', {
        tenonId: this.tenonId,
        style: {
          backgroundColor: 'red',
        },
        viewId: 1
      })
    }
  },
}
</script>
<style scoped lang="scss">
.view-tree-comp {
  position: relative;
  height: 100%;
  display: flex;
  overflow: scroll;
}
</style>