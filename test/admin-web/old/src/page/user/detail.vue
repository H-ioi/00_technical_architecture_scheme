<template>
  <div class="orderDetail">
    <div class="orderDetail_btn" v-if="isDetail">
      <el-button type="primary" size="medium" @click="editUser">编辑</el-button>
    </div>
    <AddUser
      ref="editUser"
      :isEdit="true"
      v-if="!isDetail"
      :userInfo="userInfo"
      @editOrderUser="editOrderUser"
    />
    <div v-else class="orderDetail_content">
      <div class="orderDetail_item">
        <div class="orderDetail_item_title">用户基本信息</div>
        <div class="orderDetail_baseinfo">
          <div class="orderDetail_baseinfo_item">
            <span>姓名</span>
            <span :title="userInfo['nickname']">{{
              userInfo["nickname"]
            }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>电子邮箱</span>
            <span :title="userInfo['email']">{{ userInfo["email"] }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>手机号</span>
            <span :title="userInfo['phone']">{{ userInfo["phone"] }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>所属部门</span>
            <span :title="userInfo['department']">{{
              userInfo["department"]
            }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>所属校区</span>
            <span :title="getOrderSchool(userInfo['school'])">{{
              getOrderSchool(userInfo["school"])
            }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>登入时间</span>
            <span :title="userInfo['lastLoginTime']">{{
              userInfo["lastLoginTime"]
            }}</span>
          </div>
          <div class="orderDetail_baseinfo_item" style="width: 50%">
            <span>备注</span>
            <span :title="userInfo['note']">{{ userInfo["note"] }} </span>
          </div>
        </div>
      </div>
      <Table
        :tableTitle="tableTitle"
        :tableData="tableData"
        :tableBtn="tableBtn"
        :showSelection="false"
        @playTab="playTab"
        @rowClick="rowClick"
      />
      <Pagination
        :total="paginationTotal"
        :pagination="pagination"
        @handleCurrentChange="handleCurrentChange"
      />
    </div>
    <!-- <div class="tableBox"> </div> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Table from "@/components/common/Table.vue";
import Pagination from "@/components/common/Pagination.vue";
import ShowText from "@/components/common/ShowText.vue";
import AddUser from "@/page/user/adduser.vue";
import {
  getOrderUserDetail,
  getUserOrderList,
} from "@/api/workorder/user/index.js";
import { order } from "@/const/order/index.js";
export default {
  name: "PCOrderDetail",

  data() {
    return {
      order: order,
      isDetail: true,
      userInfo: {},
      pagination: {
        size: 10,
        current: 1,
      },
      paginationTotal: 0,
      tableTitle: [
        { label: "工单类型", prop: "typeName", width: "" },
        { label: "紧急程度", prop: "urgencyName", width: "" },
        { label: "申请人", prop: "contact", width: "" },
        { label: "电话", prop: "phone", width: "" },
        { label: "所属部门", prop: "department", width: "" },
        { label: "创建时间", prop: "createTime", width: "" },
        { label: "工单状态", prop: "statusName", width: "" },
      ],
      tableData: [],
      tableBtn: [{ name: "查看", type: "look", icon: "el-icon-view" }],
    };
  },
  components: {
    ShowText,
    Table,
    Pagination,
    AddUser,
  },
  created() {
    this.getOrderUserDetail();
    this.getUserOrderList();
  },
  mounted() {},
  computed: {
    ...mapGetters(["dictionary"]),
  },
  methods: {
    getOrderUserDetail() {
      getOrderUserDetail(this.$route.query.id).then((res) => {
        console.log("res", res);
        this.userInfo = res.data.data;
      });
    },
    getUserOrderList() {
      getUserOrderList({
        ...this.pagination,
        orderUserId: this.$route.query.id,
      }).then((res) => {
        console.log("res", res);
        if (res.data.success) {
          let { records, total } = res.data.data;
          this.tableData = records;
          this.paginationTotal = total;
          this.tableData.map((i) => {
            i["statusName"] = order["orderStatus"][i.status];
          });
        }
      });
    },
    editUser() {
      this.isDetail = false;
      this.$nextTick(() => {
        this.$refs["editUser"].form = this.userInfo;
      });
    },
    editOrderUser() {
      this.isDetail = true;
      this.getOrderUserDetail();
    },
    playTab(name, item, scope) {
      switch (name) {
        case "look":
          if (item.type == "1") {
            this.$router.push(`/order/servicedetail?id=${item.id}`);
          } else {
            this.$router.push(`/order/carrydetail?id=${item.id}`);
          }
          break;
      }
    },
    rowClick(row, column, event) {
      console.log("row", row, column, event);
      if (row.type == "1") {
        this.$router.push(`/order/servicedetail?id=${row.id}`);
      } else {
        this.$router.push(`/order/carrydetail?id=${row.id}`);
      }
    },
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getUserOrderList();
    },
    getOrderSchool(id) {
      let str = "";
      this.dictionary["order_school"].map((res) => {
        if (id == res.value) {
          str = res.label;
        }
      });
      return str;
    },
  },
};
</script>

<style lang="scss" scoped>
.orderDetail_baseinfo_item {
  margin-bottom: 20px;
}
</style>
