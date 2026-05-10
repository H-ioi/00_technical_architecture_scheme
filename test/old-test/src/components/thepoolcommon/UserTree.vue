<!-- 树状选择器 -->
<template>
  <el-select
    style="width: 100%"
    v-model="labelModel"
    :placeholder="$t('consult.请选择')"
    @change="changeselect"
    multiple
    :disabled="disabled"
    :readonly="readonly"
  >
    <el-option :value="labelModel" style="height: auto; width: 500px">
      <el-tree
        ref="tree"
        :props="defaultProps"
        show-checkbox
        :data="treeData"
        node-key="id"
        highlight-current
        :default-checked-keys="checkedId"
        @check-change="handleCheckChange"
      ></el-tree>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    treeData: {
      type: Array,
      default: () => [],
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      // 输入框显示值
      labelModel: "",
      // 实际请求传值
      valueModel: "0",
      defaultProps: {
        children: "children",
        label: "label",
        value: "id",
        isLeaf: "is_leaf",
      },
      checkedId: [],
      showTree: false,
    };
  },
  created() {},
  methods: {
    focusselect() {
      this.showTree = true;
      this.$nextTick(() => {
        this.$refs.tree.setCheckedNodes([]);
      });
    },
    handleCheckChange(data, checked, node) {
      let res = this.$refs.tree.getCheckedNodes();
      let arrLabel = [];
      let arrid = [];
      res.forEach((item) => {
        console.log(item);
        if (item["type"] == 2) {
          arrLabel.push(item.label);
          arrid.push(item.id);
        }
      });
      this.labelModel = arrLabel;
      this.checkedId = arrid;

      this.$emit("setUser", this.checkedId);
    },
    clearselect() {
      this.showTree = false;
      this.checkedId = [];
      this.labelModel = [];
      this.$nextTick(() => {
        this.$refs.tree.setCheckedNodes([]);
      });
      this.$emit("setUser", []);
    },
    changeselect(value) {
      if (this.labelModel.length == 0) {
        this.$refs.tree.setCheckedKeys([]);
      }
    },
  },
};
</script>

<style>
.el-input.el-input--suffix {
  cursor: pointer;
  overflow: hidden;
}
.el-input.el-input--suffix.rotate .el-input__suffix {
  transform: rotate(180deg);
}
.select-tree {
  max-height: 350px;
  overflow-y: scroll;
}
/* 菜单滚动条 */
.select-tree::-webkit-scrollbar {
  z-index: 11;
  width: 6px;
}
.select-tree::-webkit-scrollbar-track,
.select-tree::-webkit-scrollbar-corner {
  background: #fff;
}
.select-tree::-webkit-scrollbar-thumb {
  border-radius: 5px;
  width: 6px;
  background: #b4bccc;
}
.select-tree::-webkit-scrollbar-track-piece {
  background: #fff;
  width: 6px;
}
.el-select .el-tag__close.el-icon-close {
  display: none;
}
</style>
