<template>
  <div class="containers" :class="{ resizing }" :style="style">
    <div class="col-title">ViewInfo</div>
    <button @click="handleStyle">测试样式</button>
    <el-collapse v-model="activeCollapseNames">
      <el-collapse-item title="RectInfo" name="1" v-if="currentViewInfo.rect">
        <div class="info-item" v-for="(value, key) in currentViewInfo.rect" :key="key">
          <span class="item-key">{{ key }}</span>
          <span class="item-value">{{ value + 'hm' }}</span>
        </div>
      </el-collapse-item>
      <el-collapse-item title="Style" name="2" v-if="currentViewInfo.style">
        <div class="info-item" v-for="(value, key) in currentViewInfo.style" :key="key">
          <span class="item-key">{{ key }}</span>
          <span class="item-value">{{ value }}</span>
        </div>
      </el-collapse-item>
      <el-collapse-item title="Class" name="3" v-if="currentViewInfo.className">
        <div class="info-item">
          <span class="item-key">{{ currentViewInfo.className }}</span>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Event from '@/utils/event'
import panPosition from '@/utils/pan-position'
export default {
  props: {
    resizing: Boolean,
    currentViewInfo: {
      type: Object,
      default: () => ({
        className: '',
        style: {},
        rect: {}
      })
    }
  },
  components: {
  },
  data() {
    return {
      style: {},
      pan: 'view',
      activeCollapseNames: ['1', '2', '3'],
    }
  },
  computed: {
    ...mapState(['visiblePans']),
  },
  mounted() {
    this.pageInit()
  },
  watch: {
    visiblePans: {
      immediate: true,
      handler(val) {
        this.style = panPosition(val, 'view')
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
    handleStyle() {
      this.$emit('setViewStyle')
    }
  }
};
</script>

<style scoped lang="scss">
  @import "@/styles/common.scss";
</style>
