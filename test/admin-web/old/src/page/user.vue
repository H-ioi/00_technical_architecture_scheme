<template>
  <div>
    <div class="searchFromBox" style="padding: 20px 20px 0">
      <el-form :label-position="'top'" :inline="true" :model="searchFrom">
        <el-form-item>
          <el-input
            prefix-icon="el-icon-search"
            v-model="searchFrom.keyword"
            clearable
            placeholder="请输入用户名/手机号/部门"
            @clear="clear"
            @blur="search"
            @keyup.enter="search"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="df_sb palyTableBox">
      <div class="df_sb">
        <div class="df_sb">
          <el-button
            type="primary"
            size="medium"
            @click="$router.push('/user/adduser')"
            >新增</el-button
          >
          <el-button type="primary" size="medium" @click="exportOrderUser"
            >导出</el-button
          >

          <el-upload
            style="margin: 0 10px"
            action=""
            accept=".xlsx,.xls"
            class="upload-demo"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :limit="1"
          >
            <el-button type="primary" size="medium">导入</el-button>
          </el-upload>
          <el-button type="defult" size="medium" @click="downloadUserExcel"
            >下载模板</el-button
          >

          <el-button type="defult" size="medium" @click="delAll"
            >删除</el-button
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
        @rowClick="rowClick"
      />
      <Pagination
        :total="paginationTotal"
        :pagination="pagination"
        @handleCurrentChange="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import Table from "@/components/common/Table.vue";
import {
  getOrderUserList,
  enableOrderUser,
  disableOrderUser,
  delOrderUser,
  exportOrderUser,
  downloadUserExcel,
  importOrderUser,
} from "@/api/workorder/user/index.js";
import { download } from "@/util/download.js";
export default {
  name: "TestUniWel",
  components: {
    Pagination,
    Table,
    PaginationInfo,
  },
  data() {
    return {
      pagination: {
        size: 10,
        current: 1,
      },
      paginationTotal: 0,
      currentUserId: "",
      searchFrom: {
        keyword: "",
      },
      tableTitle: [
        { label: "姓名", prop: "nickname", width: "" },
        { label: "手机号", prop: "phone", width: "" },
        { label: "电子邮箱", prop: "email", width: "300" },
        { label: "所属部门", prop: "department", width: "" },
        { label: "账号状态", prop: "statusName", width: "" },
        { label: "最近登录时间", prop: "lastLoginTime", width: "" },
      ],
      tableData: [],
      tableBtn: [
        { name: "查看", type: "look", icon: "el-icon-view" },
        { name: "启用", type: "enable", icon: "el-icon-circle-check" },
        { name: "禁用", type: "disable", icon: "el-icon-circle-close" },
        { name: "删除", type: "del", icon: "el-icon-delete" },
      ],
    };
  },
  created() {},
  computed: {
    ...mapGetters(["tagWel"]),
  },

  created() {
    this.getOrderUserList(this.pagination);
  },
  mounted() {},

  methods: {
    getOrderUserList() {
      getOrderUserList({
        ...this.pagination,
        ...this.searchFrom,
      }).then((res) => {
        console.log("res", res);
        if (res.data.success) {
          let { records, total } = res.data.data;
          this.tableData = records;
          this.paginationTotal = total;
          this.tableData.map((item) => {
            item["statusName"] = item.status ? "启用" : "禁用";
          });
        }
      });
    },
    enableOrderUser(id) {
      enableOrderUser(id).then((res) => {
        console.log("res", res);
        if (res.data.success) {
          this.$message.success("已启用");
          this.getOrderUserList();
        }
      });
    },
    disableOrderUser(id) {
      disableOrderUser(id).then((res) => {
        console.log("res", res);
        if (res.data.success) {
          this.$message.success("已禁用");
          this.getOrderUserList();
        }
      });
    },
    // 批量删除
    delAll() {
      let selectionId = this.$refs["Table"].selectionId;
      if (selectionId.length > 0) {
        let obj = new FormData();
        obj.append("ids", selectionId);
        this.delOrderUser(obj);
      } else {
        this.$message.warning("请先选择用户");
      }
    },
    // 删除用户
    delOrderUser(data) {
      delOrderUser(data).then((res) => {
        console.log("res", res);
        if (res.data.success) {
          this.$message.success("已删除");
          this.getOrderUserList();
        }
      });
    },
    // 导入用户
    importOrderUser(data) {
      importOrderUser(data).then((res) => {
        console.log("res", res);
        this.$message.success("已导入");
        this.getOrderUserList();
      });
    },
    // 导出用户
    exportOrderUser() {
      exportOrderUser(this.searchFrom).then((res) => {
        console.log("res", res);
        this.$message.success("已导出");
        download(res.data, res.headers["content-disposition"]);
      });
    },
    // 下载模板
    downloadUserExcel() {
      downloadUserExcel().then((res) => {
        console.log("res", res);
        this.$message.success("成功");
        download(res.data, res.headers["content-disposition"]);
      });
    },
    rowClick(row, column, event) {
      console.log("row", row, column, event);
    },
    // 表格操作
    playTab(name, item, scope) {
      console.log(6666);
      this.currentUserId = item.id;
      switch (name) {
        case "look":
          this.$router.push("/user/detail?id=" + item.id);
          break;
        case "enable":
          this.enableOrderUser(item.id);
          break;
        case "disable":
          this.disableOrderUser(item.id);
          break;
        case "del":
          let obj = new FormData();
          obj.append("ids", [item.id]);
          this.delOrderUser(obj);
          break;
      }
    },
    // 上传
    beforeUpload(file) {
      console.log("file", file);
      let obj = new FormData();
      obj.append("file", file);
      this.importOrderUser(obj);
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getOrderUserList();
    },
    // 搜索
    search() {
      this.pagination["current"] = 1;
      this.getOrderUserList();
    },
    // 清除搜索
    clear() {
      this.searchFrom = {};
      this.pagination["current"] = 1;
      this.getOrderUserList();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>