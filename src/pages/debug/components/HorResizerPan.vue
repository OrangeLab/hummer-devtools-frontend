<template>
  <div
    class="pan-resizer"
    :class="{ resizing }"
    ref="resizer"
    @mousedown="handleMouseDown">
  </div>
</template>

<script>
import Event from '@/utils/event'
export default {
  props: ['pan'],
  components: {

  },
  data() {
    return {
      resizing: false,
      currentPan: null,
      nextPan: null,
      visiblePans: ['console']
    }
  },
  computed: {
    nextPanName() {
      const currentIndex = this.visiblePans.indexOf(this.pan)
      return this.visiblePans[currentIndex + 1]
    }
  },
  created() {
  },
  watch: {
  },
  methods: {
    updatePrePan(style) {
      Event.$emit('set-tab-pan-style', style)
    },
    updateCurrentPan(style) {
      Event.$emit(`set-${this.pan}-pan-style`, style)
    },
    handleMouseDown() {
      this.resizing = true
      this.currentPan = this.$refs.resizer.parentNode

      document.addEventListener('mousemove', this.handleMouseMove)
      document.addEventListener('mouseup', this.handleMouseUp)
    },
    handleMouseUp() {
      this.resizing = false
      document.removeEventListener('mousemove', this.handleMouseMove)
      document.removeEventListener('mouseup', this.handleMouseUp)
    },
    handleMouseMove(e) {
      if (this.resizing) {
        e.preventDefault()
        const newCurrentPanHeight = window.innerHeight - e.clientY
        const newPrePanHeight = e.clientY
        // TODO 定义阀值
        this.updateCurrentPan({ height: `${newCurrentPanHeight}px` })
        this.updatePrePan({ height: `${newPrePanHeight}px` })
      }
    },
  }
};
</script>

<style scoped lang="scss">
  .pan-resizer {
    width: 100%;
    height: 5px;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    border-top: 1px solid #e2e2e2;
    z-index: 1000;
    &:hover {
      cursor: ns-resize;
      border-top: 2px solid #39f;
    }
    &.resizing {
      cursor: row-resize;
      border-top: 2px solid #39f;
    }
  }
</style>
