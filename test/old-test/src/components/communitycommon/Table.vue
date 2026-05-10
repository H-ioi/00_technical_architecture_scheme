<template>
  <el-table
    ref="multipleTable"
    style="width: 100%"
    :height="height || undefined"
    :data="tableData"
    tooltip-effect="dark"
    @selection-change="handleSelectionChange"
    @row-click="rowClick"
    :row-key="getRowKeys"
    :header-cell-style="tablestyle.headercellstyle"
    :row-class-name="tableRowClassName"
    :cell-style="tableCellClassName"
    @select="selectCheck"
    @select-all="selectAllCheck"
    @sort-change="sortChange"
    class="table_fixed"
  >
    <!-- 多选按钮 -->
    <el-table-column
      v-if="showSelection"
      type="selection"
      width="50"
      :selectable="checkSelectable"
      :reserve-selection="false"
    >
    </el-table-column>
    <el-table-column
      v-for="(i, k) in tableTitle"
      :key="k"
      :prop="i['prop']"
      :label="
        i['hasEn'] ? $t('isagroup')[i['label']] || i['label'] : i['label']
      "
      show-overflow-tooltip
      :width="`${i['width']}`"
      :fixed="i['fixed']"
      :sortable="i['sortable']"
    >
      <template slot-scope="scope">
        <span v-if="!i.isUrl" :title="resetData(scope.row[i.prop])">
          {{ resetData(scope.row[i.prop]) }}</span
        >
        <a
          v-if="i.isUrl"
          style="color: #ba8e62"
          :href="resetData(scope.row[i.prop])"
          target="_blank"
          >{{ resetData(scope.row[i.prop]) }}</a
        >
      </template>
    </el-table-column>

    <!-- 操作列 -->
    <el-table-column
      v-if="tableBtn.length > 0"
      fixed="right"
      :label="$t('common.操作')"
      :width="`${tableBtn.length * (i18nlocel == 'en' ? 100 : 60)}px`"
    >
      <template slot-scope="scope">
        <div class="df_align_center table_textbtn">
          <span v-for="(s, b) in tableBtn" :key="b">
            <el-button
              v-if="!popoverBbtn.includes(s.name)"
              type="text"
              size="small"
              :disabled="setDisabledType(s.type, scope.row, scope)"
              @click.stop="playTab(s.type, scope.row, scope)"
            >
              {{ $t("btn")[s.name] }}
            </el-button>
            <el-popover
              v-else
              :ref="scope.$index"
              placement="top"
              class="popoverBtn"
            >
              <div class="df_sb">
                <el-button
                  style="width: 48%"
                  type="defult"
                  size="mini"
                  @click="cancledel(scope.$index)"
                  >{{ $t("btn.取消") }}</el-button
                >
                <el-button
                  style="width: 48%"
                  type="primary"
                  size="mini"
                  @click.stop="
                    cancledel(scope.$index), playTab(s.type, scope.row, scope)
                  "
                  >{{ $t("btn.确定") }}</el-button
                >
              </div>

              <el-button
                :style="`${
                  s.color == '' ? '' : 'color:' + s.color + '!important'
                }`"
                type="text"
                size="small"
                slot="reference"
              >
                <span>{{ $t("btn")[s.name] }}</span>
              </el-button>
            </el-popover>
          </span>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapGetters } from "vuex";
import { tableObj } from "@/const/tabledata/index";
import consts from "@/const/isagroup/consts.js";
export default {
  name: "PCOrderTable",
  props: {
    tableType: {
      type: String,
      require: false,
      default: null,
    },
    height: {
      type: [String, Number],
      require: false,
      default: undefined,
    },
    tableTitle: {
      type: Array,
      require: true,
      default: () => {
        return [];
      },
    },
    tableData: {
      type: Array,
      require: true,
      default: () => {
        return [];
      },
    },
    tableBtn: {
      type: Array,
      require: false,
      default: () => {
        return [];
      },
    },
    showSelection: {
      type: Boolean,
      require: false,
      default: false,
    },
    showSearch: {
      type: Boolean,
      require: false,
      default: false,
    },
  },
  data() {
    return {
      search: "",
      tablestyle: {
        headercellstyle: {
          background: "#F5F8FD",
          color: "#333333 !important",
          "font-size": "14px",
          "font-weight": "400",
          height: "38px",
          "font-family": "AlibabaPuHuiTiM",
        },
        rowstyle: {
          color: " #666666",
          "font-size": "14px",
          "font-weight": "400",
          height: "44px",
          padding: "0px",
        },
      },
      selectionId: [],
      popoverBbtn: ["删除"],
    };
  },
  computed: {
    ...mapGetters(["i18nlocel"]),
  },
  watch: {
    tableData: {
      handler: function (newVal, oldVal) {
        this.resetHeight();
      },
      deep: true,
    },
  },
  mounted() {},
  activated() {},

  methods: {
    rowClick(row, column, event) {
      this.$emit("rowClick", row, column, event);
    },
    playTab(name, item, scope) {
      this.$emit("playTab", name, item);
    },
    cancledel(id) {
      let arr = this.$refs[id];
      arr.map((item) => {
        item.doClose();
      });
    },

    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    // 多选
    handleSelectionChange(arr) {
      this.selectionId = [];
      arr.map((i) => {
        this.selectionId.push(i.id);
      });
    },
    checkSelectable(e) {
      return true;
    },
    // 动态更改一行table样式
    tableRowClassName({ rowIndex }) {
      // return rowIndex % 2 > 0 ? "shinning" : "";
      return "";
    },
    // 动态更改单元格样式
    tableCellClassName({ row, column, rowIndex, columnIndex }) {
      let data = {
        ...this.tablestyle["rowstyle"],
      };
      let columnItem = this.tableTitle[columnIndex];
      if (!columnItem) {
        data["background"] = "#ffffff";
      } else {
        if (!columnItem["hasColor"]) {
          data["background"] = "#ffffff";
        } else {
          if (row["cellType"] == "classCombine") {
            data["background"] = this.setColor(
              row[columnItem["prop"]],
              columnItem["gradeType"]
            );
          } else {
            if (row["cellType"]) {
              data["background"] = this.setColor(
                row[columnItem["prop"]],
                row["cellType"]
              );
            } else {
              data["background"] = "#ffffff";
            }
          }
        }
      }
      return data;
    },

    selectCheck(selection, row) {
      console.log("selectCheck, row", selection, row);
    },
    selectAllCheck(selection) {
      console.log("selectAllCheck", selection);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      }
    },
    getRowKeys(row) {
      return row.id;
    },
    resetData(item) {
      return item === null || item === "" || item === undefined
        ? "--"
        : String(item);
    },
    setColor(value, type) {
      let color = "#ffffff";
      let isNumber = !isNaN(parseFloat(value)) && isFinite(value);
      // console.log("isNumber", isNumber);
      if (!value || !isNumber) return color;
      let scoreColorList = consts["scoreColorList"];
      scoreColorList.map((item) => {
        let score = item[type];
        if (!(value < score["min"]) && !(value > score["max"])) {
          color = item["value"];
        }
      });
      return color;
    },
    sortChange(column, prop, order) {
      this.$emit("sortChange", {
        prop: column["prop"],
        order: column["order"],
      });
    },
    resetHeight() {
      this.$nextTick(() => {
        if (this.$refs.multipleTable) {
          try {
            // 安全地调用doLayout，避免在表格未完全初始化时出错
            this.$refs.multipleTable.doLayout();

            // 只有当height有有效值时才尝试更新高度
            if (
              this.height &&
              this.$refs.multipleTable.layout &&
              this.$refs.multipleTable.layout.updateElsHeight
            ) {
              this.$refs.multipleTable.layout.updateElsHeight();
            }
          } catch (error) {
            console.warn("重置表格高度时出错:", error);
          }
        }
      });
    },
    // 设置禁用状态
    setDisabledType(name, item, scope) {
      let isDisabled = false;
      if (this.tableType == "activity") {
        if (
          item["activityStatus"] != "1" &&
          item["activityStatus"] != "0" &&
          name == "edit"
        ) {
          isDisabled = true;
        }
      }
      return isDisabled;
    },
  },
};
</script>

<style lang="scss" scoped>
// /deep/ .el-table__body-wrapper {
//   min-height: 450px !important;
// }
.isEnable {
  font-size: 14px;
  padding: 4px 10px;
  box-sizing: border-box;
  color: #447777;
  background: rgba(23, 103, 103, 0.15);
}

.isDisable {
  font-size: 14px;
  padding: 4px 10px;
  box-sizing: border-box;
  color: #666666;
  background: rgba(153, 153, 153, 0.15);
}

.tableColumnSpan {
  display: inline-block;
  width: 100%;
  height: 54px;
  line-height: 54px;
}
/deep/.el-table th > .cell {
  color: #333333 !important;
  font-size: 14px;
}
// .table_fixed {
//   /deep/.el-table__body-wrapper {
//     min-height: 360px !important;
//   }
// }
</style>
