<template>
  <div>
    <StatusItem
      :statusList="statusList"
      :currentstatus="currentstatus"
      @changeStasus="changeStasus"
    />
    <div class="searchFromBox">
      <Form @search="search" ref="Form" :status="currentstatus" />
    </div>
    <div class="df_sb palyTableBox" v-if="tableData.length > 0">
      <div class="tablelist">
        <div v-for="(item, index) in tableData" :key="index">
          <div class="tablelist_top df_sb">
            <div class="df_center">
              <div class="df_center">
                <div class="tablelist_top_label">订单编号：</div>
                <div class="tablelist_top_value">{{ item["tradeNo"] }}</div>
              </div>
              <div class="df_center">
                <div class="tablelist_top_label">下单时间：</div>
                <div class="tablelist_top_value">{{ item["createTime"] }}</div>
              </div>
              <div class="df_center">
                <div class="tablelist_top_label">交易方式：</div>
                <div class="tablelist_top_value">
                  {{ course["payMethod"][item["method"]] }}
                </div>
              </div>
              <div class="df_center">
                <div class="tablelist_top_label">子订单：</div>
                <el-popover
                  placement="top-start"
                  title="子订单"
                  width="300"
                  trigger="hover"
                >
                  <div
                    class="tablelist_top_value"
                    v-for="(sub, b) in item['subList']"
                    :key="b"
                  >
                    {{ sub["tradeNo"] }}
                  </div>
                  <div class="tablelist_top_value" slot="reference">
                    <span>{{ item["subList"][0]["tradeNo"] }}...</span>
                  </div>
                </el-popover>
              </div>
            </div>
            <div class="df_center">
              <div class="tablelist_top_label">订单状态：</div>
              <div class="tablelist_top_value">
                {{ course["orderStatusObj"][item["status"]] }}
              </div>
            </div>
          </div>
          <div class="df_center table_info">
            <div class="table_info_item">
              <div
                v-if="
                  item['extra']['nameCn'] != '' &&
                    item['extra']['nameCn'] != null
                "
                class="df_start_center"
              >
                <div class="table_info_item_label"></div>
                <div class="table_info_item_value">
                  主课程： {{ item["extra"]["nameCn"] }}
                </div>
              </div>
              <div
                class="df_start_center"
                v-for="(sub, b) in item['subList']"
                :key="b"
              >
                <div class="table_info_item_label"></div>
                <div class="table_info_item_value">
                  子课程：{{ sub["nameCn"] }}
                </div>
              </div>
            </div>
            <div class="table_info_item">
              <div class="df_start_center">
                <div class="table_info_item_label">家长手机：</div>
                <div class="table_info_item_value">
                  {{ item["extra"]["parentEmail"] }}
                </div>
              </div>
              <div class="df_start_center">
                <div class="table_info_item_label">家长邮箱：</div>
                <div class="table_info_item_value">
                  {{ item["extra"]["parentPhone"] }}
                </div>
              </div>
            </div>
            <div class="table_info_item">
              <div class="df_start_center">
                <div class="table_info_item_label">学生姓名：</div>
                <div class="table_info_item_value">
                  {{ item["extra"]["studentNameCn"] }}
                </div>
              </div>
              <div class="df_start_center">
                <div class="table_info_item_label">学生性别：</div>
                <div class="table_info_item_value">
                  {{ item["extra"]["studentGender"] == 1 ? "男" : "女" }}
                </div>
              </div>
              <div class="df_start_center">
                <div class="table_info_item_label">学生学校：</div>
                <div class="table_info_item_value">
                  {{ item["extra"]["studentSchool"] }}
                </div>
              </div>
              <div class="df_start_center">
                <div class="table_info_item_label">学生年级：</div>
                <div class="table_info_item_value">
                  {{ item["extra"]["studentGrade"] }}
                </div>
              </div>
            </div>
            <div class="table_info_item">
              <div class="df_start_center">
                <div class="table_info_item_label">订单价格：</div>
                <div class="table_info_item_value">
                  {{ item["price"] / 100 }}(RMB/元)
                </div>
              </div>
            </div>
            <div class="table_info_itembtn" style=" width: 150px;">
              <el-button type="text" size="small" @click.stop="lookOrder(item)">
                查看订单
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="palyOrder('pay', item.id)"
                v-if="
                  item['status'] == 'unpaid' &&
                    permissions['isaic_order_op_pay']
                "
              >
                支付
              </el-button>
              <!-- <el-button
                type="text"
                size="small"
                @click="palyOrder('close', item.id)"
                v-if="
                  item['status'] == 'unpaid' &&
                    permissions['isaic_order_op_close']
                "
              >
                关闭
              </el-button> -->
              <el-button
                type="text"
                size="small"
                @click="palyOrder('refundApply', item.id)"
                v-if="showApplyBtn(item)"
              >
                申请退款
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="palyOrder('refundCancel', item.id)"
                v-if="
                  item['status'] == 'refund_applying' &&
                    permissions['isaic_order_op_refund_cancel']
                "
              >
                取消退款
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="palyOrder('refund', item.id)"
                v-if="
                  item['status'] == 'refund_applying' &&
                    permissions['isaic_order_op_refund_confirm']
                "
              >
                确认退款
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="palyOrder('finish', item.id)"
                v-if="
                  item['status'] == 'scheduled' &&
                    permissions['isaic_order_op_finish']
                "
              >
                完成课程
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="palyOrder('schedule', item.id)"
                v-if="showScheduleBtn(item)"
              >
                排课
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <PaginationInfo :paginationTotal="paginationTotal" /> -->
    <div class="tableBox">
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
import { tablestyle } from "@/const/tabledata/index";
import moment from "moment";
import Table from "@/components/common/Table.vue";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import StatusItem from "@/components/common/StatusItem.vue";
import Form from "./formlist/list.vue";
import course from "@/const/academy/course.js";
import order from "@/const/academy/order.js";
import {
  getTopOrderPage,
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
  payChildOrder,
  refundApplyChildOrder,
  refundConfirmChildOrder,
  scheduleChildOrder
} from "@/api/academy/order.js";
import { download } from "@/util/download.js";

export default {
  name: "ISA-SEARCH",
  components: {
    Pagination,
    PaginationInfo,
    Table,
    StatusItem,
    Form
  },
  data() {
    return {
      course: course,
      order: order,
      tablestyle: tablestyle,
      pagination: {
        size: 10,
        current: 1
      },
      paginationTotal: 0,
      tableTitle: [],
      tableBtn: [],
      tableData: [],
      searchFrom: {},
      statusList: course["orderStatusList"],
      currentstatus: "1"
    };
  },
  created() {
    this.getTabelData();
  },

  mounted() {},
  activated() {
    this.getTabelData();
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    getTabelData() {
      let data = {
        ...this.searchFrom,
        ...this.pagination
      };
      if (this.currentstatus != "1") {
        data["status"] = this.currentstatus;
      }
      Object.keys(data).forEach(res => {
        if (data[res] == "" || data[res] == undefined || data[res] == null) {
          delete data[res];
        }
      });
      getTopOrderPage(data).then(res => {
        console.log("getTopOrderPage", res);
        if (res.data.success) {
          let { data, total } = res.data.data;
          this.paginationTotal = total;
          this.tableData = data;
          this.tableData.map(item => {
            item["status"] = order["setOrderStatus"](
              item["status"],
              item["marks"]
            );
          });
        }
      });
    },
    // 操作主订单
    palyOrder(type, id) {
      switch (type) {
        case "pay":
          this.payTopOrder(id);
          break;
        case "close":
          this.closeTopOrder(id);
          break;
        case "refundApply":
          this.refundApplyTopOrder(id);
          break;
        case "finish":
          this.finishTopOrder(id);
          break;
        case "refund":
          this.refundConfirmTopOrder(id);
          break;
        case "schedule":
          this.scheduleTopOrder(id);
          break;
        case "refundCancel":
          this.refundCancelTopOrder(id);
          break;
      }
    },
    payTopOrder(id) {
      payTopOrder(id).then(res => {
        if (res.data.success) {
          this.$message.success("操作成功");
          this.getTabelData();
        }
      });
    },
    closeTopOrder(id) {
      closeTopOrder(id).then(res => {
        if (res.data.success) {
          this.$message.success("操作成功");
          this.getTabelData();
        }
      });
    },
    finishTopOrder(id) {
      finishTopOrder(id).then(res => {
        if (res.data.success) {
          this.$message.success("操作成功");
          this.getTabelData();
        }
      });
    },
    refundApplyTopOrder(id) {
      refundApplyTopOrder(id).then(res => {
        if (res.data.success) {
          this.$message.success("操作成功");
          this.getTabelData();
        }
      });
    },
    refundCancelTopOrder(id) {
      refundCancelTopOrder(id).then(res => {
        if (res.data.success) {
          this.$message.success("操作成功");
          this.getTabelData();
        }
      });
    },
    refundConfirmTopOrder(id) {
      refundConfirmTopOrder(id).then(res => {
        if (res.data.success) {
          this.$message.success("操作成功");
          this.getTabelData();
        }
      });
    },
    scheduleTopOrder(id) {
      scheduleTopOrder(id).then(res => {
        if (res.data.success) {
          this.$message.success("操作成功");
          this.getTabelData();
        }
      });
    },
    lookOrder(item) {
      this.$router.push(`/academy/order/detail?topOrderId=${item["id"]}`);
    },
    rowClick(row, column, event) {
      console.log("rowClick", row, column, event);
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getTabelData();
    },
    // 搜索
    search(data) {
      this.searchFrom = data;
      this.pagination["current"] = 1;
      this.getTabelData();
    },

    clear() {
      this.getTabelData();
    },
    setDate(date, timeStr) {
      return !date ? "--" : moment(date).format(timeStr);
    },
    resetTabelData(data) {
      return data === null || data === "" || data === undefined
        ? "--"
        : String(data);
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 > 0 ? "shinning" : "";
    },
    changeStasus(item, index) {
      console.log("item, index", item, index);
      this.searchFrom = {};
      this.currentstatus = item.type;
      this.$refs["Form"].clearAll();
      this.getTabelData();
    },
    showApplyBtn(item) {
      let subList = item["subList"];
      let hasBtn =
        (item["status"] == "paid" || item["status"] == "scheduled") &&
        this.permissions["isaic_order_op_refund_apply"];
      let has_refund_apply = false;
      subList.map(sub => {
        let marks = sub["marks"];
        marks.map(option => {
          if (option["mark"] == "refund_apply") {
            has_refund_apply = true;
          }
        });
      });
      return hasBtn && !has_refund_apply;
    },
    showScheduleBtn(item) {
      let subList = item["subList"];
      let hasBtn =
        item["status"] == "paid" &&
        this.permissions["isaic_order_op_schedule"] &&
        (item["extra"]["outerId"]
          ? item["extra"]["scene"] != 4
          : item["subList"][0]["scene"] != 4);
      let has_refund_apply = false;
      subList.map(sub => {
        let marks = sub["marks"];
        marks.map(option => {
          if (option["mark"] == "refund_apply") {
            has_refund_apply = true;
          }
        });
      });
      return hasBtn && !has_refund_apply;
    }
  }
};
</script>

<style lang="scss" scoped>
.searchFromBox {
  background-color: #fff;
  padding: 20px 20px 0;
  .searchFromBox_header {
    margin-bottom: 20px;
    .searchFromBox_header_titel {
      font-size: 20px;
      font-family: AlibabaPuHuiTiM;
      color: #333333;
      line-height: 27px;
      padding-left: 15px;
      position: relative;
      &::before {
        content: "";
        position: absolute;
        top: 1px;
        bottom: 1px;
        left: 0;
        width: 5px;
        background: #d4ab85 !important;
        border-radius: 3px;
      }
    }
  }
  .palyTableBox {
    padding-top: 10px;
  }
}
.tableRow {
  display: block;
  width: 100%;
  white-space: nowrap; //不换行
  overflow: hidden; //超出部分隐藏
  text-overflow: ellipsis; //文本溢出显示省略号
}
/deep/.el-table__fixed-body-wrapper {
  top: 60px !important;
}
.tablelist {
  width: 100%;
  .tablelist_top {
    width: 100%;
    background: #f8f8f8;
    padding: 10px;
    .df_center {
      margin-right: 20px;
    }
    .tablelist_top_label {
      font-size: 16px;
      color: #999999;
    }
    .tablelist_top_value {
      font-size: 16px;
      color: #000000;
    }
  }
  .table_info {
    .table_info_item {
      flex: 1;
      height: 200px;
      padding: 20px;
      border-right: 1px solid #efefef;
      text-align: left;
      box-sizing: border-box;
      .table_info_item_label {
        font-size: 14px;
        color: #999999;
        line-height: 24px;
      }
      .table_info_item_label {
        font-size: 14px;
        color: #999999;
        line-height: 24px;
      }
    }
    .table_info_itembtn {
      width: 150px;
      height: 200px;
      padding: 20px;
      text-align: left;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      flex-direction: column;
      .el-button {
        margin-left: 0px !important;
      }
    }
  }
}
</style>
