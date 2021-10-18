<template>
  <div class="empty">
    <h2>快速开始</h2>
    <ul class="novice-guidance">
      <li>扫一扫左下角二维码进行视图调试，查看视图树和样式。</li>
      <li>选中视图树某个视图节点，会在移动端页面中高亮该控件。</li>
      <li>编辑右侧样式的值可以实时修改和刷新页面样式。</li>
      <li>可以在下方控制台查看页面日志的输出。</li>
      <li>点击左侧页面列表项来进行页面切换。</li>
    </ul>
    <h2>相关文档</h2>
    <ul class="related-documents">
      <li><a href="https://hummer.didi.cn">Hummer 官网</a></li>
      <li><a href="https://hummer.didi.cn/doc#/zh-CN/">Hummer 开发文档</a></li>
      <li>
        <a href="https://hummer.didi.cn/doc-tenon#/zh-CN/">Tenon 开发文档</a>
      </li>
      <li><a href="https://github.com/didi/Hummer">Hummer Github</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
.empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  .novice-guidance{
      list-style: none;
      li {
        position: relative;
        &:before {
            position: absolute;
            top: -3px;
            left: -16px;
            box-sizing: border-box;
            width: 6px;
            height: 6px;
            margin-top: 10px;
            border: 1px solid #666;
            border-radius: 50%;
            content: "";
        }
      }
  }
  .related-documents {
    list-style: none;
    li {
      position: relative;
      &:before {
        height: 11px;
        width: 3px;
        background: #67c23a;
        content: "";
        position: absolute;
        top: 6px;
        left: -16px;
      }
      a {
        color: #4183c4;
        text-decoration: none;
        &:hover{
            color: #67c23a;
        }
      }
    }
  }
}
</style>
