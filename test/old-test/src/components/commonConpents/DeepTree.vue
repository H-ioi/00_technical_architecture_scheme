<!-- 树状选择器 -->
<template>
  <el-select
    v-model="labelModel"
    :size="treeSize"
    placeholder="请选择部门"
    @change="changeselect($event)"
    multiple
    clearable
  >
    <el-option :value="labelModel" style="height: auto">
      <el-tree
        :data="data"
        show-checkbox
        check-strictly
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps"
        @check-change="handleCheckChange"
      ></el-tree>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    value: String, // 接收绑定参数
    size: String, // 输入框宽度
    options: {
      // 选项数据
      type: Array,
      required: true,
    },
    placeholder: {
      // 输入框占位符
      type: String,
      required: false,
      default: "请选择",
    },
  },
  computed: {
    // 若非树状结构，则转化为树状结构数据
    data() {
      return this.options;
    },
    treeSize() {
      return this.size || "small";
    },
  },
  watch: {},
  data() {
    return {
      // 输入框显示值
      labelModel: "",
      // 实际请求传值
      valueModel: "0",
      defaultProps: {
        children: "children",
        label: "name",
        value: "id",
      },
      checkedId: "",
    };
  },
  created() {},
  methods: {
    handleCheckChange(data, checked, node) {
      if (checked) {
        this.$refs.tree.setCheckedNodes([data]);
      }
      let res = this.$refs.tree.getCheckedNodes();
      let arrLabel = [];
      let arrid = [];
      res.forEach((item) => {
        console.log(item);
        arrLabel.push(item.name);
        arrid.push(item.id);
      });
      this.labelModel = arrLabel;
      this.checkedId = arrid;
      this.$emit("setdept", this.checkedId,this.labelModel);
    },
    changeselect(e) {
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

