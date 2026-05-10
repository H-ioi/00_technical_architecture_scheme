<template>
  <el-table
    ref="multipleTable"
    :data="
      tableData.filter(
        (data) => !search || data.name.toLowerCase().includes(search.toLowerCase())
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
      :prop="i.prop"
      :label="
        $route.path.indexOf('thepool') == -1
          ? i.label
          : hasEnLabel
          ? $t('consult')[i.label]
          : i.label
      "
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
        <span
          v-if="i.prop == 'isEnable'"
          :class="scope.row.isEnable ? 'isEnable' : 'isDisable'"
          >{{ scope.row.isEnable ? "启用" : "已禁用" }}</span
        >
        <span
          v-if="i.prop == 'labelName'"
          class="isEnable"
          :style="`background:${scope.row.backgroundColor};color:${scope.row.fontColor}`"
          >{{ scope.row.labelName }}</span
        >
      </template>
    </el-table-column>
    <el-table-column align="right" v-if="showSearch">
      <template slot="header" slot-scope="scope">
        <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
      </template>
    </el-table-column>
    <!-- 操作列 -->
    <el-table-column
      v-if="tableBtn.length > 0"
      fixed="right"
      :label="$route.path.indexOf('thepool') == -1 ? '操作' : $t('consult.操作')"
      :width="`${tableBtn.length * 60}px`"
    >
      <template slot-scope="scope">
        <div class="df_align_center table_textbtn">
          <span v-for="(s, b) in tableBtn" :key="b">
            <el-button
              v-if="!popoverBbtn.includes(s.name)"
              type="text"
              size="small"
              :disabled="
                $route.path == '/order/mylist/index'
                  ? !scope.row.hasMyAuthority && s.name != '补充' && s.name != '查看'
                  : s.name == '绑定空间'
                  ? scope.row.status === 0
                  : $route.path == '/thepool/enquiry/index/index' ||
                    $route.path == '/thepool/enquiry/my/index'
                  ? scope.row.followStatus != 1 &&
                    scope.row.followStatus != 0 &&
                    s.type != 'look' &&
                    s.type != 'activate'
                  : false
              "
              @click.stop.native="playTab(s.type, scope.row, scope)"
            >
              {{ $route.path.indexOf("thepool") == -1 ? s.name : $t("consult")[s.name] }}
            </el-button>
            <el-popover v-else :ref="scope.$index" placement="top" class="popoverBtn">
              <div class="df_sb">
                <el-button
                  style="width: 48%"
                  type="defult"
                  size="mini"
                  @click.stop.native="cancledel(scope.$index)"
                  >{{
                    $route.path.indexOf("thepool") == -1 ? "取消" : $t("consult.取消")
                  }}</el-button
                >
                <el-button
                  style="width: 48%"
                  type="primary"
                  size="mini"
                  @click.stop.native="
                    cancledel(scope.$index), playTab(s.type, scope.row, scope)
                  "
                  >{{
                    $route.path.indexOf("thepool") == -1 ? "确定" : $t("consult.确定")
                  }}</el-button
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
                  $route.path.indexOf("thepool") == -1 ? s.name : $t("consult")[s.name]
                }}</span>
                <span v-else>{{
                  $route.path.indexOf("thepool") == -1 ? s.name : $t("consult")[s.name]
                }}</span>
              </el-button>
            </el-popover>
          </span>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { tableObj } from "@/const/tabledata/index";
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
  },
  data() {
    return {
      search: "",
      tablestyle: {
        headercellstyle: {
          background: "#F8F8F8",
          color: " #333333",
          "font-size": "16px",
          "font-weight": "400",
          height: "60px",
        },
        rowstyle: {
          color: " #999999",
          "font-size": "14px",
          "font-weight": "400",
          height: "54px",
          border: "none",
          padding: "0px",
        },
      },
      selectionId: [],
      popoverBbtn: ["删除", "启用", "禁用", "闲置", "使用", "报废"],
    };
  },

  mounted() {},

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
      return rowIndex % 2 > 0 ? "shinning" : "";
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
      // else {
      //   this.$refs.multipleTable.clearSelection();
      // }
    },
    getRowKeys(row) {
      return row.id;
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
  height: 54px;
  line-height: 54px;
}
</style>
