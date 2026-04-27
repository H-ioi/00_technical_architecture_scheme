<!-- 树状选择器 -->
<template>
  <el-select
    style="width: 100%"
    v-model="labelModel"
    :size="treeSize"
    placeholder="请选择"
    clearable
    @clear="clearSelect"
  >
    <el-option
      :value="labelModel"
      class="treeOption"
      style="height: auto;background-color: #fff;"
    >
      <el-tree
        ref="tree"
        check-strictly
        default-expand-all
        show-checkbox
        :props="defaultProps"
        :data="treedata"
        node-key="id"
        highlight-current
        :current-node-key="currentNodeKey"
        :default-checked-keys="defaultCheckedKeys"
        @check="handleNodeClick"
      ></el-tree>
    </el-option>
  </el-select>
</template>

<script>
import { getOrderSpace } from "@/api/workorder/order/index.js";
export default {
  name: "Pagination",
  props: {
    schoolId: {
      default: "",
      type: String,
      require: true
    }, // 接收校区ID
    isDisabled: Boolean,
    value: String, // 接收绑定参数
    size: String // 输入框宽度
  },
  computed: {
    treeSize() {
      return this.size || "small";
    }
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
        isLeaf: "leaf"
      },
      currentNodeKey: "",
      treedata: [],
      defaultCheckedKeys: []
    };
  },
  created() {},
  mounted() {
    this.fetchtree();
  },
  methods: {
    // 获取空间数据
    fetchtree() {
      getOrderSpace(this.schoolId).then(res => {
        console.log("fetchtree", res.data.data);
        this.treedata = res.data.data;
      });
    },
    handleNodeClick(data, node, self) {
      // 如果已经选中了一个节点，则取消选择
      if (this.currentNodeKey) {
        this.$refs.tree.setCheckedKeys([]);
        // 更新当前选中节点的 key
        this.$refs.tree.setCheckedNodes([data]);
        this.labelModel = "";
      }
      // 更新当前选中节点的 key
      this.labelModel = data["name"];
      this.currentNodeKey = data["id"];
      this.$emit("setSpace", this.currentNodeKey);
    },
    clearSelect() {
      this.labelModel = "";
      this.currentNodeKey = "";
      this.$refs.tree.setCheckedKeys([]);
      this.$refs.tree.setCheckedNodes([]);
      this.$emit("setSpace", this.currentNodeKey);
    }
  }
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
