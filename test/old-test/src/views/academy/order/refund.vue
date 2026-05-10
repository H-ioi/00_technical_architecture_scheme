<template>
  <div>
    <StatusItem
      :statusList="statusList"
      :currentstatus="String(currentstatus)"
      @changeStasus="changeStasus"
    />
    <div class="searchFromBox">
      <refundForm @search="search" ref="refundForm" />
    </div>
    <div class="df_sb palyTableBox">
      <div>
        <el-button
          type="primary"
          size="medium"
          v-if="
            currentstatus == 1 &&
              permissions['isaic_order_refund_audit_approve']
          "
          @click="batchPlayTab('approve')"
          >同意</el-button
        >
        <el-button
          type="primary"
          size="medium"
          v-if="
            currentstatus == 1 && permissions['isaic_order_refund_audit_refuse']
          "
          @click="batchPlayTab('refuse')"
          >拒绝</el-button
        >
      </div>
      <PaginationInfo :paginationTotal="paginationTotal" />
    </div>
    <div class="tableBox">
      <el-table
        style="width: 100%"
        :header-cell-style="tablestyle['headercellstyle']"
        :cell-style="tablestyle['rowstyle']"
        :row-class-name="tableRowClassName"
        :data="tableData"
        @row-click="rowClick"
        @selection-change="handleSelectionChange"
      >
        <!-- 多选按钮 -->
        <el-table-column
          type="selection"
          width="50"
          :selectable="e => true"
          :reserve-selection="false"
        >
        </el-table-column>
        <el-table-column
          v-for="(item, index) in tableTitle"
          :key="index"
          :prop="item['prop']"
          :label="item['label']"
          :width="item['width']"
          :fixed="item['fixed']"
        >
          <template slot-scope="scope">
            <span
              class="tableRow"
              :title="resetTabelData(scope.row[item['prop']])"
            >
              {{ resetTabelData(scope.row[item["prop"]]) }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="120px`"
          v-if="currentstatus == 1"
        >
          <template slot-scope="scope">
            <div class="df_align_center table_textbtn">
              <!-- <span>
                <el-button
                  type="text"
                  size="small"
                  @click.stop="playTab('look', scope.row, scope)"
                >
                  查看
                </el-button>
              </span> -->
              <span>
                <el-button
                  v-if="
                    currentstatus == 1 &&
                      permissions['isaic_order_refund_audit_approve']
                  "
                  type="text"
                  size="small"
                  @click.stop="playTab('approve', scope.row, scope)"
                >
                  同意
                </el-button>
              </span>
              <span>
                <el-button
                  type="text"
                  size="small"
                  v-if="
                    currentstatus == 1 &&
                      permissions['isaic_order_refund_audit_refuse']
                  "
                  @click.stop="playTab('refuse', scope.row, scope)"
                >
                  拒绝
                </el-button>
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
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
import Table from "@/components/common/Table.vue";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import StatusItem from "@/components/common/StatusItem.vue";
import course from "@/const/academy/course.js";
import refundForm from "./formlist/refund.vue";
import {
  getRefundOrderPage,
  approveRefundOrder,
  refuseRefundOrder
} from "@/api/academy/order.js";
import { download } from "@/util/download.js";
import { resetData } from "@/util/util.js";

export default {
  name: "ISA-SEARCH",
  components: {
    Pagination,
    PaginationInfo,
    Table,
    StatusItem,
    refundForm
  },
  data() {
    return {
      course: course,
      tablestyle: tablestyle,
      pagination: {
        size: 10,
        current: 1
      },
      paginationTotal: 0,
      tableTitle: course["refundTableTitle"],
      tableData: [],
      selectionId: [],
      currenntItem: {},
      searchFrom: {},
      statusList: course["refundStatusList"],
      currentstatus: 1
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
        ...this.pagination,
        status: this.currentstatus
      };
      getRefundOrderPage(data).then(res => {
        console.log("getRefundOrderPage", res);
        if (res.data.success) {
          let { data, total, records, current } = res.data.data;
          this.paginationTotal = total;
          this.tableData = data;
          this.tableData.map(item => {
            item["price"] = item["price"] / 100;
            item["kind"] = course["courseKind"][item["kind"]];
            item["statusLabel"] = course["refundStatusObj"][item["status"]];
          });
        }
      });
    },
    approveRefundOrder(data) {
      approveRefundOrder(data).then(res => {
        if (res.data.success) {
          this.$message.success("操作成功");
          this.getTabelData();
        }
      });
    },
    refuseRefundOrder(data) {
      refuseRefundOrder(data).then(res => {
        if (res.data.success) {
          this.$message.success("操作成功");
          this.getTabelData();
        }
      });
    },
    playTab(type, row, scope) {
      let data = new FormData();
      data.append("ids", [row.id]);
      switch (type) {
        case "edit":
        case "approve":
          this.$confirm("确认吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.approveRefundOrder(data);
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消"
              });
            });
          break;
        case "refuse":
          this.$confirm("确认吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.refuseRefundOrder(data);
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消"
              });
            });
          break;
      }
    },
    batchPlayTab(type) {
      if (this.selectionId == 0) {
        this.$message.error("请先选择订单");
      } else {
        let data = new FormData();
        data.append("ids", this.selectionId);
        switch (type) {
          case "approve":
            this.$confirm("确认吗?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.approveRefundOrder(data);
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消"
                });
              });
            break;
          case "refuse":
            this.$confirm("确认吗?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.refuseRefundOrder(data);
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消"
                });
              });
            break;
        }
      }
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
    resetTabelData(data) {
      return resetData(data);
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 > 0 ? "shinning" : "";
    },
    handleSelectionChange(arr) {
      this.selectionId = [];
      arr.map(i => {
        this.selectionId.push(i.id);
      });
    },
    changeStasus(item, index) {
      console.log("item, index", item, index);
      this.searchFrom = {};
      this.currentstatus = item.type;
      this.$refs["refundForm"].clearAll();
      this.getTabelData();
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
</style>
