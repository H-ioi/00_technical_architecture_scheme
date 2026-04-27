<template>
  <div class="space">
    <el-scrollbar
      v-if="dictpermissions['order_school'].length > 1"
      class="space_left tree_box"
    >
      <div :class="['big_title']">校区</div>
      <el-tree
        class="tree"
        ref="tree"
        :default-expand-all="false"
        node-key="value"
        :expand-on-click-node="false"
        :check-on-click-node="true"
        :highlight-current="true"
        :data="dictpermissions['order_school']"
        :props="defaultProps"
        @node-click="handleNodeClick"
      ></el-tree>
    </el-scrollbar>
    <div class="space_right" ref="space_right">
      <StatusItem
        :statusList="statusList"
        :currentstatus="String(currentstatus)"
        @changeStasus="changeStasus"
      />
      <el-scrollbar style="padding: 20px 30px 30px; background: #fff; flex: 1">
        <div class="searchFromBox" style=" margin-top: 20px">
          <el-form
            class="df_align_center"
            :label-position="'top'"
            :inline="true"
            :model="searchFrom"
          >
            <el-form-item label="关键字" style="width: 120px">
              <el-input
                v-model="searchFrom.keywords"
                placeholder="请输入关键字"
              ></el-input>
            </el-form-item>
            <el-form-item label="工单类型" style="width: 120px">
              <el-select
                v-model="searchFrom.orderType"
                clearable
                placeholder="请选择"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in orderType"
                  :label="i.label"
                  :value="i.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="紧急程度" style="width: 120px">
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
        <div class="df_sb paginationInfo" style="margin-top: 20px">
          <div>
            <el-button
              v-if="permissions['order_periodic_plan_add']"
              type="primary"
              size="medium"
              @click="addPlan"
              >新增</el-button
            >
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
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Table from "@/components/common/Table.vue";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import StatusItem from "@/components/common/StatusItem.vue";
import {
  getOrderPlanList,
  enableOrderPlan,
  disableOrderPlan,
  delOrderPlan
} from "@/api/workorder/order/orderplan.js";
import { deepClone } from "@/util/util.js";
import orderPlan from "@/const/order/plan.js";
import { order } from "@/const/order/index.js";
export default {
  components: {
    Table,
    PaginationInfo,
    Pagination,
    StatusItem
  },
  data() {
    return {
      orderType: [],
      currentstatus: "1",
      statusList: orderPlan["orderPlanStatus"],
      // 表格
      tableTitle: orderPlan["orderPlanTitle"],
      tableData: [],
      tableBtn: [],
      // 分页
      pagination: {
        size: 10,
        current: 1
      },
      paginationTotal: 0,
      searchFrom: {},
      // tree数据
      treeData: [],
      defaultProps: {
        children: "child",
        label: "label",
        isLeaf: data => {
          let isLeaf = true;
          if (data.child) {
            isLeaf = data.child.length === 0;
          }
          return isLeaf;
        }
      }
    };
  },
  created() {
    this.initData();
    this.getList();
  },
  activated() {
    this.getList();
  },
  computed: {
    ...mapGetters(["permissions", "dictionary", "dictpermissions"])
  },
  methods: {
    initData() {
      this.orderType = order["orderType"].filter(item => {
        return item["value"] != "2";
      });
      if (this.dictpermissions["order_school"].length > 0) {
        let vlaue = this.dictpermissions["order_school"][0].value;
        this.pagination["school"] = vlaue;
        this.getTableBtn();
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(vlaue);
        });
      }
    },
    getList() {
      getOrderPlanList({
        ...this.pagination,
        ...this.searchFrom,
        executeStatus: this.currentstatus
      }).then(res => {
        if (res.data.success) {
          let { records, total } = res.data.data;
          this.tableData = records;
          this.paginationTotal = total;
          this.tableData.map(i => {
            i["orderTypeLabel"] = this.getDataLabel(
              i.orderType,
              order["orderType"]
            );
            i["urgencyLabel"] = this.getDataLabel(
              i.urgency,
              this.dictionary["order_urgency"]
            );
            i["timeUnitLabel"] =
              orderPlan["orderPlanTypeObj"][String(i.timeUnit)];
          });
        }
      });
    },
    // 启用
    enableOrderPlan(id) {
      enableOrderPlan(id).then(res => {
        if (res.data.success) {
          this.$message.success("启用成功");
          this.getList();
        }
      });
    },
    // 禁用
    disableOrderPlan(id) {
      disableOrderPlan(id).then(res => {
        if (res.data.success) {
          this.$message.success("禁用成功");
          this.getList();
        }
      });
    },
    // 删除
    delOrderPlan(id) {
      delOrderPlan(id).then(res => {
        if (res.data.success) {
          this.$message.success("删除成功");
          this.getList();
        }
      });
    },
    // 改变资产状态
    changeStasus(item, index) {
      this.currentstatus = item.type;
      this.getTableBtn();
      this.clear();
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getList();
    },
    handleNodeClick(data, node, current) {
      console.log("handleNodeClick", data, node, current);
      this.pagination["school"] = data["value"];
      this.pagination["current"] = 1;
      this.getList();
    },
    playTab(name, item, scope) {
      switch (name) {
        case "look":
          this.$router.push(`/order/plan/detail?planId=${item["id"]}`);
          break;
        case "edit":
          this.$router.push(`/order/plan/edit?type=edit&planId=${item["id"]}`);
          break;
        case "enable":
          this.enableOrderPlan(item["id"]);
          break;
        case "disable":
          this.disableOrderPlan(item["id"]);
          break;
        case "del":
          this.delOrderPlan(item["id"]);
          break;
      }
    },
    search() {
      this.pagination["current"] = 1;
      this.getList();
    },
    clear() {
      this.searchFrom = {
        keywords: "",
        orderType: "",
        urgency: ""
      };
      this.pagination["current"] = 1;
      this.getList();
    },
    addPlan() {
      this.$router.push(
        "/order/plan/add?type=add&school=" + this.pagination["school"]
      );
    },
    closeModal(type) {},
    getTableBtn() {
      this.statusList.map(item => {
        if (this.currentstatus == item.type) {
          this.tableBtn = item["btn"].filter(btn => {
            return (
              btn["permissions"] == "look" ||
              this.permissions[btn["permissions"]]
            );
          });
        }
      });
    },
    getDataLabel(value, data) {
      let str = "";
      data.map(item => {
        if (item.value == value) {
          str = item.label;
        }
      });
      return str;
    }
  }
};
</script>

<style lang="scss" scoped>
.big_title {
  padding: 5px 20px !important;
}
</style>
