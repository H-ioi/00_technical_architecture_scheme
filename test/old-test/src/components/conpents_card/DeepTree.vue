<!-- 树状选择器 -->
<template>
  <el-select
    style="width: 100%"
    v-model="labelModel"
    :size="treeSize"
    placeholder="请选择行业"
    @change="changeselect($event)"
    clearable
    :disabled="isDisabled"
  >
    <el-option :value="labelModel" style="height: auto">
      <el-tree
        show-checkbox
        check-strictly
        node-key="id"
        :load="loadNode"
        lazy
        ref="tree"
        highlight-current
        :props="defaultProps"
        @check-change="handleCheckChange"
      ></el-tree>
    </el-option>
  </el-select>
</template>

<script>
import { getIndustryTop, getIndustryChild } from "@/api/industry/index";
export default {
  name: "Pagination",
  props: {
    value: String, // 接收绑定参数
    size: String, // 输入框宽度
    labelModel: String,
    // options: {
    //   // 选项数据
    //   type: Array,
    //   required: true,
    // },
    placeholder: {
      // 输入框占位符
      type: String,
      required: false,
      default: "请选择",
    },
    isDisabled: Boolean,
  },

  computed: {
    // 若非树状结构，则转化为树状结构数据
    // data() {
    // return this.options;
    // },
    treeSize() {
      return this.size || "small";
    },
  },
  watch: {},
  data() {
    return {
      options: [],
      // 输入框显示值
      // labelModel: "",
      // 实际请求传值
      valueModel: "0",
      defaultProps: {
        children: "children",
        label: "name",
        value: "id",
      },
      checkedId: "",
      treedata: [],
    };
  },
  created() {},
  methods: {
    getIndustryTop() {
      return new Promise((resolve, reject) => {
        getIndustryTop().then((res) => {
          console.log("res", res.data.data);
          this.treedata = res.data.data;
          resolve(this.treedata);
        });
      });
    },
    getIndustryChild(id) {
      return new Promise((resolve, reject) => {
        getIndustryChild(id).then((res) => {
          console.log("res", res.data.data);
          let data = res.data.data;
          resolve(data);
        });
      });
    },
    setindustrychild(id, data, tableData) {
      tableData.map((item, index) => {
        if (item.id == id) {
          this.$set(tableData, index, {
            ...item,
            children: data,
          });
          console.log("222tableData", this.tableData);
          if (data.length == 0) {
            this.$message.warning("该行业下无子集，请添加");
            return;
          }
        } else {
          if (item["children"] && item["children"].length !== 0) {
            this.setindustrychild(id, data, item["children"]);
          }
        }
      });
    },
    handleCheckChange(data, checked, node) {
      console.log(1111111, data, checked, node);
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
      this.$emit("settreedata", arrLabel, arrid);
    },
    changeselect(e) {
      if (this.labelModel.length == 0) {
        this.$refs.tree.setCheckedKeys([]);
      }
    },
    async loadNode(node, resolve) {
      if (node.level === 0) {
        let data = await this.getIndustryTop();
        return resolve(data);
      }
      if (node.data.is_leaf) {
        resolve([]);
      } else {
        let categories = [];
        categories = await this.getIndustryChild(node.data.id);
        console.log("categories", categories);
        resolve(categories);
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

