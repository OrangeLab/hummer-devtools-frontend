<template>
  <div class="containers" :class="{ resizing }" :style="style">
    <el-row>
      <el-col :span="6">
        <div class="col-title">TreeView</div>
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
      <div :class="'custom-tree-node'" slot-scope="{ node, data }">
        <span>
          <span v-text="'<'"></span>
          <span v-html="node.label"></span>
          <span v-text="'>'"></span>
        </span>
        <span v-if="data.name == 'text'">{{ data.text }}</span>
        <TreeViewImage
          v-if="data.name == 'image'"
          :imgUrl="data.src"
        ></TreeViewImage>
      </div>
    </el-tree>
    <VerResizerPan pan="tree" />
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
    };
  },
  computed: {
    ...mapState(["visiblePans"]),
    ...mapState({
      pageInfoMap: (state) => state.pageInfoMap,
    }),
    viewTreeData() {
      return (
        (this.pageInfoMap[this.tenonId] &&
          this.pageInfoMap[this.tenonId].viewTreeData) ||
        []
      );
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
      this.$refs?.treeEl&&this.$refs.treeEl.setCurrentKey(viewId);
    });
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
</style>
