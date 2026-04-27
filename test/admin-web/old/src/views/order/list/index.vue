<template>
  <div>
    <StatusItem
      :statusList="orderStatus"
      :currentstatus="currentstatus"
      @changeStasus="changeStasus"
    />
    <div class="searchFromBox">
      <el-form
        class="df_align_center"
        :label-position="'top'"
        :inline="true"
        :model="searchFrom"
      >
        <el-form-item label="工单类型" style="width: 20%">
          <el-select v-model="searchFrom.type" clearable placeholder="请选择">
            <el-option
              :key="k"
              v-for="(i, k) in orderType"
              :label="i.label"
              :value="i.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="校区" style="width: 20%">
          <el-select
            multiple
            v-model="searchFrom.schools"
            clearable
            placeholder="请选择"
          >
            <el-option
              :key="k"
              v-for="(i, k) in dictionary['order_school']"
              :label="i.label"
              :value="i.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="紧急程度"
          v-if="currentstatus != '1'"
          style="width: 20%"
        >
          <el-select
            v-model="searchFrom.urgency"
            clearable
            placeholder="请选择"
          >
            <el-option
              :key="k"
              v-for="(i, k) in dictionary['order_urgency']"
              :label="i.label"
              :value="i.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 20%">
          <el-input
            prefix-icon="el-icon-search"
            v-model="searchFrom.keywords"
            placeholder="请输入关键字"
          ></el-input>
        </el-form-item>
        <el-form-item style="width: auto; margin-right: 0">
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
      <div>
        <el-button
          v-if="
            permissions['order_carry_add'] || permissions['order_demand_add']
          "
          type="primary"
          size="medium"
          @click="showAdd = true"
          >新增</el-button
        >
        <el-button
          type="primary"
          size="medium"
          @click="playBtn('distribute')"
          v-if="
            (currentstatus == '1' || currentstatus == '2') &&
              permissions['order_distribute']
          "
          >派单</el-button
        >
        <el-button
          type="primary"
          size="medium"
          @click="exportOrder"
          v-if="permissions['order_export']"
          >导出</el-button
        >
        <el-button
          type="defult"
          size="medium"
          @click="playBtn('cancel')"
          v-if="
            (currentstatus == '1' || currentstatus == '2') &&
              permissions['order_cancel']
          "
          >取消</el-button
        >
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
    <AddOrder :showAdd="showAdd" @changeModal="changeModal" />
    <Distribute
      v-if="showDistribute"
      :currentOrderId="currentOrderId"
      :showAdd="showDistribute"
      @changeModal="changeModal"
      @refreshData="refreshData"
    />
    <Cancel
      v-if="showCancel"
      :currentOrderId="currentOrderId"
      :showCancel="showCancel"
      @changeModal="changeModal"
      @refreshData="refreshData"
    />
    <Supply
      :currentOrderId="currentOrderId"
      :showSupply="showSupply"
      :title="modalType"
      @changeModal="changeModal"
      @refreshData="refreshData"
    />
    <Appraise
      :currentOrderId="currentOrderId"
      :showAppraise="showAppraise"
      @changeModal="changeModal"
      @refreshData="refreshData"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import StatusItem from "@/components/common/StatusItem.vue";
import Table from "@/components/common/Table.vue";
import AddOrder from "@/page/order/modal/addorder.vue";
import Distribute from "@/page/order/modal/distributeorder.vue";
import Cancel from "@/page/order/modal/cancelorder.vue";
import Supply from "@/page/order/modal/supplyorder.vue";
import Appraise from "@/page/order/modal/appraiseorder.vue";
import { getOrderList, exportOrder } from "@/api/workorder/order/index.js";
import { order } from "@/const/order/index.js";
import { download } from "@/util/download.js";
export default {
  name: "TestUniWel",
  components: {
    Pagination,
    PaginationInfo,
    StatusItem,
    Table,
    AddOrder,
    Distribute,
    Cancel,
    Supply,
    Appraise
  },
  data() {
    return {
      pagination: {
        size: 10,
        status: 1,
        current: 1
      },
      paginationTotal: 0,
      searchFrom: {},
      tableTitle: [],
      orderTitle: order["orderTitle"],
      orderType: order["orderType"],
      orderStatus: order["orderListStatus"],
      statusName: [{ label: "工单状态", prop: "statusName", width: "" }],
      tableData: [],
      tableBtn: [],
      // currentstatus: "1",
      currentOrderId: "",
      showAdd: false,
      showDistribute: false,
      showCancel: false,
      showSupply: false,
      showAppraise: false,
      modalType: "",
      order: order
    };
  },
  created() {
    // 权限
    this.orderStatus.map(item => {
      let arr = [];
      item["btn"].map((res, k) => {
        if (
          res["permissions"] == "look" ||
          this.permissions[res["permissions"]]
        ) {
          arr.push(res);
        }
      });
      item["btn"] = arr;
      if (this.currentstatus == item.type) {
        this.tableBtn = item["btn"];
      }
    });
    console.log("  this.orderStatus", this.orderStatus);
    if (this.currentstatus == "all") {
      delete this.pagination["status"];
    } else {
      this.pagination["status"] = this.currentstatus;
    }
    this.tableTitle = this.orderTitle;
    this.getOrderList();
  },

  mounted() {},
  activated() {
    this.getOrderList();
  },
  computed: {
    ...mapGetters([
      "dictionary",
      "tagList",
      "tag",
      "permissions",
      "currentstatus"
    ])
  },
  methods: {
    getOrderList() {
      getOrderList({
        ...this.pagination,
        ...this.searchFrom
      }).then(res => {
        console.log("res", res);
        if (res.data.success) {
          let { records, total } = res.data.data;
          this.tableData = records;
          this.paginationTotal = total;
          this.tableData.map(i => {
            i["statusName"] = order["orderStatus"][i.status];
          });
        }
      });
    },
    exportOrder() {
      let data = {
        ...this.searchFrom,
        status: this.pagination.status
      };
      exportOrder(data).then(res => {
        this.$message.success("已导出");
        download(res.data, res.headers["content-disposition"]);
      });
    },
    playTab(name, item, scope) {
      console.log(6666, name, item, scope);
      this.currentOrderId = item.id;
      this.modalType = name;
      switch (name) {
        case "distribute":
          this.currentOrderId = [item.id];
          this.showDistribute = true;
          break;
        case "complete":
          this.showSupply = true;
          break;
        case "supply":
          this.showSupply = true;
          break;
        case "cancel":
          this.currentOrderId = [item.id];
          this.showCancel = true;
          break;
        case "appraise":
          this.showAppraise = true;
          break;
        case "look":
          order["orderType"].map(orderType => {
            if (item.type == orderType.value) {
              this.$router.push(`${orderType.detail}?id=${item.id}`);
            }
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
            this.showDistribute = true;
            break;
          case "cancel":
            this.showCancel = true;
            break;
        }
      } else {
        this.$message.warning("请先选择工单");
        return;
      }
    },
    rowClick(row, column, event) {
      order["orderType"].map(orderType => {
        if (row.type == orderType.value) {
          this.$router.push(`${orderType.detail}?id=${row.id}`);
        }
      });
    },
    // 状态切换
    changeStasus(item, index) {
      this.tableBtn = item["btn"];
      this.currentstatus = item.type;
      this.$store.commit("SET_CURRENTSTATUS", item.type);
      if (item.type == "all") {
        delete this.pagination["status"];
        this.pagination = {
          ...this.pagination,
          current: 1
        };
        this.tableTitle = [...this.orderTitle, ...this.statusName];
      } else {
        this.pagination = {
          ...this.pagination,
          current: 1,
          status: item.type
        };
        this.tableTitle = this.orderTitle;
      }

      this.getOrderList();
    },

    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getOrderList();
    },
    // 搜索
    search() {
      console.log(" this.searchFrom", this.searchFrom);
      this.pagination["current"] = 1;
      this.getOrderList();
    },
    // 清除搜索
    clear() {
      this.searchFrom = {};
      this.pagination["current"] = 1;
      this.getOrderList();
    },
    changeModal(type) {
      this.showAdd = type;
      this.showDistribute = type;
      this.showCancel = type;
      this.showSupply = type;
      this.showAppraise = type;
      this.currentOrderId = "";
    },
    refreshData() {
      this.search();
    }
  }
};
</script>

<style lang="scss" scoped>
.searchFromBox {
  background-color: #fff;
  padding: 20px 20px 0;
}
</style>
