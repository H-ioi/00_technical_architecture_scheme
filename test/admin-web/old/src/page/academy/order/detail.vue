<template>
  <div class="orderDetail">
    <div class="orderDetail_btn">
      <!-- <el-button
        type="primary"
        size="medium"
        v-if="
          topOrderData['status'] == 'unpaid' &&
            permissions['isaic_order_op_pay']
        "
        @click="palyOrder('pay')"
        >支付</el-button
      > -->
      <!-- <el-button
        type="primary"
        size="medium"
        v-if="
          topOrderData['status'] == 'unpaid' &&
            permissions['isaic_order_op_close']
        "
        @click="palyOrder('close')"
        >关闭</el-button
      > -->
      <!-- <el-button
        type="primary"
        size="medium"
        v-if="
          (topOrderData['status'] == 'paid' ||
            topOrderData['status'] == 'scheduled') &&
            permissions['isaic_order_op_refund_apply']
        "
        @click="palyOrder('refundApply')"
        >申请退款</el-button
      > -->
      <!-- <el-button
        type="primary"
        size="medium"
        v-if="
          topOrderData['status'] == 'refund_applying' &&
            permissions['isaic_order_op_refund_cancel']
        "
        @click="palyOrder('refundCancel')"
        >取消退款</el-button
      > -->
      <!-- <el-button
        type="primary"
        size="medium"
        v-if="
          topOrderData['status'] == 'refund_applying' &&
            permissions['isaic_order_op_refund_confirm']
        "
        @click="palyOrder('refund')"
        >确认退款</el-button
      > -->
      <!-- <el-button
        type="primary"
        size="medium"
        v-if="
          topOrderData['status'] == 'scheduled' &&
            permissions['isaic_order_op_finish']
        "
        @click="palyOrder('finish')"
        >完成课程</el-button
      > -->
      <!-- <el-button
        type="primary"
        size="medium"
        v-if="
          topOrderData['status'] == 'paid' &&
            permissions['isaic_order_op_schedule'] &&
            (accountData['outerId']
              ? accountData['scene'] != 4
              : tableData[0]['scene'] != 4)
        "
        @click="palyOrder('schedule')"
        >排课</el-button
      > -->
    </div>
    <div class="orderDetail_content">
      <div class="orderDetail_item">
        <div class="orderDetail_item_title">订单详情</div>
        <div class="orderDetail_baseinfo">
          <div class="orderDetail_baseinfo_item">
            <span>订单号</span>
            <span>{{ checkNull(topOrderData["tradeNo"]) }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>订单状态</span>
            <span>{{ course["orderStatusObj"][topOrderData["status"]] }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>支付方式</span>
            <span>{{
              checkNull(course["payMethod"][topOrderData["method"]])
            }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>下单时间</span>
            <span>{{ topOrderData["createTime"] }}</span>
          </div>
          <!-- <div class="orderDetail_baseinfo_item">
            <span>支付时间</span>
            <span>2024-01-03 15:30</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>退款时间</span>
            <span>2024-01-03 15:30</span>
          </div> -->
        </div>
      </div>
      <div class="orderDetail_item">
        <div class="orderDetail_item_title">报名信息</div>
        <div class="orderDetail_baseinfo">
          <div class="orderDetail_baseinfo_item">
            <span>家长手机号</span>
            <span>{{ accountData["parentPhone"] }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>家长邮箱</span>
            <span>{{ accountData["parentEmail"] }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>学生姓名(中)</span>
            <span>{{ accountData["studentNameCn"] }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>学生姓名(英)</span>
            <span>{{ accountData["studentNameEn"] }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>学生性别</span>
            <span>{{ accountData["studentGender"] == 1 ? "男" : "女" }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>学校</span>
            <span>{{ accountData["studentSchool"] }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>年级</span>
            <span>{{ accountData["studentGrade"] }}</span>
          </div>
        </div>
      </div>
      <div class="orderDetail_item">
        <div class="orderDetail_item_title df_sb">课程信息</div>
        <div class="orderDetail_baseinfo">
          <el-table
            style="width: 100%"
            :header-cell-style="tablestyle['headercellstyle']"
            :cell-style="tablestyle['rowstyle']"
            :row-class-name="tableRowClassName"
            :data="tableData"
            @row-click="rowClick"
          >
            <el-table-column
              v-for="(item, index) in course['orderTableTitle']"
              :key="index"
              :prop="item['prop']"
              :label="item['label']"
              :width="item['width']"
              :fixed="item['fixed']"
            >
              <template slot-scope="scope">
                <span
                  class="tableRow"
                  :title="checkNull(scope.row[item['prop']])"
                >
                  {{ checkNull(scope.row[item["prop"]]) }}</span
                >
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="240px">
              <template slot-scope="scope">
                <div class="df_align_center table_textbtn">
                  <!-- <span>
                    <el-button
                      type="text"
                      size="small"
                      @click.stop="playChildTab('edit', scope.row, scope)"
                    >
                      查看
                    </el-button>
                  </span> -->
                  <span>
                    <el-button
                      type="text"
                      size="small"
                      v-if="
                        scope.row['status'] == 'scheduled' &&
                          permissions['isaic_order_sub_op_finish']
                      "
                      @click.stop="palyChildOrder('finish', scope.row, scope)"
                    >
                      完成
                    </el-button>
                  </span>
                  <span>
                    <el-button
                      type="text"
                      size="small"
                      v-if="
                        scope.row['status'] == 'paid' &&
                          scope.row['scene'] != 4 &&
                          permissions['isaic_order_sub_op_schedule']
                      "
                      @click.stop="palyChildOrder('schedule', scope.row, scope)"
                    >
                      排课
                    </el-button>
                  </span>
                  <span>
                    <el-button
                      type="text"
                      size="small"
                      v-if="
                        scope.row['status'] == 'unpaid' &&
                          permissions['isaic_order_sub_op_close']
                      "
                      @click.stop="palyChildOrder('close', scope.row, scope)"
                    >
                      关闭
                    </el-button>
                  </span>
                  <span>
                    <el-button
                      type="text"
                      size="small"
                      v-if="
                        (scope.row['status'] == 'paid' ||
                          scope.row['status'] == 'scheduled') &&
                          permissions['isaic_order_sub_op_refund_apply']
                      "
                      @click.stop="
                        palyChildOrder('refundApply', scope.row, scope)
                      "
                    >
                      申请退款
                    </el-button>
                  </span>
                  <span>
                    <el-button
                      type="text"
                      size="small"
                      v-if="
                        scope.row['status'] == 'refund_applying' &&
                          permissions['isaic_order_sub_op_refund_cancel']
                      "
                      @click.stop="
                        palyChildOrder('refundCancel', scope.row, scope)
                      "
                    >
                      取消退款
                    </el-button>
                  </span>
                  <span>
                    <el-button
                      type="text"
                      size="small"
                      @click.stop="palyChildOrder('refund', scope.row, scope)"
                      v-if="
                        scope.row['status'] == 'refund_applying' &&
                          permissions['isaic_order_sub_op_refund_confirm']
                      "
                    >
                      确认退款
                    </el-button>
                  </span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { tablestyle } from "@/const/tabledata/index";
import Table from "@/components/common/Table.vue";
import ShowText from "@/components/common/ShowText.vue";
import {
  getTopOrderDetail,
  closeTopOrder,
  finishTopOrder,
  payTopOrder,
  refundApplyTopOrder,
  refundCancelTopOrder,
  refundConfirmTopOrder,
  scheduleTopOrder,
  getChildOrderlist,
  getchildOrderDetail,
  closeChildOrder,
  finishChildOrder,
  refundApplyChildOrder,
  refundConfirmChildOrder,
  refundCancelChildOrder,
  scheduleChildOrder
} from "@/api/academy/order.js";
import course from "@/const/academy/course.js";
import order from "@/const/academy/order.js";
export default {
  name: "detail",
  components: {
    Table
  },
  data() {
    return {
      tablestyle: tablestyle,
      order: order,
      course: course,
      topOrderId: "",
      childOrderId: "",
      topOrderData: {},
      accountData: {},
      tableData: [],
      tableBtn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view"
        }
      ]
    };
  },

  created() {
    this.initData();
  },
  mounted() {},
  computed: {
    ...mapGetters([
      "dictionary",
      "userList",
      "permissions",
      "i18nlocel",
      "pooldictionary",
      "pooldictpermissions"
    ])
  },
  watch: {},
  methods: {
    initData() {
      this.topOrderId = this.$route.query.topOrderId;
      this.getTopOrderDetail();
      this.getChildOrderlist();
    },
    // 获取主订单详情
    getTopOrderDetail() {
      getTopOrderDetail(this.topOrderId).then(res => {
        if (res.data.success) {
          let data = res.data.data;
          let { extra } = data;
          this.topOrderData = data;
          this.accountData = extra;
          this.topOrderData["status"] = order["setOrderStatus"](
            this.topOrderData["status"],
            this.topOrderData["marks"]
          );
        }
      });
    },
    // 获取主订单关联的子订单
    getChildOrderlist() {
      getChildOrderlist(this.topOrderId).then(res => {
        if (res.data.success) {
          console.log("getTopOrderDetail", res);
          this.tableData = res.data.data;
          this.tableData.map(item => {
            item["price"] = item["price"] > 0 ? item["price"] / 100 : "免费";
            if (this.topOrderData["status"] == "refund_applying") {
              item["status"] = "refund_applyingAll";
            } else {
              item["status"] = order["setOrderStatus"](
                item["status"],
                item["marks"]
              );
            }
            item["statusLabel"] = course["orderStatusObj"][item["status"]];
          });
        }
      });
    },
    // 操作主订单
    palyOrder(type) {
      switch (type) {
        case "pay":
          this.payTopOrder();
          break;
        case "close":
          this.closeTopOrder();
          break;
        case "refundApply":
          this.refundApplyTopOrder();
          break;
        case "finish":
          this.finishTopOrder();
          break;
        case "refund":
          this.refundConfirmTopOrder();
          break;
        case "schedule":
          this.scheduleTopOrder();
          break;
        case "refundCancel":
          this.refundCancelTopOrder();
          break;
      }
    },
    // 操作子订单
    palyChildOrder(type, row, scope) {
      switch (type) {
        case "close":
          this.closeChildOrder(row["id"]);
          break;
        case "refundApply":
          this.refundApplyChildOrder(row["id"]);
          break;
        case "finish":
          this.finishChildOrder(row["id"]);
          break;
        case "refund":
          this.refundConfirmChildOrder(row["id"]);
          break;
        case "schedule":
          this.scheduleChildOrder(row["id"]);
          break;
        case "refundCancel":
          this.refundCancelChildOrder(row["id"]);
          break;
      }
    },
    // 主订单操作
    payTopOrder() {
      payTopOrder(this.topOrderId).then(res => {
        if (res.data.success) {
          this.$message.success("操作成功");
          this.initData();
        }
      });
    },
    closeTopOrder() {
      closeTopOrder(this.topOrderId).then(res => {
        if (res.data.success) {
          this.$message.success("操作成功");
          this.initData();
        }
      });
    },
    finishTopOrder() {
      finishTopOrder(this.topOrderId).then(res => {
        if (res.data.success) {
          this.$message.success("操作成功");
          this.initData();
        }
      });
    },
    refundApplyTopOrder() {
      refundApplyTopOrder(this.topOrderId).then(res => {
        if (res.data.success) {
          this.$message.success("操作成功");
          this.initData();
        }
      });
    },
    refundCancelTopOrder() {
      refundCancelTopOrder(this.topOrderId).then(res => {
        if (res.data.success) {
          this.$message.success("操作成功");
          this.initData();
        }
      });
    },
    refundConfirmTopOrder() {
      refundConfirmTopOrder(this.topOrderId).then(res => {
        if (res.data.success) {
          this.$message.success("操作成功");
          this.initData();
        }
      });
    },
    scheduleTopOrder() {
      scheduleTopOrder(this.topOrderId).then(res => {
        if (res.data.success) {
          this.$message.success("操作成功");
          this.initData();
        }
      });
    },
    // 子订单操作
    closeChildOrder(id) {
      closeChildOrder(id).then(res => {
        if (res.data.success) {
          this.$message.success("操作成功");
          this.getTopOrderDetail();
          this.getChildOrderlist();
        }
      });
    },
    finishChildOrder(id) {
      finishChildOrder(id).then(res => {
        if (res.data.success) {
          this.$message.success("操作成功");
          this.getTopOrderDetail();
          this.getChildOrderlist();
        }
      });
    },
    refundApplyChildOrder(id) {
      refundApplyChildOrder(id).then(res => {
        if (res.data.success) {
          this.$message.success("操作成功");
          this.getTopOrderDetail();
          this.getChildOrderlist();
        }
      });
    },
    refundConfirmChildOrder(id) {
      refundConfirmChildOrder(id).then(res => {
        if (res.data.success) {
          this.$message.success("操作成功");
          this.getTopOrderDetail();
          this.getChildOrderlist();
        }
      });
    },
    refundCancelChildOrder(id) {
      refundCancelChildOrder(id).then(res => {
        if (res.data.success) {
          this.$message.success("操作成功");
          this.getTopOrderDetail();
          this.getChildOrderlist();
        }
      });
    },
    scheduleChildOrder(id) {
      scheduleChildOrder(id).then(res => {
        if (res.data.success) {
          this.$message.success("操作成功");
          this.getTopOrderDetail();
          this.getChildOrderlist();
        }
      });
    },
    playTab() {},
    rowClick() {},
    checkNull(str) {
      return str == null || str == undefined || str == "" ? "--" : str;
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 > 0 ? "shinning" : "";
    }
  }
};
</script>

<style lang="scss" scoped>
.orderDetail_baseinfo_item {
  margin-bottom: 20px;
}
</style>
