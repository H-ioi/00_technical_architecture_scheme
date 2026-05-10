<template>
  <div class="space">
    <el-scrollbar
      class="space_right"
      ref="space_right"
      style="background: #ffffff; padding: 30px"
    >
      <div class="title">层级信息配置</div>
      <div class="df_fa" style="height: calc(100% - 54px)">
        <el-scrollbar class="areaList">
          <div
            @click="changeSchool(i)"
            :class="[
              'areaItem',
              {
                areaItem_active: currentSchool == i.id,
              },
            ]"
            v-for="(i, k) in spaceTop"
            :key="k"
          >
            {{ i.name }}
          </div>
        </el-scrollbar>
        <div style="flex: 1">
          <div class="df_sb paginationInfo" style="margin-top: 0px">
            <div>
              <el-button
                v-if="permissions['space_hierarchy_add']"
                type="primary"
                size="medium"
                @click="toformgenerator('add')"
                >新增</el-button
              >
            </div>
            <PaginationInfo :paginationTotal="paginationTotal" />
          </div>
          <Table
            v-loading="loadingTable"
            ref="Table"
            :tableTitle="tableTitle"
            :tableData="tableData"
            :tableBtn="tableBtn"
            :showSelection="false"
            @playTab="playTab"
          />
          <Pagination
            :total="paginationTotal"
            :pagination="pagination"
            @handleCurrentChange="handleCurrentChange"
          />
        </div>
        <el-dialog
          title="查看属性"
          :visible.sync="showformgenerator"
          width="80%"
          :before-close="beforeClose"
        >
          <FromItem ref="formgenerator" />
        </el-dialog>
      </div>
    </el-scrollbar>
  </div>
</template>
      
  <script>
import { mapGetters } from "vuex";
import Table from "@/components/common/Table.vue";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import { getSpaceTop } from "@/api/space/spacetype.js";
import {
  getSpaceHierarchyList,
  editSpaceHierarchy,
  disableSpaceHierarchy,
  enableSpaceHierarchy,
  getSpaceHierarchyDetail,
} from "@/api/space/spacehierarchy.js";
import FromItem from "@/page/space/from/fromitem.vue";
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
      spaceTop: [],
      currentSchool: "",

      // 分页
      pagination: {
        size: 10,
        status: 1,
        current: 1,
      },
      paginationTotal: 0,
      // 表格
      tableTitle: [
        { label: "层级", prop: "levels", width: "" },
        { label: "名称", prop: "name", width: "" },
        { label: "备注", prop: "remark", width: "" },
        { label: "最后更新", prop: "updateTime", width: "" },
        { label: "启用状态", prop: "isEnable", width: "" },
      ],
      tableData: [],
      tableBtn: [
        {
          name: "启用",
          type: "enable",
          permissions: "space_hierarchy_enable",
          color: "",
        },
        {
          name: "禁用",
          type: "disable",
          permissions: "space_hierarchy_disable",
          color: "#F56C6C",
        },
        {
          name: "编辑",
          type: "edit",
          permissions: "space_hierarchy_edit",
          color: "",
        },
        {
          name: "查看",
          type: "look",
          permissions: "look",
          color: "",
        },
      ],
      loadingTable: false,
    };
  },

  computed: {
    ...mapGetters(["dictionary", "permissions"]),
  },

  created() {
    this.getSpaceTop();
    this.tableBtn = this.tableBtn.filter((res) => {
      return (
        res["permissions"] == "look" || this.permissions[res["permissions"]]
      );
    });
  },
  activated() {
    this.getSpaceHierarchyList(this.pagination, this.currentSchool);
  },
  methods: {
    getSpaceHierarchyList(data, id) {
      if (id == "") return;
      this.loadingTable = true;
      getSpaceHierarchyList(data, id)
        .then((res) => {
          if (res.data.success) {
            this.tableData = res.data.data.records;
            this.paginationTotal = res.data.data.total;
            this.tableData.map((item) => {
              item["isEnable"] = item.status;
              item["levels"] = item.level + "级";
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
    getSpaceTop() {
      getSpaceTop().then((res) => {
        if (res.data.success) {
          this.spaceTop = res.data.data;
          this.changeSchool(this.spaceTop[0]);
        }
      });
    },
    disableSpaceHierarchy(id) {
      disableSpaceHierarchy(id).then((res) => {
        if (res.data.success) {
          this.$message.success("已禁用");
          this.getSpaceHierarchyList(this.pagination, this.currentSchool);
        }
      });
    },
    enableSpaceHierarchy(id) {
      enableSpaceHierarchy(id).then((res) => {
        if (res.data.success) {
          this.$message.success("已启用");
          this.getSpaceHierarchyList(this.pagination, this.currentSchool);
        }
      });
    },
    changeSchool(i) {
      this.currentSchool = i.id;
      this.getSpaceHierarchyList(this.pagination, this.currentSchool);
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getSpaceHierarchyList(this.pagination, this.currentSchool);
    },
    playTab(name, item, scope) {
      switch (name) {
        case "enable":
          this.enableSpaceHierarchy(item.id);
          break;
        case "disable":
          this.disableSpaceHierarchy(item.id);
          break;
        case "edit":
          this.toformgenerator("edit", item);
          break;
        case "look":
          this.showformgenerator = true;
          this.$nextTick(() => {
            this.$refs.formgenerator.getTemplateDetail(item.templateFormId);
          });
          break;
      }
    },

    toformgenerator(type, item) {
      if (type == "add") {
        this.$router.push(
          `/spacelevel/formgenerator?type=add&spaceTopId=${this.currentSchool}`
        );
      } else {
        this.$router.push(
          `/spacelevel/formgenerator?type=edit&spaceTopId=${this.currentSchool}&spaceLevelId=${item.id}`
        );
      }
    },
    beforeClose() {
      this.$refs.formgenerator.clear();
      this.showformgenerator = false;
    },
  },
};
</script>
       
      <style lang = "scss" scoped>
</style>