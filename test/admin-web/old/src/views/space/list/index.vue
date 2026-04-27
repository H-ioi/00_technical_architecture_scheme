<template>
  <div class="space">
    <el-scrollbar class="space_left tree_box">
      <div :class="['big_title']">全部</div>
      <el-tree
        lazy
        class="tree"
        ref="tree"
        :default-expand-all="false"
        node-key="id"
        :expand-on-click-node="false"
        :check-on-click-node="true"
        :highlight-current="true"
        :default-expanded-keys="defaultExpanded"
        :load="loadNode"
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
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item
            v-for="(item, index) in breadcrumbList"
            :key="index"
          >
            <span
              @click="changeBreadcrumb(item, index)"
              :style="`color:${
                index + 1 == breadcrumbList.length ? '#333333' : '#999999'
              } `"
              >{{ item.label }}
            </span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="df_sb paginationInfo" style="margin-top: 35px">
        <div v-if="!isDisable">
          <el-button
            v-if="permissions['space_add']"
            type="primary"
            size="medium"
            @click="toSpaceForm('add')"
            >新增</el-button
          >
          <el-button
            v-if="permissions['space_import']"
            type="default"
            size="medium"
            @click="addSpaceList"
            >批量新增</el-button
          >
        </div>
        <div v-else></div>
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
    <Update
      ref="update"
      :spaceId="this.pagination['pid']"
      :showUpdate="showUpdate"
      @closeModal="closeModal"
      @initData="initData"
    />
    <DelModal :showDelModal="showDelModal" @closeModal="closeModal" />
  </div>
</template>
  
<script>
import { mapGetters } from "vuex";
import Table from "@/components/common/Table.vue";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import Update from "@/page/space/modal/update";
import DelModal from "@/components/common/DelModal.vue";
import { getSpaceTop } from "@/api/space/spacetype.js";
import {
  getSpaceList,
  getSpacePage,
  disableSpace,
  enableSpace,
  getSpaceTree,
  delSpace,
} from "@/api/space/spacelist.js";
import { deepClone } from "@/util/util.js";
export default {
  components: {
    Table,
    PaginationInfo,
    Pagination,
    Update,
    DelModal,
  },
  data() {
    return {
      showUpdate: false,
      showDelModal: false,
      searchFrom: {},
      // 面包屑
      breadcrumbList: [],
      // 分页
      pagination: {
        size: 10,
        current: 1,
        pid: "",
      },
      paginationTotal: 0,
      // 表格
      tableTitle: [
        { label: "名称", prop: "name", width: "" },
        { label: "最后更新", prop: "updateTime", width: "" },
        { label: "启用状态", prop: "isEnable", width: "" },
      ],
      topData: [],
      tableData: [],
      tableBtn: [],
      topBtn: [
        {
          name: "编辑",
          type: "edit",
          permissions: "space_edit",
          color: "",
        },
        {
          name: "查看",
          type: "look",
          permissions: "look",
          color: "",
        },
      ],
      treeBtn: [
        {
          name: "启用",
          type: "enable",
          permissions: "space_enable",
          color: "",
        },
        {
          name: "禁用",
          type: "disable",
          permissions: "space_disable",
          color: "#F56C6C",
        },
        {
          name: "编辑",
          type: "edit",
          permissions: "space_edit",
          color: "",
        },
        {
          name: "查看",
          type: "look",
          permissions: "look",
          color: "",
        },
        {
          name: "删除",
          type: "delete",
          permissions: "space_del",
          color: "",
        },
      ],
      // tree数据
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name",
        isLeaf: (data) => {
          let isLeaf = true;
          if (data.children) {
            isLeaf = data.children.length === 0;
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
    // this.getSpaceTop();
    this.tableBtn = this.treeBtn;
    this.tableBtn = this.tableBtn.filter((res) => {
      return (
        res["permissions"] == "look" || this.permissions[res["permissions"]]
      );
    });
    console.log(" this.tableBtn", this.tableBtn);
  },
  activated() {
    this.initData();
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  methods: {
    initData() {
      this.getSpacePage();
      this.refreshTreeNode();
    },
    getSpaceTop() {
      return new Promise((resolve, reject) => {
        getSpaceTop().then((res) => {
          if (res.data.success) {
            this.defaultExpanded = [];
            this.topData = res.data.data;
            res.data.data.map((item) => {
              let obj = {
                name: item.name,
                id: item.id,
                status: item.status,
                child: [],
                // isLeaf: true,
              };
              this.defaultExpanded.push(item.id);
              this.treeData.push(obj);
            });
            this.$nextTick(() => {
              this.changeBreadcrumb(this.treeData[0], 0);
            });
            resolve(this.treeData);
          }
        });
      });
    },
    getSpacePage() {
      if (this.pagination.pid == "") return;
      this.loadingTable = true;
      getSpacePage(this.pagination)
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
    getSpaceTree(data) {
      return new Promise((resolve, reject) => {
        getSpaceTree(data).then((res) => {
          console.log("res", res.data.data);
          if (res.data.success) {
            if (res.data.data == null) {
              resolve([]);
            } else {
              let data = res.data.data;
              resolve(data);
            }
          }
        });
      });
    },
    getSpaceList(data) {
      return new Promise((resolve, reject) => {
        getSpaceList(data).then((res) => {
          console.log("res", res.data.data);
          if (res.data.success) {
            let data = res.data.data;
            let list = [];
            data.map((item) => {
              let obj = {
                label: item.name,
                id: item.id,
                status: item.status,
                child: [],
              };
              list.push(obj);
            });

            resolve(list);
          }
        });
      });
    },
    disableSpace(id) {
      disableSpace(id).then((res) => {
        if (res.data.success) {
          this.$message.success("已禁用");
          this.initData();
        }
      });
    },
    enableSpace(id) {
      enableSpace(id).then((res) => {
        if (res.data.success) {
          this.$message.success("已启用");
          this.initData();
        }
      });
    },
    delSpace(id) {
      this.$confirm("此操作将永久删除该空间下的所有空间, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delSpace(id).then((res) => {
            if (res.data.success) {
              this.$message.success("已删除");
              this.initData();
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
    async loadNode(node, resolve) {
      if (node.level === 0) {
        let data = await this.getSpaceTop();
        console.log("data", data);
        resolve(data);
      }
      if (node.data.isLeaf) {
        resolve([]);
      } else {
        let categories = [];
        // categories = await this.getSpaceList({ pid: node.data.id });
        categories = await this.getSpaceTree({ pid: node.data.id });
        console.log('categories',categories);
        if (categories.length == 0) {
          resolve([]);
          // if (node.data.child == undefined) {
          //   resolve([]);
          // } else {
          //   resolve(node.data.child);
          // }
        } else {
          node.data.child = [...categories];
          resolve(categories);
        }
      }
    },
    refreshTreeNode() {
      this.$nextTick(() => {
        let node = this.$refs.tree.getNode(this.pagination.pid);
        if (node) {
          node.loaded = false;
          node.expand();
        }
      });
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getSpacePage();
    },
    handleNodeClick(data, node, current) {
      console.log("datacurrent", data);
      this.isDisable = !data.status;
      // this.tableBtn = this.treeBtn;
      this.breadcrumbList = [];
      this.pagination["pid"] = data.id;
      this.pagination["current"] = 1;
      this.getSpacePage();
      this.getBreadcrumbList(this.treeData, [], data.id);
    },
    changeBreadcrumb(item, index) {
      console.log("item", item);
      if (item == undefined || index + 1 == this.breadcrumbList.length) return;
      this.getBreadcrumbList(this.treeData, [], item.id);
      this.isDisable = !item.status;
      this.pagination["pid"] = item.id;
      this.pagination["current"] = 1;
      this.initData();
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(item.id);
      });
    },
    // 获取面包屑
    getBreadcrumbList(data, list, id) {
      data.map((i, k) => {
        let item = {
          label: i.name,
          id: i.id,
        };
        if (i.id == id) {
          list.push(item);
          this.breadcrumbList = list;
        } else {
          if (i.child.length > 0) {
            let arr = deepClone(list);
            arr.push(item);
            this.getBreadcrumbList(i.child, arr, id);
          }
        }
      });
    },
    playTab(name, item, scope) {
      switch (name) {
        case "enable":
          this.enableSpace(item.id);
          break;
        case "disable":
          this.disableSpace(item.id);
          break;
        case "edit":
          this.toSpaceForm("edit", item);
          break;
        case "delete":
          this.delSpace(item.id);
          break;
        case "look":
          this.$router.push(
            `/space/detail?pid=${this.pagination["pid"]}&id=${item.id}`
          );
          break;
      }
    },
    playBtn(type) {
      let selectionId = this.$refs["Table"].selectionId;
      if (selectionId.length > 0) {
        this.currentOrderId = selectionId;
        switch (type) {
          case "distribute":
            break;
          case "cancel":
            break;
        }
      } else {
        this.$message.warning("请先选择");
        return;
      }
    },
    addSpaceList() {
      this.showUpdate = true;
      this.$nextTick(() => {
        this.$refs.update.getAllSpaceType();
      });
    },
    closeModal(type) {
      this.showUpdate = type;
      this.showDelModal = type;
    },
    toSpaceForm(type, item) {
      if (type == "add") {
        this.$router.push(`/space/add?pid=${this.pagination["pid"]}`);
      } else {
        this.$router.push(
          `/space/edit?pid=${this.pagination["pid"]}&id=${item.id}`
        );
      }
    },
    selcctAll() {
      this.pagination["pid"] = "";
      this.breadcrumbList = [{ label: "全部" }];
      this.tableData = this.topData;
      this.tableData.map((item) => {
        item["isEnable"] = item.status;
      });
      this.tableBtn = this.topBtn;
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(null);
      });
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