<template>
  <div class="storage-container">
    <el-table
      :data="newStateList"
      border
      row-key="key"
      style="width: 100%"
      empty-text="暂无数据"
      header-row-class-name="tableHead"
    >
      <el-table-column prop="key" align="center" label="key">
        <!-- <template slot-scope="scope">
          <el-input
            class="item-input"
            :class="{ 'item-input-active': scope.row.keyEditable }"
            v-model="scope.row.key"
            @click.native="handleStyleItem('editKey', scope.$index)"
            @focus="$event.target.select()"
            @blur="keyEditblur('keyEditable', scope.$index)"
          ></el-input>
        </template> -->
      </el-table-column>
      <el-table-column prop="value" align="center" label="value">
        <template slot-scope="scope">
          <el-input
            class="item-input"
            :class="{ 'item-input-active': scope.row.valEditable }"
            v-model="scope.row.value"
            @click.native="handleStyleItem('editValue', scope.$index)"
            @focus="$event.target.select()"
            @blur="keyEditblur('valEditable', scope.$index)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column width="80" align="right">
        <template slot="header">
          <el-button size="mini" type="success" @click="handleNew"
            >新增</el-button
          >
        </template>
        <template slot-scope="scope">
          <el-popconfirm
            title="确定删除吗？"
            @confirm="handleDelete(scope.$index)"
          >
            <el-button size="mini" type="danger" slot="reference"
              >删除</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="`${type} 新增`"
      append-to-body
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" :rules="rules" :ref="`${type}AddForm`">
        <el-form-item label="key" prop="key" :label-width="formLabelWidth">
          <el-input v-model.trim="form.key"></el-input>
        </el-form-item>
        <el-form-item label="value" prop="value" :label-width="formLabelWidth">
          <el-input v-model.trim="form.value"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Storage",
  components: {},
  props: {
    tenonIp: String,
    type: String,
  },
  data() {
    return {
      newStateList: [],
      dialogFormVisible: false,
      formLabelWidth: "120px",
      form: {
        key: "",
        value: "",
      },
      rules: {
        key: [{ required: true, message: "请输入内容", trigger: "blur" }],
        value: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
    };
  },
  computed: {
    stateList() {
      return this.$store.state[`${this.type.toLowerCase()}List`];
    },
  },
  watch: {
    stateList: {
      deep: true,
      handler(val) {
        // localStorage.setItem("devToolStorage", JSON.stringify(val));
        if (this.tenonIp) {
          this.newStateList = JSON.parse(JSON.stringify(val[this.tenonIp]));
          this.newStateList.forEach((item) => {
            item.keyEditable = false;
            item.valEditable = false;
          });
        }
      },
    },
    tenonIp: {
      immediate: true,
      handler(val) {
        if (this.stateList[val]) {
          this.newStateList = JSON.parse(JSON.stringify(this.stateList[val]));
          this.newStateList.forEach((item) => {
            item.keyEditable = false;
            item.valEditable = false;
          });
        }
      },
    },
  },
  methods: {
    submit() {
      this.$refs[`${this.type}AddForm`].validate((valid) => {
        if (valid) {
          const params = {
              tenonIp: this.tenonIp,
              key: this.form.key,
              value: this.form.value,
            },
            data = {
              key: this.form.key,
              value: this.form.value,
              type: "revise",
            };
          this.$store.commit(`update${this.type}List`, params);
          this.$emit("setData", data);
          this.form.key = "";
          this.form.value = "";
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    },
    handleDelete(index) {
      const data = {
        key: this.stateList[this.tenonIp][index].key,
        type: "delete",
      };
      this.newStateList.splice(index, 1);
      this.$store.commit(`set${this.type}List`, {
        tenonIp: this.tenonIp,
        storageAll: this.newStateList,
        memoryAll: this.newStateList,
      });
      this.$emit("setData", data);
    },
    handleNew() {
      this.dialogFormVisible = true;
    },
    handleStyleItem(type, index) {
      let data = JSON.parse(JSON.stringify(this.newStateList[index]));
      if (type === "editKey") {
        data.keyEditable = true;
      } else if (type === "editValue") {
        data.valEditable = true;
      }
      this.$set(this.newStateList, index, data);
    },
    keyEditblur(type, index) {
      this.newStateList[index][type] = false;
      let data;
      if (this.newStateList[index].key.trim() === "") {
        this.newStateList.splice(index, 1);
        this.$store.commit(`set${this.type}List`, {
          tenonIp: this.tenonIp,
          storageAll: this.newStateList,
          memoryAll: this.newStateList,
        });
        data = {
          key: this.stateList[this.tenonIp][index].key,
          type: "delete",
        };
        this.$emit("setData", data);
      } else if (
        this.newStateList[index].value.trim() !==
        this.stateList[this.tenonIp][index].value
      ) {
        this.$store.commit(`set${this.type}List`, {
          tenonIp: this.tenonIp,
          storageAll: this.newStateList,
          memoryAll: this.newStateList,
        });
        data = {
          key: this.newStateList[index].key.trim(),
          value: this.newStateList[index].value.trim(),
          type: "revise",
        };
        this.$emit("setData", data);
      }
    },
  },
};
</script>

<style scoped lang="less">
.storage-container {
  .item-input {
    /deep/.el-input__inner {
      height: 38px;
      line-height: 38px;
      border: none;
      padding-left: 0px;
    }
    &-active {
      /deep/.el-input__inner {
        border: 1px solid #dcdfe6;
      }
    }
  }
}
/deep/.el-table tbody tr:hover > td {
  background-color: #fff !important;
}
/deep/.el-table__header {
  width: 100% !important;
}
</style>