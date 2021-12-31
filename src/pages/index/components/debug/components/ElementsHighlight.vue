<template>
  <div
    class="dokit-elements-highlight"
    :style="`
          top: ${highlightElementInfo.windowTop}px;
          left: ${highlightElementInfo.windowLeft}px;
        `"
  >
    <div class="dokit-elements-indicator">
      <div
        class="dokit-margin"
        :style="`
          left: -${highlightElementInfo.marginLeft}px;
          top: -${highlightElementInfo.marginTop}px;
          width: ${highlightElementInfo.offsetWidth}px;
          height: ${highlightElementInfo.offsetHeight}px;
          border-width: ${highlightElementInfo.marginTop}px ${highlightElementInfo.marginRight}px ${highlightElementInfo.marginBottom}px ${highlightElementInfo.marginLeft}px;
          border-style: solid;
          border-color: rgba(246, 178, 107, 0.66);
        `"
      ></div>
      <div
        class="dokit-border"
        :style="`
          left: 0px;
          top:0px;
          width: ${highlightElementInfo.offsetWidth}px;
          height: ${highlightElementInfo.offsetHeight}px;
          border-width: ${highlightElementInfo.borderTopWidth}px ${highlightElementInfo.borderRightWidth}px ${highlightElementInfo.borderBottomWidth}px ${highlightElementInfo.borderLeftWidth}px;
          border-style: solid;
          border-color: rgba(255, 229, 153, 0.66);
        `"
      ></div>
      <div
        class="dokit-padding"
        :style="`
          left: ${highlightElementInfo.borderLeftWidth}px;
          top: ${highlightElementInfo.borderTopWidth}px;
          width: ${highlightElementInfo.contentWidth}px;
          height: ${highlightElementInfo.contentHeight}px;
          border-width: ${highlightElementInfo.paddingTop}px ${highlightElementInfo.paddingRight}px ${highlightElementInfo.paddingBottom}px ${highlightElementInfo.paddingLeft}px;
          border-style: solid;
          border-color: rgba(147, 196, 125, 0.55);
        `"
      ></div>
      <div
        class="dokit-content"
        :style="`
          left: ${contentLeft};
          top: ${contentTop};
          width: ${highlightElementInfo.contentWidth}px;
          height: ${highlightElementInfo.contentHeight}px;
          background: rgba(111, 168, 220, 0.66);
        `"
      ></div>
    </div>
    <div class="dokit-elements-size" :style="isOverfllow">
      <span class="nodeName">{{ highlightElementInfo.nodeName }}</span>
      <span v-if="highlightElementInfo.id !== ''" class="nodeaId">{{
        `#${highlightElementInfo.id}`
      }}</span>
      <span v-if="highlightElementInfo.className !== ''" class="nodeaClass">{{
        `.${highlightElementInfo.className}`
      }}</span>
      <span> | {{ highlightElementInfo.offsetWidth }} × {{ highlightElementInfo.offsetHeight }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    highlightElementInfo: Object,
  },
  data() {
    return {};
  },
  computed: {
    isOverfllow() {
      let offsetTop =
        this.highlightElementInfo.windowTop +
        this.highlightElementInfo.marginTop;
      if (offsetTop < 25) {
        return `
          top: 0px;
          left: 0px;
        `;
      } else {
        return `
          top: ${-25 - this.highlightElementInfo.marginTop}px;
          left: ${-this.highlightElementInfo.marginLeft}px;
        `;
      }
    },
    contentLeft() {
      let elPaddingLeft = parseInt(this.highlightElementInfo.paddingLeft);
      let elBorderLeftWidth = parseInt(this.highlightElementInfo.borderLeftWidth);
      return `${elPaddingLeft + elBorderLeftWidth}px`;
    },
    contentTop() {
      let elPaddingTop = parseInt(this.highlightElementInfo.paddingTop);
      let elBorderTopWidth = parseInt(this.highlightElementInfo.borderTopWidth);
      return `${elPaddingTop + elBorderTopWidth}px`;
    },
  },
};
</script>

<style lang="less" scoped>
.dokit-elements-highlight {
  position: absolute;
  z-index: -100;
  pointer-events: none !important;
  .dokit-elements-indicator {
    position: absolute;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    & > * {
      pointer-events: none !important;
    }
    .dokit-margin,
    .dokit-border,
    .dokit-padding,
    .dokit-content {
      position: absolute;
    }
    .dokit-border {
      box-sizing: border-box;
    }
  }
  .dokit-elements-size {
    position: absolute;
    background: #fff;
    color: #222;
    font-size: 12px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    padding: 0 5px;
    white-space: nowrap;
    overflow-x: hidden;
    box-shadow: 0 2px 2px 0 rgb(0 0 0 / 5%), 0 1px 4px 0 rgb(0 0 0 / 8%),
      0 3px 1px -2px rgb(0 0 0 / 20%);
    .nodeName {
      color: #881280;
    }
    .nodeaId {
      color: #1a1aa8;
    }
    .nodeaClass {
      color: rgb(143, 73, 25);
    }
  }
}
</style>
