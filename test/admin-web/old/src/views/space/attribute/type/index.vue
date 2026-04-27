<template>
  <div class="space">
    <!-- <el-scrollbar class="space_left"> </el-scrollbar> -->
    <el-scrollbar
      class="space_right"
      ref="space_right"
      style="background: #ffffff; padding: 30px"
    >
      <div class="title">空间类型管理</div>
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
                v-if="permissions['space_type_add']"
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
      </div>
    </el-scrollbar>
    <BindSpace
      ref="BindSpace"
      :showBindSpace="showBindSpace"
      :treeTopData="treeTopData"
      :currentSpace="currentSpace"
      :pid="currentSchool"
      @changeModal="changeModal"
    />
    <el-dialog
      title="查看属性"
      :visible.sync="showformgenerator"
      width="80%"
      :before-close="() => (showformgenerator = false)"
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
import BindSpace from "@/page/space/modal/bindspace.vue";
import {
  getSpaceTop,
  getSpaceTypeList,
  disableSpaceType,
  enableSpaceType,
} from "@/api/space/spacetype.js";
import FromItem from "@/page/space/from/fromitem.vue";
export default {
  components: {
    Table,
    PaginationInfo,
    Pagination,
    BindSpace,
    FromItem,
  },
  data() {
    return {
      showformgenerator: false,
      treeTopData: [],
      showBindSpace: false,
      spaceTop: [],
      currentSchool: "",
      currentSpace: {},
      // 分页
      pagination: {
        size: 10,
        status: 1,
        current: 1,
      },
      paginationTotal: 0,
      // 表格
      tableTitle: [
        { label: "名称", prop: "name", width: "" },
        { label: "最后更新", prop: "updateTime", width: "" },
        { label: "启用状态", prop: "isEnable", width: "" },
      ],
      tableData: [],
      tableBtn: [
        {
          name: "启用",
          type: "enable",
          permissions: "space_type_enable",
          color: "",
        },
        {
          name: "禁用",
          type: "disable",
          permissions: "space_type_disable",
          color: "#F56C6C",
        },
        {
          name: "编辑",
          type: "edit",
          permissions: "space_type_edit",
          color: "",
        },
        {
          name: "查看",
          type: "look",
          permissions: "look",
          color: "",
        },
        {
          name: "绑定空间",
          type: "bindspace",
          permissions: "space_type_binging",
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
    this.getSpaceTypeList(this.pagination, this.currentSchool);
  },
  methods: {
    getSpaceTypeList(data, id) {
      if (id == "") return;
      this.loadingTable = true;
      getSpaceTypeList(data, id)
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
    getSpaceTop() {
      getSpaceTop().then((res) => {
        if (res.data.success) {
          this.spaceTop = res.data.data;
          this.changeSchool(this.spaceTop[0]);
        }
      });
    },
    disableSpaceType(id) {
      disableSpaceType(id).then((res) => {
        if (res.data.success) {
          this.$message.success("已禁用");
          this.getSpaceTypeList(this.pagination, this.currentSchool);
        }
      });
    },
    enableSpaceType(id) {
      enableSpaceType(id).then((res) => {
        if (res.data.success) {
          this.$message.success("已启用");
          this.getSpaceTypeList(this.pagination, this.currentSchool);
        }
      });
    },
    changeSchool(i) {
      this.currentSchool = i.id;
      this.spaceTop.map((item) => {
        if (item.id == this.currentSchool) {
          let obj = {
            label: item.name,
            id: item.id,
            children: [],
          };
          this.treeTopData = [obj];
        }
      });
      this.getSpaceTypeList(this.pagination, this.currentSchool);
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getSpaceTypeList(this.pagination, this.currentSchool);
    },
    playTab(name, item, scope) {
      switch (name) {
        case "enable":
          this.enableSpaceType(item.id);
          break;
        case "disable":
          this.disableSpaceType(item.id);
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
        case "bindspace":
          this.currentSpace = item;
          this.showBindSpace = true;
          this.$nextTick(() => {
            this.$refs.BindSpace.getSpaceTree({ pid: this.currentSchool });
          });
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
        }
      } else {
        this.$message.warning("请先选择");
        return;
      }
    },
    toformgenerator(type, item) {
      if (type == "add") {
        this.$router.push(
          `/spacetype/formgenerator?type=add&spaceTopId=${this.currentSchool}`
        );
      } else {
        this.$router.push(
          `/spacetype/formgenerator?type=edit&spaceTopId=${this.currentSchool}&spaceTypeId=${item.id}`
        );
      }
    },
    changeModal(type) {
      this.showBindSpace = type;
      // this.$nextTick(() => {
      //   // this.$refs.BindSpace.setCurrentKey(this.treeTopData[0].id);
      //   this.$refs.BindSpace.getSpaceTree({ pid: this.treeTopData[0].id });
      // });
    },
  },
};
</script>
     
<style lang = "scss" scoped>
</style>