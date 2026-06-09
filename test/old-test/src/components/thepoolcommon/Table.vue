<template>
  <el-table
    ref="multipleTable"
    :data="
      tableData.filter(
        (data) =>
          !search || data.name.toLowerCase().includes(search.toLowerCase())
      )
    "
    style="width: 100%"
    tooltip-effect="dark"
    @selection-change="handleSelectionChange"
    @row-click="rowClick"
    :row-key="getRowKeys"
    :header-cell-style="tablestyle.headercellstyle"
    :cell-style="tablestyle.rowstyle"
    :row-class-name="tableRowClassName"
    @select="selectCheck"
    @select-all="selectAllCheck"
  >
    <!-- 多选按钮 -->
    <el-table-column
      class-name="selectionColumn"
      v-if="showSelection"
      type="selection"
      width="50"
      :selectable="checkSelectable"
      :reserve-selection="true"
    >
    </el-table-column>
    <el-table-column
      v-for="(i, k) in tableTitle"
      :key="k"
      :prop="i.prop"
      :label="$t('consult')[i.label] ? $t('consult')[i.label] : i.label"
      show-overflow-tooltip
      :width="`${i.width}`"
      :fixed="i.fixed"
    >
      <template slot-scope="scope">
        <span
          class="tableColumnSpan"
          v-if="i.prop != 'isEnable' && i.prop != 'labelName'"
          :title="scope.row.description"
        >
          {{
            scope.row[i.prop] === null ||
            scope.row[i.prop] === "" ||
            scope.row[i.prop] === undefined
              ? "--"
              : String(scope.row[i.prop])
          }}
        </span>
      </template>
    </el-table-column>
    <el-table-column align="right" v-if="showSearch">
      <template slot="header" slot-scope="scope">
        <el-input
          v-model="search"
          size="mini"
          :placeholder="$t('consult.输入关键字搜索')"
        />
      </template>
    </el-table-column>
    <!-- 操作列 -->
    <el-table-column
      v-if="tableBtn.length > 0"
      fixed="right"
      :label="$t('consult.操作')"
      :width="`${tableBtn.length * (i18nlocel == 'en' ? 70 : 60)}px`"
    >
      <template slot-scope="scope">
        <div class="df_align_center table_textbtn">
          <span v-for="(s, b) in tableBtn" :key="b">
            <el-button
              v-if="!popoverBbtn.includes(s.name)"
              type="text"
              size="small"
              @click.stop.native="playTab(s.type, scope.row, scope)"
            >
              {{ $t("consult")[s.name] }}
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
                  @click.stop.native="cancledel(scope.$index)"
                  >{{ $t("consult.取消") }}</el-button
                >
                <el-button
                  style="width: 48%"
                  type="primary"
                  size="mini"
                  @click.stop.native="
                    cancledel(scope.$index), playTab(s.type, scope.row, scope)
                  "
                  >{{ $t("consult.确定") }}</el-button
                >
              </div>

              <el-button
                type="text"
                size="small"
                slot="reference"
                @click.stop
                :disabled="
                  (s.name == '禁用' && !Number(scope.row.status)) ||
                  (s.name == '启用' && Number(scope.row.status)) ||
                  s.assetStatus == Number(scope.row.status)
                    ? true
                    : false
                "
              >
                <span v-if="s.color != ''" :style="`color:${s.color}`">{{
                  $t("consult")[s.name]
                }}</span>
                <span v-else>{{ $t("consult")[s.name] }}</span>
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
import { consult } from "@/const/consult";
export default {
  name: "PCOrderTable",
  props: {
    tableTitle: {
      type: Array,
      require: true,
    },
    tableData: {
      type: Array,
      require: true,
    },
    tableBtn: {
      type: Array,
      require: true,
    },
    showSelection: {
      type: Boolean,
      require: false,
      default: true,
    },
    showSearch: {
      type: Boolean,
      require: false,
      default: false,
    },
    hasEnLabel: {
      type: Boolean,
      require: false,
      default: true,
    },
    // 新增一个prop，用于接收外部传入的已选中项ID列表
    // selectedIds: {
    //   type: Array,
    //   default: () => [],
    // },
  },
  computed: {
    ...mapGetters(["i18nlocel"]),
  },
  data() {
    return {
      search: "",
      tablestyle: consult["tablestyle"],
      selectionId: [],
      popoverBbtn: ["删除", "启用", "禁用", "闲置", "使用", "报废"],
      allSelectedItems: [],
      selectedIds: [],
    };
  },
  watch: {
    // 监听tableData变化，重新同步选中状态
    tableData: {
      handler() {
        this.$nextTick(() => {
          this.syncSelectedRows();
        });
      },
      deep: true,
    },
    selectedIds: {
      handler() {
        this.$nextTick(() => {
          this.$emit("changeSelectedCount", this.selectedIds.length);
        });
      },
      deep: true,
    },
  },

  mounted() {
    // 组件挂载后同步选中状态
    this.$nextTick(() => {
      this.syncSelectedRows();
    });
  },

  methods: {
    rowClick(row, column, event) {
      this.$emit("rowClick", row, column, event);
    },
    playTab(name, item, scope) {
      this.$emit("playTab", name, item);
    },
    cancledel(id) {
      console.log("this.$refs[id]", this.$refs[id]);
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
      // 提取所有选中项的ID并去重
      //   const ids = [...new Set(arr.map((i) => i.id))];
      //   this.selectionId = ids;
      //   // 保存所有选中项并去重
      //   this.allSelectedItems = this.removeDuplicateItems(arr);
      //   this.selectedIds = ids;
      //   console.log(
      //     "handleSelectionChange, row",
      //     arr,
      //     this.selectedIds,
      //     this.allSelectedItems
      //   );
      // 通知父组件选中项变化
      //   this.$emit("selection-change", this.allSelectedItems);
    },

    // 单选或取消单选处理
    selectCheck(selection, row) {
      // 如果行被选中
      if (selection.some((item) => item.id === row.id)) {
        // 如果allSelectedItems中不存在该行，则添加
        if (!this.allSelectedItems.some((item) => item.id === row.id)) {
          this.allSelectedItems.push({ ...row });
          this.selectedIds.push(row.id);
        }
      } else {
        // 如果行被取消选中，从allSelectedItems中移除
        this.allSelectedItems = this.allSelectedItems.filter(
          (item) => item.id !== row.id
        );
        this.selectedIds = this.selectedIds.filter((id) => id !== row.id);
      }

      // 确保ID数组去重
      this.selectedIds = [...new Set(this.selectedIds)];
      this.selectionId = this.selectedIds;
      console.log("selectCheck, row", this.selectedIds, this.allSelectedItems);
      // 通知父组件
      //   this.$emit("selection-change", this.allSelectedItems);
      //   this.$emit("update:selectedIds", this.selectedIds);
    },

    // 全选或取消全选处理
    selectAllCheck(selection) {
      console.log("selectAllCheck", selection);

      // 获取当前页的数据
      const currentPageData = this.tableData.filter(
        (data) =>
          !this.search ||
          data.name.toLowerCase().includes(this.search.toLowerCase())
      );

      // 全选操作
      if (selection.length > 0) {
        // 将当前页的所有数据添加到allSelectedItems（如果不存在）
        currentPageData.forEach((row) => {
          if (!this.allSelectedItems.some((item) => item.id === row.id)) {
            this.allSelectedItems.push({ ...row });
            if (!this.selectedIds.includes(row.id)) {
              this.selectedIds.push(row.id);
            }
          }
        });
      } else {
        // 取消全选操作，移除当前页的所有数据
        currentPageData.forEach((row) => {
          this.allSelectedItems = this.allSelectedItems.filter(
            (item) => item.id !== row.id
          );
          this.selectedIds = this.selectedIds.filter((id) => id !== row.id);
        });
      }

      // 确保ID数组去重
      this.selectedIds = [...new Set(this.selectedIds)];
      this.selectionId = this.selectedIds;
      // 通知父组件
      //   this.$emit("selection-change", this.allSelectedItems);
      //   this.$emit("update:selectedIds", this.selectedIds);
    },

    // 工具方法：移除数组中的重复项
    removeDuplicateItems(items) {
      const seen = new Set();
      return items.filter((item) => {
        const id = item.id;
        if (seen.has(id)) {
          return false;
        }
        seen.add(id);
        return true;
      });
    },
    checkSelectable(e) {
      return true;
    },
    // 动态更改一行table样式
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 > 0 ? "shinning" : "white-row";
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row, true);
        });
      }
      // else {
      //   this.$refs.multipleTable.clearSelection();
      // }
    },
    getRowKeys(row) {
      return row.id;
    },
    clearSelection() {
      this.$refs.multipleTable.clearSelection();
      this.allSelectedItems = [];
      this.selectedIds = [];
      this.selectionId = [];
    },
    // 同步选中行，用于跨页回显
    syncSelectedRows() {
      if (!this.$refs.multipleTable || !this.tableData) return;
      //   console.log("syncSelectedRows", this.selectedIds, this.tableData);
      // 清除当前页的所有选中状态
      this.$refs.multipleTable.clearSelection();
      // 根据selectedIds重新选择行
      this.$nextTick(() => {
        if (this.selectedIds && this.selectedIds.length > 0) {
          this.tableData.forEach((row) => {
            if (this.selectedIds.includes(row.id)) {
              //   console.log("row", row);

              this.$refs.multipleTable.toggleRowSelection(row, true);
            }
          });
        }
      });
    },

    // 提供一个公共方法，用于外部获取所有选中项
    getSelectedItems() {
      return this.allSelectedItems;
    },

    // 提供一个公共方法，用于外部设置选中项
    setSelectedItems(ids) {
      // 确保传入的ids是数组并去重
      const uniqueIds = ids && Array.isArray(ids) ? [...new Set(ids)] : [];
      this.selectedIds = uniqueIds;
      this.$emit("update:selectedIds", uniqueIds);

      // 同步选中状态
      this.$nextTick(() => {
        this.syncSelectedRows();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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
  height: 40px;
  line-height: 40px;
  box-sizing: border-box;
}
/deep/ .el-table__header th {
  &:first-child {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }
  &:last-child {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }
  background: #e6edff;
  border: none;
}
/deep/ .el-table__row td {
  &:first-child {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }
  &:last-child {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }
  border: none;
}
</style>
