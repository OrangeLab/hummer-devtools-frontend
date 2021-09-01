<template>
  <div class="view-tree-comp">
    <div class="page-info-container containers" :class="{ resizing }" :style="pageStyle">
      <div class="col-title">PageInfo</div>
      <div class="info-item" v-for="(value, key) in baseInfo" :key="key">
        <span class="item-key">{{key}}</span>
        <span class="item-value">{{value}}</span>
      </div>
      <VerResizerPan pan="page" />
    </div>
    <div class="view-tree-container containers" :class="{ resizing }" :style="treeStyle">
      <div class="col-title">TreeView</div>
      <el-tree
        :expand-on-click-node="false"
        :highlight-current="true"
        :data="viewTree"
        :props="defaultProps"
        @node-click="handleNodeClick">
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <span v-text="`<${node.label}>`"></span>
          <span v-if="node.label == 'text'">{{ data.text }}</span>
          <el-image 
            v-if="node.label == 'image'"
            style="width: 100px; height: 40px"
            :src="data.src" 
            :preview-src-list="[data.src]">
          </el-image>
        </div>
      </el-tree>
      <VerResizerPan pan="tree" />
    </div>
    <div class="view-info-container containers" :class="{ resizing }" :style="viewStyle">
      <div class="col-title">ViewInfo</div>
      <el-collapse v-model="activeCollapseNames">
        <el-collapse-item title="RectInfo" name="1" v-if="currentViewInfo.rect">
          <div class="info-item" v-for="(value, key) in currentViewInfo.rect" :key="key">
            <span class="item-key">{{key}}</span>
            <span class="item-value">{{value}}</span>
          </div>
        </el-collapse-item>
        <el-collapse-item title="Style" name="2" v-if="currentViewInfo.style">
          <div class="info-item" v-for="(value, key) in currentViewInfo.style" :key="key">
            <span class="item-key">{{key}}</span>
            <span class="item-value">{{value}}</span>
          </div>
        </el-collapse-item>
        <el-collapse-item title="Class" name="3" v-if="currentViewInfo.className">
          <div class="info-item">
            <span class="item-key">{{currentViewInfo.className}}</span>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>

</template>
<script>
import { mapState } from 'vuex'
import VerResizerPan from './VerResizerPan'
import panPosition from '@/utils/pan-position'
import Event from '@/utils/event'
export default {
  props: {
    tenonId: [String, Number]
  },
  components: {
    VerResizerPan
  },
  watch: {
    visiblePans: {
      immediate: true,
      handler(val) {
        this.pageStyle = panPosition(val, 'page')
        this.treeStyle = panPosition(val, 'tree')
        this.viewStyle = panPosition(val, 'view')
      }
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      viewTreeContainerWidth: 800,
      activeCollapseNames: ['1', '2', '3'],
      pageStyle: {},
      treeStyle: {},
      viewStyle: {},
      resizing: false
    }
  },
  computed: {
    ...mapState(['visiblePans']),
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
    handleNodeClick(data) {
      console.log(data);
      this.$emit('getViewInfo', {
        tenonId: this.tenonId,
        viewId: data.__view_id
      })
    },
    pageInit() {
      this.visiblePans.forEach(pan => {
        Event.$on(`set-${pan}-pan-style`, style => {
          this[`${pan}Style`] = {
            ...this[`${pan}Style`],
            ...style
          }
        })
      });
      Event.$on('mouse-up-event', resizing => {
        this.resizing = resizing
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
.col-title{
  font-size: 24px;
  color: #409EFF;
}
.containers {
  position: absolute;
  height: 100%;
  padding: 5px;
  overflow-y: scroll;
  top: 0;
  bottom: 0;
  box-sizing: border-box;
  border-right: 1px solid gainsboro;
  &:nth-child(3) {
    border: none
  }
  &.resizing {
    cursor: col-resize;
  }
}
.page-info-container {
  // display: inline-flex;
  // background-color: deepskyblue;
  // flex-direction: column;
}
.view-tree-container{
  // display: inline-block;
}
.view-info-container{
}
.info-item{
  display: flex;
  padding: 5px;
  span{
    display: inline-block;
    color: #909399;
    font-size: 12px;
  }
  .item-key{
    width: 140px;
  }
  .item-value{
    width: 140px;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>