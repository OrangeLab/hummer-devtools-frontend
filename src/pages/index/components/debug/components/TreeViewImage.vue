<template>
  <div class="tree-view-image">
      <el-popover
        placement="top-start"
        popper-class="view-image-popover"
        trigger="hover">
        <div class="card">
            <img :src="imgUrl"/>
        </div>
        <div slot="reference">
          <span>src=</span>
          <span class="image-url">{{imgUrl}}</span>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
props: {
    imgUrl: {
      type: String,
    },
  },
  data() {
    return {
    };
  },
};
</script>

<style scoped lang="scss">
.tree-view-image{
    .image-url {
        color: rgb(52,116,224);
    }
}
.view-image-popover{
    .card{
        img{
            height: 100px;
        }
    }
}
</style>
