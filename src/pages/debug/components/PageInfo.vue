<template>
  <div class="page-info-container containers" :class="{ resizing }" :style="style">
    <div class="col-title flex">
      <div class="col-title-text">PageInfo</div>
      <UnitTipPopover placement="right"></UnitTipPopover>
    </div>
    <div class="info-item" v-for="(value, key) in baseInfo" :key="key">
      <span class="item-key">{{ key }}</span>
      <span class="item-value">{{ value }}</span>
    </div>
    <VerResizerPan :pan="pan" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import VerResizerPan from './VerResizerPan'
import UnitTipPopover from './UnitTipPopover'
import panPosition from '@/utils/pan-position'
import Event from '@/utils/event'
export default {
  props: {
    resizing: Boolean,
    baseInfo: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    VerResizerPan,
    UnitTipPopover,
  },
  data() {
    return {
      style: {},
      pan: 'page'
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
        this.style = panPosition(val, 'page')
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
    }
  }
};
</script>

<style scoped lang="scss">
  @import "@/styles/common.scss";
  .flex{
    display: flex;
    align-items: center;
    .col-title-text{
      margin-right: auto;
    }
  }
</style>
