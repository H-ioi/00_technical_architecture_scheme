<template>
  <el-dialog
    :title="`绑定空间——${currentSpace.name}`"
    :visible.sync="showBindSpace"
    width="1200px"
    top="5vh"
    :before-close="closeModal"
  >
    <div class="space">
      <el-scrollbar class="space_left tree_box" v-loading="loadingTree">
        <el-tree
          v-if="showBindSpace"
          class="tree"
          ref="tree"
          default-expand-all
          node-key="id"
          :data="treeData"
          :filter-node-method="filterNode"
          :expand-on-click-node="false"
          :check-on-click-node="true"
          :highlight-current="true"
          :props="defaultProps"
          :default-checked-keys="defaultCheckedKeys"
          @node-click="handleNodeClick"
        ></el-tree>
      </el-scrollbar>
      <div class="space_right" ref="space_right" style="background: #ffffff">
        <div style="text-align: right; margin-bottom: 10px">
          <el-button type="primary" size="medium" @click="innerVisible = true"
            >已绑定空间</el-button
          >

          <!-- <PaginationInfo :paginationTotal="paginationTotal" /> -->
        </div>
        <el-scrollbar v-loading="loadingTable">
          <Table
            ref="Table"
            :tableTitle="tableTitle"
            :tableData="tableData"
            :tableBtn="tableBtn"
            :showSearch="true"
          />
          <!-- <Pagination
            :total="paginationTotal"
            :pagination="pagination"
            @handleCurrentChange="handleCurrentChange"
          /> -->
        </el-scrollbar>
      </div>
    </div>
    <el-dialog
      width="50%"
      title="已绑定空间"
      :visible.sync="innerVisible"
      append-to-body
    >
      <Table
        ref="innerTable"
        :tableTitle="tableTitle"
        :tableData="isBindtable"
        :tableBtn="tableBtn"
        :showSearch="true"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = false">取 消</el-button>
        <el-button type="primary" @click="unBind">批量解绑</el-button>
      </span>
    </el-dialog>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeModal">取 消</el-button>
      <el-button type="primary" @click="handleOk">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getSpaceTop } from "@/api/space/spacetype.js";
import { getSpaceList, getSpaceTree } from "@/api/space/spacelist.js";
import { bindSpaceType } from "@/api/space/spacetype.js";
import Table from "@/components/common/Table.vue";
import { deepClone } from "@/util/util.js";
export default {
  props: {
    showBindSpace: Boolean,
    treeTopData: Array,
    currentSpace: Object,
    pid: String,
  },
  components: {
    Table,
  },
  data() {
    return {
      innerVisible: false,
      loadingTree: true,
      loadingTable: true,
      defaultCheckedKeys: [],
      // tree数据
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      // 表格
      tableTitle: [
        { label: "空间名称", prop: "name", width: "" },
        { label: "绑定属性", prop: "typeFormsName", width: "" },
      ],
      // 所有
      tableData: [],
      tableBtn: [],
      // 已绑定的
      isBindtableId: [],
      isBindtable: [],
    };
  },
  watch: {},
  methods: {
    getSpaceTree(data) {
      this.loadingTree = true;
      this.loadingTable = true;
      getSpaceTree(data)
        .then((res) => {
          if (res.data.success) {
            console.log("res", res);
            let data = res.data.data == null ? [] : res.data.data;
            this.treeData = data;
            this.loadingTree = false;
            this.loadingTable = false;
            this.setTypeFormsName(this.treeData);
            // this.handleNodeClick(this.treeData);
            this.tableData = [];
            this.isBindtableId = [];
            this.setCurrentKey(this.treeData[0].id);
            this.setTreeTableData(data, this.tableData);
            this.setBindtable(this.tableData, true);
            this.$nextTick(() => {
              this.$refs.tree.filter();
            });
          } else {
            this.loadingTree = false;
            this.loadingTable = false;
          }
        })
        .catch((err) => {
          this.loadingTree = false;
          this.loadingTable = false;
        });
    },
    bindSpaceType(obj) {
      bindSpaceType(obj).then((res) => {
        if (res.data.success) {
          this.$message.success("已修改");
          this.getSpaceTree({ pid: this.pid });
          this.innerVisible = false;
          // this.closeModal();
        }
      });
    },
    handleOk() {
      let noSelectSpaceIds = [];
      let selectSpaceIds = this.$refs.Table.selectionId;
      this.tableData.map((item) => {
        if (!selectSpaceIds.includes(item.id)) {
          noSelectSpaceIds.push(item.id);
        }
      });
      // if (spaceIds.length === 0) {
      //   this.$message.warning("请选择要绑定的空间");
      // } else {
      let bindTableId = deepClone(this.isBindtableId);
      bindTableId.map((item, index) => {
        if (noSelectSpaceIds.includes(item)) {
          bindTableId.splice(index, 1);
        }
      });
      selectSpaceIds.map((item, index) => {
        if (!bindTableId.includes(item)) {
          bindTableId.push(item);
        }
      });
      let obj = {
        id: this.currentSpace.id,
        spaceIds: bindTableId,
      };
      console.log("obj", bindTableId, selectSpaceIds, noSelectSpaceIds);
      this.bindSpaceType(obj);
      // }
    },
    // 解绑
    unBind() {
      let unSpaceIds = this.$refs.innerTable.selectionId;
      if (unSpaceIds.length === 0) {
        this.$message.warning("请选择要解绑的空间");
      } else {
        let bindTableId = [];
        console.log("11111bindTableId", bindTableId);
        this.isBindtableId.map((item, index) => {
          if (!unSpaceIds.includes(item)) {
            bindTableId.push(item);
          }
        });
        console.log("2222bindTableId", unSpaceIds, bindTableId);
        let obj = {
          id: this.currentSpace.id,
          spaceIds: bindTableId,
        };
        this.bindSpaceType(obj);
      }
    },
    // 筛选树
    filterNode(value, data) {
      return data.status === 1;
    },
    // table数据处理
    setTypeFormsName(data) {
      data.map((item, index) => {
        if (item.status === 1) {
          let typeFormsName = [];
          let typeFormsId = [];
          if (item.typeForms == null) {
            item = Object.assign(item, {
              typeFormsName: [],
              typeFormsId: [],
              hasCurrentType: false,
            });
          } else {
            item.typeForms.map((i) => {
              typeFormsName.push(i.typeName);
              typeFormsId.push(i.typeId);
            });
            item = Object.assign(item, {
              typeFormsName,
              typeFormsId,
              hasCurrentType: typeFormsId.includes(this.currentSpace.id),
            });
          }
          if (item.children) {
            this.setTypeFormsName(item.children);
          }
        } else {
          this.disableTree(item);
        }
      });
    },
    // 父节点禁用，子节点全部禁用
    disableTree(data) {
      data["status"] = 0;
      if (data.children) {
        data.children.map((item) => {
          this.disableTree(item);
        });
      }
    },
    // 点击树节点生成新的列表
    handleNodeClick(data, node, current) {
      console.log("data, node, current", data);
      this.tableData = [];
      this.setCurrentKey(data.id);
      this.setTreeTableData([data], this.tableData);
      this.setBindtable(this.tableData, false);
    },
    // 回显已绑定的空间
    setBindtable(data, isAll) {
      this.isBindtable = [];
      data.map((item) => {
        if (item.hasCurrentType) {
          this.isBindtable.push(item);
          if (isAll) {
            //获取初始化的全部已绑定id
            this.isBindtableId.push(item.id);
          }
        }
      });
      console.log("this.isBindtable", this.isBindtable);
      this.$nextTick(() => {
        this.$refs["Table"].toggleSelection(this.isBindtable);
      });
    },
    // 设置可选空间列表
    setTreeTableData(data, arr) {
      data.map((item) => {
        if (item.status === 1) {
          arr.push(item);
          if (item.children) {
            this.setTreeTableData(item.children, arr);
          }
        }
      });
    },
    // 设置当前显示节点
    setCurrentKey(id) {
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(id);
      });
    },
    closeModal() {
      this.tableData = [];
      this.treeData = [];
      this.isBindtableId = [];
      this.isBindtable = [];
      this.$emit("changeModal", false);
    },
  },
};
</script>
 
<style lang = "scss" scoped>
.space {
  height: 600px;
  align-items: flex-start;
}
</style>