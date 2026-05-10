<template>
  <div class="space">
    <el-scrollbar class="space_left tree_box">
      <div :class="['big_title']">全部</div>
      <el-tree
        class="tree"
        ref="tree"
        :default-expand-all="false"
        node-key="id"
        :expand-on-click-node="false"
        :check-on-click-node="true"
        :highlight-current="true"
        :default-expanded-keys="defaultExpanded"
        :data="treeData"
        :props="defaultProps"
        @node-click="handleNodeClick"
      ></el-tree>
    </el-scrollbar>
    <el-scrollbar
      v-loading="loadingTable"
      class="space_right"
      ref="space_right"
      style="background: #ffffff; padding: 30px"
    >
      <div class="df_sb paginationInfo" style="margin-top: 0px">
        <div>
          <el-button
            v-if="permissions['asset_type_add'] && !isDisable"
            type="primary"
            size="medium"
            @click="toformgenerator('add')"
            >新增</el-button
          >
          <div v-else></div>
        </div>
        <PaginationInfo :paginationTotal="paginationTotal" />
      </div>
      <div>
        <Table
          ref="Table"
          :showSelection="false"
          :tableTitle="tableTitle"
          :tableData="tableData"
          :tableBtn="tableBtn"
          @playTab="playTab"
        />
        <Pagination
          :total="paginationTotal"
          :pagination="pagination"
          @handleCurrentChange="handleCurrentChange"
        />
      </div>
    </el-scrollbar>
    <el-dialog
      title="查看详情"
      :visible.sync="showformgenerator"
      width="80%"
      :before-close="beforeClose"
    >
      <FromItem ref="formgenerator" />
    </el-dialog>
  </div>
</template>
      
    <script>
import { mapGetters } from "vuex";
import Table from "@/components/common/Table.vue";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import {
  getAssetTypeTree,
  getAssetTypeSmall,
  disableAssetType,
  enableAssetType,
  delAssetType,
  getAssetTypeDetail,
} from "@/api/assets/type/index.js";
import FromItem from "@/page/space/from/fromitem.vue";
import { deepClone } from "@/util/util.js";
export default {
  components: {
    Table,
    PaginationInfo,
    Pagination,
    FromItem,
  },
  data() {
    return {
      showformgenerator: false,
      // 分页
      pagination: {
        size: 10,
        current: 1,
        level: 4,
      },
      paginationTotal: 0,
      // 表格
      tableTitle: [
        { label: "类型名称", prop: "name", width: "" },
        { label: "编码", prop: "code", width: "" },
        { label: "最后更新", prop: "updateTime", width: "" },
        { label: "启用状态", prop: "isEnable", width: "" },
      ],
      tableData: [],
      tableBtn: [
      {
          name: "启用",
          type: "enable",
          permissions: "assetType_enable",
          color: "",
        },
        {
          name: "禁用",
          type: "disable",
          permissions: "assetType_disable",
          color: "#F56C6C",
        },
        {
          name: "编辑",
          type: "edit",
          permissions: "asset_type_edit",
          color: "",
        },
        {
          name: "查看",
          type: "look",
          permissions: "look",
          color: "",
        },
        // {
        //   name: "删除",
        //   type: "delete",
        //   permissions: "assetType_del",
        //   color: "",
        // },
      ],
      // tree数据
      treeData: [],
      defaultProps: {
        children: "child",
        label: "name",
        isLeaf: (data) => {
          let isLeaf = true;
          if (data.child) {
            isLeaf = data.child.length === 0;
          }
          return isLeaf;
        },
      },
      defaultExpanded: [],
      isDisable: false,
      loadingTable: false,
    };
  },
  created() {
    this.getAssetTypeTree();
    this.tableBtn = this.tableBtn.filter((res) => {
      return (
        res["permissions"] == "look" || this.permissions[res["permissions"]]
      );
    });
  },
  activated() {
    this.getAssetTypeTree();
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  methods: {
    getAssetTypeTree() {
      getAssetTypeTree({ level: 4 }).then((res) => {
        if (res.data.success) {
          this.defaultExpanded = [];
          this.treeData = res.data.data;
          this.treeData.map((item) => {
            item["isTop"] = true;
            this.defaultExpanded.push(item.id);
          });
          this.pagination["menuTypeId"] = this.treeData[0].id;
          this.getAssetTypeSmall();
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(this.pagination["menuTypeId"]);
          });
        }
      });
    },
    getAssetTypeSmall() {
      if (this.pagination.menuTypeId == "") return;
      this.loadingTable = true;
      getAssetTypeSmall(this.pagination)
        .then((res) => {
          if (res.data.success) {
            this.tableData = res.data.data.records;
            this.paginationTotal = res.data.data.total;
            this.tableData.map((item) => {
              item["isEnable"] = item.status;
            });
            this.loadingTable = false;
          } else {
            this.loadingTable = false;
          }
        })
        .catch(() => {
          this.loadingTable = false;
        });
    },
    //查看资产类型
    getAssetTypeDetail(data) {
      getAssetTypeDetail(data).then((res) => {
        if (res.data.success) {
          this.showformgenerator = true;
          this.$nextTick(() => {
            this.$refs.formgenerator.getTemplateDetail(
              res.data.data.templateFormId
            );
          });
        }
      });
    },
    delAssetType(id) {
      this.$confirm("此操作将永久删除数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delAssetType(id).then((res) => {
            if (res.data.success) {
              this.$message.success("已删除");
              this.getAssetTypeSmall();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    disableAssetType(id) {
      disableAssetType(id).then((res) => {
        if (res.data.success) {
          this.$message.success("已禁用");
          this.getAssetTypeSmall();
        }
      });
    },
    enableAssetType(id) {
      enableAssetType(id).then((res) => {
        if (res.data.success) {
          this.$message.success("已启用");
          this.getAssetTypeSmall();
        }
      });
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getAssetTypeSmall();
    },
    handleNodeClick(data, node, current) {
      this.isDisable = !data.status;
      this.pagination["menuTypeId"] = data.id;
      if (data["isTop"]) {
        delete this.pagination["pid"];
      } else {
        this.pagination["pid"] = data.id;
      }

      this.pagination["current"] = 1;
      this.getAssetTypeSmall();
    },
    playTab(name, item, scope) {
      switch (name) {
        case "enable":
          this.enableAssetType(item.id);
          break;
        case "disable":
          this.disableAssetType(item.id);
          break;
        case "edit":
          this.toformgenerator("edit", item);
          break;
        case "delete":
          this.delAssetType(item.id);
          break;
        case "look":
          this.getAssetTypeDetail(item.id);
          break;
      }
    },
    beforeClose() {
      this.$refs.formgenerator.clear();
      this.showformgenerator = false;
    },
    toformgenerator(type, item) {
      if (type == "add") {
        this.$router.push(
          `/assets/formgenerator?type=add&level=4&menuTypeId=${this.pagination["menuTypeId"]}`
        );
      } else {
        this.$router.push(
          `/assets/formgenerator?type=edit&level=4&menuTypeId=${this.pagination["menuTypeId"]}&assetTypeId=${item.id}`
        );
      }
    },
  },
};
</script>
       
    <style lang = "scss" scoped>
.big_title {
  padding: 5px 20px !important;
  // margin: 15px 0 !important;
  // cursor: pointer;
}
.isAll {
  box-shadow: 0px 0px 6px 1px rgba(23, 94, 103, 0.15);
}
</style>