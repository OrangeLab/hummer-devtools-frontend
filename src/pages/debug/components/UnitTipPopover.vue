<template>
  <div class="unit-tip-popover-container">
    <el-popover
      :placement="placement"
      width="400"
      trigger="click"
      popper-class="unit-tip-popover"
    >
      <div class="card">
        <p>
          Hummer 中支持的长度单位主要有三种：<strong>纯数值</strong>、<strong>px</strong>和 <strong>hm</strong>，如：
        </p>
        <ul>
          <li>
            <code>100</code>: 以 <code>dp</code> 或 <code>pt</code> 为单位；
          </li>
          <li><code>'100px'</code>: 以 <code>px</code> 为单位；</li>
          <li><code>'100hm'</code>: 以 <code>hm</code> 为单位；</li>
        </ul>
        <p>
          其中，<code>hm</code>是指全屏宽度为<code>750hm</code>下的逻辑单位。
        </p>
      </div>
      <i slot="reference" class="el-icon-question"></i>
    </el-popover>
  </div>
</template>

<script>
export default {
  props: {
    placement: {
      type: String,
      default: "left",
    },
  },
  data() {
    return {};
  },
  mounted() {},
  watch: {},
  methods: {},
};
</script>

<style lang="less" scoped>
.unit-tip-popover {
  .card {
    p {
      color: #34495e;
      font-size: 15px;
      line-height: 26px;
    }
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      li {
        position: relative;
        margin: 5px 0 5px 10px;
        padding-left: 15px;
        color: #34495e;
        font-size: 15px;
        line-height: 26px;
        &::before {
          position: absolute;
          top: 0;
          left: 0;
          box-sizing: border-box;
          width: 6px;
          height: 6px;
          margin-top: 10px;
          border: 1px solid #666;
          border-radius: 50%;
          content: "";
        }
        code {
          display: inline;
          margin: 0 2px;
          padding: 2px 5px;
          font-size: 14px;
          font-family: inherit;
          word-break: keep-all;
          background-color: #f7f8fa;
          border-radius: 4px;
          -webkit-font-smoothing: antialiased;
        }
      }
    }
  }
}
</style>