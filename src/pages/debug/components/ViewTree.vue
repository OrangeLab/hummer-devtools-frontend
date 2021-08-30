<template lang="">
  <div class="view-tree-comp">
    <div class="view-tree-container" :style="viewTreeContainerStyle">
      <div class="page-info">
        <div class="col-title">PageInfo</div>
        <div class="page-info-item" v-for="(value, key) in baseInfo" :key="key">
          <span class="item-key">{{key}}</span>
          <span class="item-value">{{value}}</span>
        </div>
      </div>
      <div class="view-tree">
        <div class="col-title">TreeView</div>
        <el-tree
          :expand-on-click-node="false"
          :highlight-current="true"
          :data="viewTree"
          :props="defaultProps"
          @node-click="handleNodeClick"
        >
          <div class="custom-tree-node" slot-scope="{ node, data }">
            <span v-text="`<${node.label}>`"></span>
            <span v-if="node.label == 'text'">{{ data.text }}</span>
            <!-- <el-button
              v-if="node.label == 'image'"
              type="text"
              size="mini">
              {{ data.src }}
            </el-button> -->
            <el-image 
              v-if="node.label == 'image'"
              style="width: 100px; height: 40px"
              :src="data.src" 
              :preview-src-list="[data.src]">
            </el-image>
          </div>
        </el-tree>
      </div>
    </div>
    <div class="view-info-container" :style="viewInfoStyle">
      <div class="col-title">ViewInfo</div>
      <el-collapse v-model="activeCollapseNames">
        <el-collapse-item title="RectInfo" name="1" v-if="currentViewInfo.rect">
          <div class="view-info-item" v-for="(value, key) in currentViewInfo.rect" :key="key">
            <span class="item-key">{{key}}</span>
            <span class="item-value">{{value}}</span>
          </div>
        </el-collapse-item>
        <el-collapse-item title="Style" name="2" v-if="currentViewInfo.style">
          <div class="view-info-item" v-for="(value, key) in currentViewInfo.style" :key="key">
            <span class="item-key">{{key}}</span>
            <span class="item-value">{{value}}</span>
          </div>
        </el-collapse-item>
        <el-collapse-item title="Class" name="3" v-if="currentViewInfo.className">
          <div class="view-info-item">
            <span class="item-key">{{currentViewInfo.className}}</span>
          </div>
        </el-collapse-item>
      </el-collapse>
      
    </div>
  </div>
  
    
</template>
<script>
import { mapState } from 'vuex'

export default {
  props: {
    tenonId: [String, Number]
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // viewTreeContainerWidth: 1500,
      viewTreeContainerWidth: 800,
      activeCollapseNames: ['1', '2', '3']
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
    viewTreeContainerStyle() {
      return `width: ${this.viewTreeContainerWidth}px;`
    },
    viewInfoStyle() {
      return `width: calc(100% - ${this.viewTreeContainerWidth}px);`
    }
  },
  created() {
    this.$emit('getViewTree', this.tenonId)
  },
  mounted() {

  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
      this.$emit('getViewInfo', {
        tenonId: this.tenonId,
        viewId: data.__view_id
      })
    }
  },
}
</script>
<style lang="less">
.view-tree-comp{
  height: 100%;
  display: flex;
  overflow: scroll;
}
.col-title{
  font-size: 24px;
  color: #409EFF;
}
.view-tree-container{
  height: 100%;
  display: inline-flex;
  .page-info{
    // display: inline-block;
    padding: 5px;
    box-sizing: border-box;
    border-right: 1px solid gainsboro;

    width: 300px;
    .page-info-item{
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
  }
  .view-tree{
    // display: inline-block;
    padding: 5px;
    box-sizing: border-box;
    height: 100%;
    width: calc(100% - 300px);
    border-right: 1px solid gainsboro;

  }
}
.view-info-container{
  box-sizing: border-box;
  display: inline-block;
  padding: 5px;
  height: 100%;
  overflow-y: scroll;
  .view-info-item{
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