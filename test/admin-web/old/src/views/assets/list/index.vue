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
    <div v-loading="loadingTable" class="space_right" ref="space_right">
      <StatusItem
        :statusList="assetsStatus"
        :currentstatus="String(currentstatus)"
        @changeStasus="changeStasus"
      />
      <el-scrollbar style="padding: 20px 30px 30px; background: #fff; flex: 1">
        <div class="searchFromBox" style="width: 250px; margin-top: 20px">
          <el-input
            clearable
            prefix-icon="el-icon-search"
            v-model="pagination.keywords"
            placeholder="请输入关键词"
            @keyup.enter.native="changeKeywords"
            @clear="changeKeywords"
            @blur="changeKeywords"
          ></el-input>
        </div>
        <div class="df_sb paginationInfo" style="margin-top: 20px">
          <div v-if="!isDisable">
            <el-button
              v-if="permissions['asset_add']"
              type="primary"
              size="medium"
              @click="toPath('add')"
              >新增</el-button
            >
            <el-button
              v-if="permissions['asset_import']"
              type="primary"
              size="medium"
              @click="showUpdate = true"
              >批量新增</el-button
            >
            <el-button
              v-if="permissions['asset_export']"
              type="primary"
              size="medium"
              @click="exportAssetList"
              :loading="loadingDown"
              >导出</el-button
            >
            <el-button
              v-if="permissions['asset_del']"
              type="defadult"
              size="medium"
              @click="delAssetsList"
              >删除</el-button
            >
          </div>
          <div v-else></div>
          <PaginationInfo :paginationTotal="paginationTotal" />
        </div>
        <div>
          <Table
            ref="Table"
            :showSelection="true"
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
    </div>
    <Update
      ref="update"
      :menuTypeId="pagination['menuTypeId']"
      :showUpdate="showUpdate"
      @closeModal="closeModal"
      @getAssetPage="getAssetPage"
    />
    <DelModal :showDelModal="showDelModal" @closeModal="closeModal" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Table from "@/components/common/Table.vue";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import DelModal from "@/components/common/DelModal.vue";
import StatusItem from "@/components/common/StatusItem.vue";
import Update from "@/page/assets/modal/update.vue";
import { getAssetTypeTop } from "@/api/assets/type/index.js";
import {
  getAssetPage,
  changeAssetStatus,
  exportAssetList,
  delAsset
} from "@/api/assets/list/index.js";
import { deepClone } from "@/util/util.js";
import { assetsStatus } from "@/const/assets/index.js";
import { download } from "@/util/download.js";
export default {
  components: {
    Table,
    PaginationInfo,
    Pagination,
    Update,
    DelModal,
    StatusItem
  },
  data() {
    return {
      showUpdate: false,
      showDelModal: false,
      // 分页
      pagination: {
        size: 10,
        current: 1,
        status: "1",
        keywords: ""
      },
      paginationTotal: 0,
      currentstatus: "1",
      assetsStatus: assetsStatus,
      // 表格
      tableTitle: [
        { label: "资产名称", prop: "name", width: "" },
        { label: "资产类型", prop: "typeNames", width: "" },
        { label: "资产编码", prop: "code", width: "" },
        { label: "采购日期", prop: "purchaseTime", width: "" },
        { label: "资产状态", prop: "assetsStatus", width: "" }
      ],
      tableData: [],
      tableBtn: [
        {
          name: "闲置",
          type: "idle",
          permissions: "asset_status",
          color: "#",
          assetStatus: 1
        },
        {
          name: "使用",
          type: "use",
          permissions: "asset_status",
          color: "",
          assetStatus: 2
        },
        {
          name: "报废",
          type: "scrap",
          permissions: "asset_status",
          color: "",
          assetStatus: 3
        },
        {
          name: "编辑",
          type: "edit",
          permissions: "asset_edit",
          color: ""
        },
        {
          name: "查看",
          type: "look",
          permissions: "look",
          color: ""
        }
      ],
      // tree数据
      treeData: [],
      defaultProps: {
        children: "child",
        label: "name",
        isLeaf: data => {
          let isLeaf = true;
          if (data.child) {
            isLeaf = data.child.length === 0;
          }
          return isLeaf;
        }
      },
      defaultExpanded: [],
      isDisable: false,
      loadingTable: false,
      loadingDown: false,
      dictValue: ""
    };
  },
  created() {
    this.getAssetTypeTop();
    this.assetsStatus = [
      ...assetsStatus,
      {
        name: "全部",
        type: "-1"
      }
    ];
    this.tableBtn = this.tableBtn.filter(res => {
      return (
        res["permissions"] == "look" || this.permissions[res["permissions"]]
      );
    });
  },
  activated() {
    this.getAssetPage();
    this.refreshTreeNode();
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    getAssetTypeTop() {
      getAssetTypeTop().then(res => {
        if (res.data.success) {
          this.defaultExpanded = [];
          res.data.data.map((item, index) => {
            let obj = {
              name: item.name,
              id: item.id,
              status: item.status,
              dictValue: item.dictValue,
              child: []
              // isLeaf: true,
            };
            this.defaultExpanded.push(item.id);
            this.treeData.push(obj);
          });
          this.dictValue = this.treeData[0]["dictValue"];
          this.pagination["menuTypeId"] = this.treeData[0].id;
          this.getAssetPage();
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(this.pagination["menuTypeId"]);
          });
        }
      });
    },
    getAssetPage() {
      if (this.pagination["menuTypeId"] == undefined) return;
      this.loadingTable = true;
      getAssetPage(this.pagination)
        .then(res => {
          if (res.data.success) {
            this.tableData = res.data.data.records;
            this.paginationTotal = res.data.data.total;
            this.tableData.map(item => {
              item["assetsStatus"] = this.getAssetsStatus(item.status);
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
    getAssetsStatus(status) {
      let statusName = "--";
      this.assetsStatus.map(item => {
        if (item.type == status) {
          statusName = item.name;
        }
      });
      return statusName;
    },
    // 导出
    exportAssetList() {
      let _this = this;
      this.loadingDown = true;
      let data = deepClone(this.pagination);
      delete data["size"];
      delete data["current"];
      exportAssetList(data)
        .then(res => {
          console.log("exportAssetList", res);
          this.loadingDown = false;
          if (res.status == 500) {
            console.log("res.status", res.status);
            let reader = new FileReader();
            reader.onload = function(e) {
              let readerres = reader.result;
              let msg = JSON.parse(readerres);
              _this.$message.warning(msg.msg);
            };
            reader.readAsText(res.data, "utf-8");
          } else {
            download(res.data, res.headers["content-disposition"]);
          }
        })
        .catch(() => {
          this.loadingDown = false;
          this.$message.error("下载文件失败");
        });
    },
    delAssetsList() {
      let selectAssetsId = this.$refs["Table"].selectionId;
      console.log("selectAssetsId0", selectAssetsId);
      if (selectAssetsId.length == 0) {
        this.$message.warning("请先选择数据");
      } else {
        this.$confirm("此操作将永久删除数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let ids = "";
            selectAssetsId.map((item, index) => {
              ids += (index < 1 ? "?" : "&") + "ids=" + item;
            });
            delAsset(ids).then(res => {
              if (res.data.success) {
                this.getAssetPage();
                this.$message.success("已删除");
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },
    changeAssetStatus(id, status) {
      changeAssetStatus(status, id).then(res => {
        if (res.data.success) {
          this.$message.success("已修改状态");
          this.getAssetPage();
        }
      });
    },
    refreshTreeNode() {
      this.$nextTick(() => {
        console.log(" this.$refs.tree", this.$refs.tree);
        let node = this.$refs.tree.getNode(this.pagination["menuTypeId"]);
        if (node) {
          node.loaded = false;
          node.expand();
        }
      });
    },

    changeKeywords() {
      this.pagination["current"] = 1;
      this.getAssetPage();
    },
    // 改变资产状态
    changeStasus(item, index) {
      this.currentstatus = item.type;
      this.pagination["current"] = 1;
      if (item.type == "-1") {
        delete this.pagination["status"];
      } else {
        this.pagination["status"] = item.type;
      }
      this.getAssetPage();
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getAssetPage();
    },
    handleNodeClick(data, node, current) {
      this.isDisable = !data.status;
      this.pagination["menuTypeId"] = data.id;
      this.pagination["current"] = 1;
      this.dictValue = data["dictValue"];
      this.getAssetPage();
    },
    playTab(name, item, scope) {
      switch (name) {
        case "idle":
          this.changeAssetStatus(item.id, 1);
          break;
        case "use":
          this.changeAssetStatus(item.id, 2);
          break;
        case "scrap":
          this.changeAssetStatus(item.id, 3);
          break;
        case "edit":
          this.toPath("edit", item);
          break;
        case "look":
          this.$router.push(
            `/assets/detail?checkTypeId=${this.pagination["menuTypeId"]}&assetId=${item.id}&dictValue=${this.dictValue}`
          );
          break;
      }
    },
    closeModal(type) {
      this.showUpdate = type;
      this.showDelModal = type;
    },
    toPath(type, item) {
      if (type == "add") {
        this.$router.push(
          `/assets/${type}?checkTypeId=${
            this.pagination["menuTypeId"]
          }&type=${type}&assetsStatus=${
            this.pagination["status"] ? this.pagination["status"] : "0"
          }&dictValue=${this.dictValue}`
        );
      } else {
        this.$router.push(
          `/assets/${type}?checkTypeId=${this.pagination["menuTypeId"]}&assetId=${item.id}&type=${type}&dictValue=${this.dictValue}`
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.big_title {
  padding: 5px 20px !important;
  // margin: 15px 0 !important;
  // cursor: pointer;
}
</style>
