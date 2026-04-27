<!-- 树状选择器 -->
<template>
  <el-select
    style="width: 100%"
    v-model="labelModel"
    :size="treeSize"
    :placeholder="$t('consult.请选择')"
    @change="changeselect"
    @focus="focusselect"
    @clear="clearselect"
    multiple
    clearable
    :disabled="isDisabled"
  >
    <el-option :value="labelModel" style="height: auto;width: 500px;">
      <el-tree
        v-if="showTree"
        ref="tree"
        :props="defaultProps"
        show-checkbox
        :load="loadNode"
        lazy
        node-key="id"
        highlight-current
        @check-change="handleCheckChange"
      ></el-tree>
    </el-option>
  </el-select>
</template>

<script>
import { fetchList, getUserlist } from "@/api/admin/user";
import { fetchTree } from "@/api/admin/dept";
export default {
  name: "Pagination",
  props: {
    isDisabled: Boolean,
    value: String, // 接收绑定参数
    size: String, // 输入框宽度
    options: {
      // 选项数据
      type: Array,
      required: false
    },
    placeholder: {
      // 输入框占位符
      type: String,
      required: false,
      default: "请选择"
    }
  },
  computed: {
    // 若非树状结构，则转化为树状结构数据
    data() {
      return this.options;
    },
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
        isLeaf: "is_leaf"
      },
      checkedId: [],
      pagination: {
        size: 10000,
        current: 1
      },
      treedata: [],
      showTree: false
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
    getUserlist(ids) {
      getUserlist(ids).then(res => {
        console.log("res", res);
        let data = res.data.data;
        let arrLabel = [];
        let arrid = [];
        data.forEach(item => {
          arrLabel.push(item.username);
          arrid.push(item.userId);
        });
        this.labelModel = arrLabel;
        this.checkedId = arrid;
      });
    },
    handleCheckChange(data, checked, node) {
      let res = this.$refs.tree.getCheckedNodes();
      let arrLabel = [];
      let arrid = [];
      res.forEach(item => {
        console.log(item);
        if (item["is_leaf"]) {
          arrLabel.push(item.name);
          arrid.push(item.userId);
        }
      });
      this.labelModel = arrLabel;
      this.checkedId = arrid;

      this.$emit("setuser", this.checkedId);
    },
    clearselect() {
      this.showTree = false;
      this.checkedId = [];
      this.labelModel = [];
      this.$nextTick(() => {
        this.$refs.tree.setCheckedNodes([]);
      });
      this.$emit("setuser", []);
    },
    changeselect(value) {
      if (this.labelModel.length == 0) {
        this.$refs.tree.setCheckedKeys([]);
      }
    },
    fetchtree() {
      return new Promise((resolve, reject) => {
        fetchTree().then(res => {
          console.log("fetchTree111111", res.data.data);
          this.treedata = res.data.data;
          resolve(this.treedata);
        });
      });
    },
    fetchList(data) {
      return new Promise((resolve, reject) => {
        fetchList(data).then(res => {
          let data = res.data.data.records;
          data.map(item => {
            item["name"] = item.username;
            item["is_leaf"] = true;
            item["children"] = [];
          });
          let newData = data.filter(item => {
            return item.lockFlag != "9";
          });
          resolve(newData);
        });
      });
    },
    async loadNode(node, resolve) {
      console.log("loadNode" + 66666666666);
      if (node.level === 0) {
        let data = await this.fetchtree();
        console.log(11111, data);
        return resolve(data);
      }
      if (node.data.is_leaf) {
        resolve([]);
      } else {
        let categories = [];
        let obj = {
          ...this.pagination,
          deptId: node.data.id
        };
        categories = await this.fetchList(obj);
        categories.map(item => {
          item["is_leaf"] = true;
        });
        console.log("categories", categories, node.data, node.data.children);
        if (categories.length == 0) {
          console.log(222);
          if (
            node.data["children"] == undefined ||
            node.data["children"].length == 0
          ) {
            resolve([]);
          } else {
            resolve(node.data["children"]);
          }
        } else {
          console.log(333);
          node.data["children"] = [
            ...(node.data["children"] ? node.data["children"] : []),
            ...categories
          ];
          resolve(categories);
        }
      }
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
