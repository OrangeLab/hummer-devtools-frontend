<template>
  <div class="network-container">
    <el-table
      :data="netWorkList"
      border
      row-key="params.id"
      style="width: 100%"
      empty-text="暂无请求"
      :row-class-name="rowClassName"
    >
      <el-table-column type="expand">
        <template slot="header">
          <i class="el-icon-circle-close" @click="clearNetWork"></i>
        </template>
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="Request URL">
              <span>{{ props.row.params.requestInfo.url }}</span>
            </el-form-item>
            <el-form-item label="Request Method">
              <span>{{ props.row.params.requestInfo.method }}</span>
            </el-form-item>
            <el-form-item label="Status Code">
              <span>{{ props.row.params.responseInfo.status }}</span>
            </el-form-item>
            <el-form-item label="Request Header">
              <div
                v-for="(value, key, index) in props.row.params.requestInfo
                  .header"
                :key="index"
              >
                {{ key }} : {{ value }}
              </div>
            </el-form-item>
            <el-form-item label="Request param">
              <Detail
                :detailValue="props.row.params.requestInfo.param"
                detailIndex="0"
              ></Detail>
            </el-form-item>
            <el-form-item label="Response Header">
              <div
                v-for="(value, key, index) in props.row.params.responseInfo
                  .header"
                :key="index"
              >
                {{ key }} : {{ value }}
              </div>
            </el-form-item>
            <el-form-item label="Response Data">
              <Detail
                :detailValue="props.row.params.responseInfo.data"
                detailIndex="0"
              ></Detail>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="params.requestInfo.name" label="Name" width="280">
      </el-table-column>
      <el-table-column
        prop="params.responseInfo.status"
        label="Status"
        width="100"
      >
      </el-table-column>
      <el-table-column prop="params.requestInfo.method" label="Method">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import Detail from "./logDetail";
export default {
  name: "Network",
  components: {
    Detail,
  },
  data() {
    return {};
  },
  computed: {
    netWorkList() {
      let netWorkList = this.$store.state.netWorkList;
      console.log(netWorkList);
      netWorkList.forEach((item) => {
        let url = item.params.requestInfo.url;
        item.params.requestInfo.name = url.substring(
          url.lastIndexOf("/") + 1,
          url.length
        );
        !item?.params?.responseInfo &&
          ((item.params.responseInfo = {}),
          (item.params.responseInfo.status = "pending"));
        item.params.error = new RegExp("^[4,5].*$").test(
          item?.params?.responseInfo?.status
        );
      });
      console.log("fyqfyqfyq", netWorkList);
      return netWorkList;
    },
  },
  methods: {
    rowClassName({ row, rowIndex }) {
      console.log(row);
      if (row?.params?.error) {
        return "network-error";
      }
      return "";
    },
    clearNetWork() {
      this.$store.commit("clearNetWorkList");
    },
  },
};
</script>
<style lang="less" scoped>
.network-container {
  /deep/.network-error {
    color: red;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
  /deep/.el-form-item__label {
    font-weight: bold;
  }
  /deep/.can-unfold {
    &::before {
      left: -8px;
      top: 15px;
    }
    &.unfolded {
      &::before {
        left: -10px;
        top: 18px;
      }
    }
  }
  .el-icon-circle-close {
    font-size: 18px;
    cursor: pointer;
    color: #409eff;
  }
}
</style>















