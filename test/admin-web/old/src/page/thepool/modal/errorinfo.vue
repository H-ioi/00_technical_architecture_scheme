<template>
  <div class="thepool_page">
    <el-dialog
      :title="$t('btn.查看')"
      :visible.sync="showModal"
      width="800px"
      :before-close="closeModal"
      :close-on-click-modal="false"
      custom-class="pooldialog"
    >
      <div class="moadlFromBox">
        <div class="modal_top">
          <div class="modal_top_item">
            <div class="modal_top_item_icon"></div>
            <div class="modal_top_item_info">
              <span class="modal_top_item_label">{{ $t("consult.成功条数") }}</span>
              <span class="modal_top_item_value">{{ errorInfoData["successNum"] }}</span>
            </div>
          </div>
          <div class="modal_top_item">
            <div class="modal_top_item_icon"></div>
            <div class="modal_top_item_info">
              <span class="modal_top_item_label">{{ $t("consult.失败条数") }}</span>
              <span class="modal_top_item_value">{{ errorInfoData["errorNum"] }}</span>
            </div>
          </div>
        </div>
        <div class="modal_table">
          <el-table
            :header-cell-style="tablestyle.headercellstyle"
            :cell-style="tablestyle.rowstyle"
            :data="tableData"
            style="width: 100%"
            height="400"
          >
            <el-table-column show-overflow-tooltip prop="rowNum" label="序号" width="180">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="errMsg" label="错误原因">
            </el-table-column>
          </el-table>
        </div>
        <div
          class="modalFromBtn"
          style="width: 100%; margin-top: 20px; text-align: center"
        >
          <el-button type="primary" size="medium" round @click="downTable">{{
            $t("consult.下载错误说明")
          }}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "errorinfo",
  props: {},
  data() {
    return {
      tablestyle: {
        headercellstyle: {
          background: "#F5F8FD",
          color: " #2A3F54",
          "font-size": "14px",
          "font-weight": "400",
          height: "38px",
          "font-family": "AlibabaPuHuiTiM",
          "text-align": "center",
        },
        rowstyle: {
          color: " #666666",
          "font-size": "14px",
          "font-weight": "400",
          height: "44px",
          padding: "0px",
          "text-align": "center",
        },
      },
      showModal: false,
      errorInfoData: {
        successNum: 0,
        errorNum: 0,
      },
      tabelTitle: [
        {
          prop: "rowNum",
          label: "行数",
        },
        {
          prop: "errMsg",
          label: "错误信息",
        },
      ],
      tableData: [],
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["pooldictpermissions", "permissions", "dictionary", "i18nlocel"]),
  },
  methods: {
    show(data) {
      this.showModal = true;
      this.$nextTick(() => {
        let { errList, failCount, successCount } = data;
        this.tableData = errList;
        this.errorInfoData = {
          successNum: successCount,
          errorNum: failCount,
        };
      });
    },
    closeModal() {
      this.showModal = false;
      this.errorInfoData = {
        successNum: 0,
        errorNum: 0,
        details: [],
      };
    },
    downTable() {
      // 定义 CSV 内容的表头
      const headers = this.tabelTitle.map((item) => item.label).join(",");
      // 转换表格数据为 CSV 行
      const rows = this.tableData.map((item) => {
        return this.tabelTitle
          .map((title) => {
            let value = item[title.prop];
            // 处理值中包含逗号的情况，用双引号包裹
            if (typeof value === "string" && value.includes(",")) {
              value = `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          })
          .join(",");
      });

      // 合并表头和数据行
      const csvContent = [headers, ...rows].join("\n");

      // 创建一个 Blob 对象
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      // 创建一个下载链接
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "error_table.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal_top {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  .modal_top_item {
    display: flex;
    align-items: center;
    margin: 0 40px;
    .modal_top_item_icon {
      margin-right: 30px;
      width: 60px;
      height: 60px;
    }
    &:first-child {
      .modal_top_item_icon {
        background: url("../../../../public/img/isagroup/icon_success.png") no-repeat;
        background-size: cover;
      }
    }
    &:last-child {
      .modal_top_item_icon {
        background: url("../../../../public/img/isagroup/icon_fail.png") no-repeat;
        background-size: cover;
      }
    }
    .modal_top_item_info {
      min-width: 60px;
      height: 60px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      .modal_top_item_label {
        font-family: AlibabaPuHuiTiM;
        font-size: 14px;
        color: #333333;
        white-space: nowrap;
      }
      .modal_top_item_value {
        font-family: DIN, DIN;
        font-weight: 500;
        font-size: 30px;
        color: #333333;
        white-space: nowrap;
      }
    }
  }
}
</style>
