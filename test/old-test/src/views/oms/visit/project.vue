<template>
  <div>
    <StatusItem
      :statusList="order['visitStatusList']"
      :currentstatus="String(currentstatus)"
      @changeStasus="changeStasus"
    />
    <div class="searchFromBox" style="padding: 20px 20px 0">
      <el-form :label-position="'top'" :inline="true" :model="searchFrom">
        <el-form-item style="width: 180px" label="访客信息">
          <el-input
            v-model="searchFrom.keywordVisit"
            clearable
            placeholder="请输入"
            @keyup.enter.native="search"
            @blur="search"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="currentstatus == 'all'"
          style="width: 180px"
          label="状态"
        >
          <el-select
            style="width: 100%"
            v-model="searchFrom.visitStatus"
            placeholder="请选择"
          >
            <el-option
              v-for="item in order['visitStatusList']"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 180px" label="所属园区">
          <el-select
            style="width: 100%"
            v-model="searchFrom.school"
            placeholder="请选择"
            multiple
          >
            <el-option
              v-for="item in dictpermissions['order_school']"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 180px" label="受访信息">
          <el-input
            v-model="searchFrom.keywordTarget"
            clearable
            placeholder="请输入"
            @keyup.enter.native="search"
          ></el-input>
        </el-form-item>
        <el-form-item class="time-picker" style="width: 320px" label="访问日期">
          <el-date-picker
            style="width: 100%"
            v-model="searchFrom.visitDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item class="time-picker" style="width: 320px" label="访问时间">
          <el-time-picker
            style="width: 100%"
            is-range
            v-model="searchFrom.visitTime"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            value-format="HH:mm"
            format="HH:mm"
          >
          </el-time-picker>
        </el-form-item>

        <el-form-item style="width: auto; margin-bottom: 10px">
          <el-button
            class="el-button-icon"
            type="primary"
            size="large"
            icon="el-icon-search"
            @click="search"
          ></el-button>
          <el-button
            class="el-button-icon"
            type="defult"
            size="large"
            icon="el-icon-delete"
            @click="clear"
          ></el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="df_sb palyTableBox">
      <div class="df_sb">
        <div class="df_sb">
          <el-button type="primary" size="medium" @click="addVisit"
            >新增</el-button
          >
          <el-button
            v-if="currentstatus == 1"
            type="primary"
            size="medium"
            @click="batchApprove"
            >批量审批</el-button
          >
          <!-- <el-button type="primary" size="medium" @click="openTimerange"
            >时间配置</el-button
          > -->
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
    <!-- 审批弹窗 -->
    <Approve ref="Approve" @getList="getList" />
    <!-- 时间配置弹窗 -->
    <Timerange ref="Timerange" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import Table from "@/components/common/Table.vue";
import { order } from "@/const/order/index.js";
import { getVisitList, delVisit } from "@/api/workorder/user/visit.js";
import Approve from "./modal/approve.vue";
import Timerange from "./modal/timerange.vue";
import StatusItem from "@/components/common/StatusItem.vue";
import { deepClone } from "@/util/util.js";
export default {
  name: "Visit",
  components: {
    Pagination,
    Table,
    PaginationInfo,
    Approve,
    Timerange,
    StatusItem,
  },
  data() {
    return {
      order: order,
      currentstatus: 1,
      pagination: {
        size: 10,
        current: 1,
      },
      paginationTotal: 0,
      searchFrom: {},
      tableTitle: [
        {
          label: "访客状态",
          prop: "visitStatusLabel",
          width: "",
          fixed: "left",
        },
        { label: "访问类型", prop: "visitTypeLabel", width: "" },
        { label: "受访园区", prop: "targetSchoolLabel", width: "" },
        { label: "受访人员联系方式", prop: "targetUserContact", width: "" },
        { label: "受访人员姓名", prop: "targetUserName", width: "" },
        { label: "受访部门", prop: "targetDepartment", width: "" },
        { label: "访客姓名", prop: "visitHumanName", width: "" },
        { label: "访客身份证", prop: "visitHumanIdNo", width: "" },
        { label: "访客手机号", prop: "visitHumanPhone", width: "" },
        { label: "访问随行人数", prop: "visitHumanSum", width: "" },
        { label: "访客车牌号", prop: "visitVehicleIdNo", width: "" },
        { label: "访问时间", prop: "visitTime", width: "" },
        { label: "来访事由", prop: "visitDetail", width: "" },
        { label: "审批人", prop: "confirmUserName", width: "" },
        { label: "创建时间", prop: "createTime", width: "" },
      ],
      tableData: [],
      tableBtn: [],
    };
  },
  computed: {
    ...mapGetters(["dictionary", "dictpermissions", "permissions"]),
  },

  created() {
    this.tableBtn = this.gettableBtn(order["visitStatusList"][0].btnList);
    this.getList();
  },
  activated() {
    this.getList();
  },
  mounted() {},

  methods: {
    resetForm() {
      let data = {};
      let searchFrom = deepClone(this.searchFrom);
      if (searchFrom.visitStatus == "all") {
        delete searchFrom.visitStatus;
      }
      Object.keys(searchFrom).forEach((key) => {
        if (key == "visitTime" || key == "visitDate") {
          switch (key) {
            case "visitDate":
              data["visitDateBegin"] = searchFrom[key][0];
              data["visitDateEnd"] = searchFrom[key][1];
              break;
            case "visitTime":
              data["visitTimeBegin"] = searchFrom[key][0];
              data["visitTimeEnd"] = searchFrom[key][1];
              break;
          }
        } else {
          if (searchFrom[key]) {
            data[key] = searchFrom[key];
          }
        }
      });
      console.log("this.currentstatus", this.currentstatus);

      return data;
    },
    getList() {
      let resetData = this.resetForm();
      let data = {
        visitType: 1,
        ...resetData,
      };
      if (this.currentstatus !== "all") {
        data.visitStatus = this.currentstatus;
      }
      getVisitList({
        ...this.pagination,
        param: {
          ...data,
        },
      }).then((res) => {
        console.log("res", res);
        if (res.data.success) {
          let { data, total } = res.data.data;
          this.tableData = data;
          this.paginationTotal = total;
          this.tableData.map((item) => {
            item.targetSchoolLabel = this.$getListLabel(
              this.dictionary["order_school"],
              item.targetSchool
            );
            item.visitTypeLabel = this.$getListLabel(
              order["visitTypeList"],
              item.visitType
            );
            item.visitStatusLabel = this.$getListLabel(
              order["visitStatusList"],
              item.visitStatus
            );
            item.visitTime =
              item.visitDateBegin +
              " " +
              item.visitTimeBegin +
              "-" +
              item.visitTimeEnd;
            item.confirmUserName = this.getUserName(item);
          });
        }
      });
    },
    getUserName(data) {
      let userName = "--";
      let { auditList, visitStatus } = data;
      if (auditList && auditList.length > 0) {
        auditList.forEach((item) => {
          if (item.auditStatus == visitStatus) {
            userName = item.userName || "-";
          }
        });
      }
      return userName;
    },
    // 表格操作
    rowClick(item) {
      this.$router.push({
        path: "/orderuser/visit/detail",
        query: {
          id: item.id,
        },
      });
    },
    playTab(name, item, scope) {
      switch (name) {
        case "look":
          this.$router.push({
            path: "/orderuser/visit/detail",
            query: {
              id: item.id,
            },
          });
          break;
        case "edit":
          this.$router.push({
            path: "/orderuser/visit/form",
            query: {
              type: "edit",
              id: item.id,
            },
          });
          break;
        case "resubmit":
          this.$router.push({
            path: "/orderuser/visit/form",
            query: {
              type: "resubmit",
              id: item.id,
            },
          });
          break;
        case "approve":
          this.$refs["Approve"].openModal([item.id]);
          break;
        case "del":
          this.$alert("确认删除吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            delVisit(item.id).then((res) => {
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
    // 批量审批
    batchApprove() {
      let selectionId = this.$refs["Table"].selectionId;
      if (selectionId.length === 0) {
        this.$message.warning("请选择");
        return;
      }
      this.$refs["Approve"].openModal(selectionId);
    },
    // 打开时间配置弹窗
    openTimerange() {
      this.$refs["Timerange"].openModal();
    },
    // 打开弹窗
    addVisit() {
      this.$router.push({
        path: "/orderuser/visit/form",
        query: {
          type: "add",
          visitType: 1,
        },
      });
    },

    // 状态切换
    changeStasus(item, index) {
      this.currentstatus = item.type;
      this.tableBtn = this.gettableBtn(item.btnList);
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
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getList();
    },
    gettableBtn(data) {
      let tableBtn = data.filter((res) => {
        return (
          res["permission"] == "look" || this.permissions[res["permission"]]
        );
      });
      return tableBtn;
    },
  },
};
</script>

<style lang="scss" scoped>
.searchFromBox .el-form {
  flex-wrap: wrap;
}
</style>
