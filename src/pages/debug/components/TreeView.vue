<template>
  <div class="view-tree-container containers" :class="{ resizing }" :style="style">
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
</template>

<script>
import { mapState } from 'vuex'
import VerResizerPan from './VerResizerPan'
import panPosition from '@/utils/pan-position'
import Event from '@/utils/event'
export default {
  props: {
    resizing: Boolean,
    baseInfo: {
      type: Object,
      default: () => ({})
    },
    viewTree: {
      type: Array,
      default: () => ([])
    }
  },
  components: {
    VerResizerPan
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      style: {},
      pan: 'tree'
    }
  },
  computed: {
    ...mapState(['visiblePans'])
  },
  mounted() {
    this.pageInit()
  },
  watch: {
    visiblePans: {
      immediate: true,
      handler(val) {
        this.style = panPosition(val, 'tree')
      }
    }
  },
  methods: {
    pageInit() {
      Event.$on(`set-${this.pan}-pan-style`, style => {
        this.style = {
          ...this.style,
          ...style
        }
      })
    },
    handleNodeClick(data) {
      this.$emit('getViewInfo', {
        viewId: data.__view_id
      })
    }
  }
};
</script>

<style scoped lang="scss">
  @import "@/styles/common.scss";
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
