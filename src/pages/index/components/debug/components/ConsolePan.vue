<template>
  <div class="console-pan" @click="setActivePan('console')" :style="style">
    <el-tabs
      type="border-card"
      ref="toolsContainer"
      v-model="currentTool"
      id="tools-container"
    >
      <el-tab-pane label="CONSOLE" name="console" style="height: 100%">
        <Console />
      </el-tab-pane>
      <el-tab-pane label="NETWORK" name="network" style="height: 100%">
        <Network />
      </el-tab-pane>
      <el-tab-pane label="STORAGE" name="storage" style="height: 100%">
        <Storage :tenonIp="currentTenonIp" @setStorage="setStorage" />
      </el-tab-pane>
      <el-tab-pane label="MEMORY" name="memory" style="height: 100%"
        >在做了(新建文件夹</el-tab-pane
      >
    </el-tabs>
    <hor-resizer-pan pan="console"></hor-resizer-pan>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Console from "./Console.vue";
import Network from "./Network.vue";
import Storage from "./Storage.vue";
import HorResizerPan from "./HorResizerPan.vue";
import Event from "@/utils/event";
export default {
  props: {
    toolsContainerStyle: {
      type: String,
      default: "",
    },
    currentTenonIp:{
      type: String,
    },
    currentTenonId:{
      type: String,
    }
  },
  components: {
    Console,
    HorResizerPan,
    Network,
    Storage,
  },
  data() {
    return {
      currentTool: "console",
      style: {},
    };
  },
  computed: {
    tabContainerHeight() {
      return "";
    },
  },
  mounted() {
    this.panInit();
  },
  watch: {},
  methods: {
    ...mapActions(["setActivePan"]),
    panInit() {
      Event.$on(`set-console-pan-style`, (style) => {
        this.style = {
          ...this.style,
          ...style,
        };
      }),
        (this.style = this.toolsContainerStyle);
    },
    setStorage(storage) {
      this.$emit('setStorage', this.currentTenonId,storage)
    },
  },
};
</script>

<style scoped lang="scss">
.console-pan {
  position: absolute;
  width: 100%;
  bottom: 5px;
  left: 0;
  right: 0;
  z-index: 2001;
}
#tools-container {
  height: inherit;
  box-sizing: border-box;
}
</style>
