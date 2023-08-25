<template>
  <div class="containers" v-loading="loading" :class="{ resizing }" ref="containers" :style="style">
    <div class="resizerBox">
      <el-row>
        <el-col :span="6">
          <div class="col-title">
            <span>TreeView</span>&nbsp;
            <div @click="refreshView" title="刷新">
              <el-icon class="refresh" name="refresh" />
            </div>
          </div>
          
        </el-col>
        <el-col :span="12" :offset="6">
          <el-input
            placeholder="请输入组件名"
            v-model="tagName"
            @input="handleSearchTag"
            clearable
          >
          </el-input>
        </el-col>
      </el-row>
      <el-tree
        :expand-on-click-node="false"
        :highlight-current="true"
        :data="treeData"
        ref="treeEl"
        node-key="__view_id"
        :default-expand-all="true"
        @node-click="handleNodeClick"
      >
        <div :class="'custom-tree-node'" slot-scope="{ node, data }" >
          <div  :style="{ display: data.style && data.style.display ? data.style.display : 'inline-block' }">
            <span>
              <span v-text="'<'"></span>
              <span v-html="node.label"></span>
              <span v-text="'>'"></span>
            </span>
            <span v-if="data.name == 'text'" >{{ data.text }}</span>
            <TreeViewImage
              v-if="data.name == 'image'"
              :imgUrl="data.src"
            ></TreeViewImage>
          </div>

        </div>
      </el-tree>
      <VerResizerPan pan="tree" :parentNode="refContainers" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import VerResizerPan from "./VerResizerPan";
import TreeViewImage from "./TreeViewImage";
import panPosition from "@/utils/pan-position";
import Event from "@/utils/event";
export default {
  props: {
    resizing: Boolean,
    loading: Boolean,
    baseInfo: {
      type: Object,
      default: () => ({}),
    },
    tenonId: Number,
  },
  components: {
    VerResizerPan,
    TreeViewImage,
  },
  data() {
    return {
      style: {},
      pan: "tree",
      tagName: "",
      matchedKeys: [], // ids
      cloneTreeData: [],
      refContainers: null,
    };
  },
  computed: {
    ...mapState(["visiblePans"]),
    ...mapState({
      pageInfoMap: (state) => state.pageInfoMap,
    }),
    viewTreeData() {
      let arrayData = this.pageInfoMap[this.tenonId] && this.pageInfoMap[this.tenonId].viewTreeData || []
      
      // 保留 没有 style 的 和 display 不为 none 的
      const recursion = data => {
        const treeData = data.filter(item => !item.style || item.style.display !== 'none')
        treeData.forEach(x => x.children && (x.children = recursion(x.children)))
        return treeData
      }
      recursion(arrayData)

      return arrayData
    },
    treeData() {
      return this.tagName ? this.cloneTreeData : this.viewTreeData;
    },
    labelReg() {
      return this.tagName ? RegExp(`${this.tagName}`) : "";
    },
  },
  mounted() {
    this.pageInit();
    Event.$on("set-current-key", (viewId) => {
      this.$refs?.treeEl && this.$refs.treeEl.setCurrentKey(viewId);
    });
    this.refContainers = this.$refs.containers;
  },
  watch: {
    visiblePans: {
      immediate: true,
      handler(val) {
        this.style = panPosition(val, "tree");
      },
    },
  },
  methods: {
    pageInit() {
      Event.$on(`set-${this.pan}-pan-style`, (style) => {
        this.style = {
          ...this.style,
          ...style,
        };
      });
    },
    handleNodeClick(data) {
      console.log("data", data);
      this.$emit("getViewInfo", {
        viewId: data.__view_id,
      });
    },
    handleSearchTag() {
      if (this.tagName) {
        const data = JSON.parse(JSON.stringify(this.viewTreeData));
        const matchData = this.matchViewTreeData(data);
        // console.log('matchData', matchData)
        this.$set(this, "cloneTreeData", matchData);
      }
    },
    matchViewTreeData(data) {
      const that = this;
      return data.map((item) => {
        return item.children && item.children.length
          ? {
              ...item,
              label: that.labelReg.test(item.label)
                ? item.label.replace(
                    that.labelReg,
                    `<mark>${that.tagName}</mark>`
                  )
                : item.label,
              children: that.matchViewTreeData(item.children),
            }
          : {
              ...item,
              label: that.labelReg.test(item.label)
                ? item.label.replace(
                    that.labelReg,
                    `<mark>${that.tagName}</mark>`
                  )
                : item.label,
            };
      });
    },
    refreshView(){
      this.$emit("refreshView")
    }
  },
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
.containers{
  padding:0;
}
.resizerBox {
  position: relative;
  padding: 5px;
  .refresh{
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
  }
}
</style>
