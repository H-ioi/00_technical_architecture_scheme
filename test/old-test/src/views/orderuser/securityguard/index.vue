<template>
  <div>
    <div class="searchFromBox" style="padding: 20px 20px 0">
      <el-form :label-position="'top'" :inline="true" :model="searchFrom">
        <el-form-item>
          <el-input
            prefix-icon="el-icon-search"
            v-model="searchFrom.keyword"
            clearable
            placeholder="请输入"
            @clear="clear"
            @keyup.enter.native="search"
            @blur="search"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="df_sb palyTableBox">
      <div class="df_sb">
        <div class="df_sb">
          <el-button
            v-if="permissions['oms_visit_guard_add']"
            type="primary"
            size="medium"
            @click="openModal('add')"
            >新增</el-button
          >
        </div>
      </div>
      <PaginationInfo :paginationTotal="paginationTotal" />
    </div>
    <div class="tableBox">
      <Table
        ref="Table"
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
    <!-- 新增/编辑弹窗 -->
    <Form ref="Form" @getList="getList" />
    <!-- 修改密码弹窗 -->
    <ChangePassword ref="ChangePassword" @getList="getList" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import Table from "@/components/common/Table.vue";
import {
  getSecurityGuardList,
  delSecurityGuard,
} from "@/api/workorder/user/securityguard.js";
import Form from "./modal/form.vue";
import ChangePassword from "./modal/changePassword.vue";
export default {
  name: "SecurityGuard",
  components: {
    Pagination,
    Table,
    PaginationInfo,
    Form,
    ChangePassword,
  },
  data() {
    return {
      pagination: {
        size: 10,
        current: 1,
      },
      paginationTotal: 0,
      searchFrom: {
        keyword: "",
      },
      tableTitle: [
        { label: "姓名", prop: "username", width: "" },
        { label: "手机号", prop: "phone", width: "" },
        { label: "所属园区", prop: "school", width: "" },
        { label: "备注", prop: "note", width: "" },
        { label: "创建时间", prop: "createTime", width: "" },
        // { label: "最近登录时间", prop: "lastLoginTime", width: "" },
      ],
      tableData: [],
      tableBtn: [
        // {
        //   name: "编辑",
        //   type: "edit",
        //   icon: "el-icon-edit",
        //   permission: "oms_visit_guard_edit",
        // },
        {
          name: "重置密码",
          type: "changePassword",
          icon: "el-icon-edit",
          permission: "oms_visit_guard_reset_password",
        },
        {
          name: "删除",
          type: "del",
          icon: "el-icon-delete",
          permission: "oms_visit_guard_del",
        },
      ],
    };
  },
  created() {},
  computed: {
    ...mapGetters(["dictionary", "permissions"]),
  },

  created() {
    this.getList();
    this.tableBtn = this.gettableBtn(this.tableBtn);
  },
  mounted() {},

  methods: {
    gettableBtn(data) {
      let tableBtn = data.filter((res) => {
        return (
          res["permission"] == "look" || this.permissions[res["permission"]]
        );
      });
      return tableBtn;
    },
    getList() {
      getSecurityGuardList({
        ...this.pagination,
        ...this.searchFrom,
      }).then((res) => {
        console.log("res", res);
        if (res.data.success) {
          let { data, total } = res.data.data;
          this.tableData = data;
          this.paginationTotal = total;
          this.tableData.map((item) => {
            item.school = this.$getListLabel(
              this.dictionary["order_school"],
              item.school
            );
          });
        }
      });
    },
    // 表格操作
    playTab(name, item, scope) {
      switch (name) {
        case "edit":
          this.openModal("edit", item);
          break;
        case "changePassword":
          this.openChangePasswordModal(item);
          break;
        case "del":
          this.$alert("确认删除吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            delSecurityGuard(item.id).then((res) => {
              console.log("res", res);
              if (res.data.success) {
                this.$message.success("已删除");
                this.getList();
              }
            });
          });
          break;
      }
    },
    // 打开弹窗
    openModal(type, item = {}) {
      this.$refs["Form"].openModal(type, item);
    },
    // 打开修改密码弹窗
    openChangePasswordModal(item = {}) {
      this.$refs["ChangePassword"].openModal(item);
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getList();
    },
    // 搜索
    search() {
      this.pagination["current"] = 1;
      this.getList();
    },
    // 清除搜索
    clear() {
      this.searchFrom = {};
      this.pagination["current"] = 1;
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped></style>
