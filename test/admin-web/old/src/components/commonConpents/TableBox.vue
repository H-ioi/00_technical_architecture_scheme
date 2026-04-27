<template>
  <div class="tableStyle">
    <div :class="['tableTop', 'df_sb']" v-if="tableObj['haveTableTitle']">
      <span style="font-size: 18px; font-weight: 600">{{
        tableObj["tableTitle"]
      }}</span>
      <div :class="['df_fe']">
        <div v-for="(item, index) in tableObj['BtnObj']" :key="index">
          <el-button
            v-if="filterPermissionsBtn(permissions, item.btn)"
            class="btn_small"
            type="primary"
            @click="playBtn(item.name)"
            style="margin-left: 20px"
          >
            {{ item.name }}
          </el-button>
        </div>
      </div>
    </div>
    <el-table
      :header-cell-style="tablestyle.headercellstyle"
      :row-style="tablestyle.rowstyle"
      ref="listTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @row-click="rowclick"
    >
      <el-table-column
        v-if="tableObj['isSelection']"
        type="selection"
        :selectable="checkSelectable"
        width="55"
      >
      </el-table-column>
      <!-- <el-table-column type="index" :index="indexMethod"> </el-table-column> -->
      <el-table-column
        v-for="(item, index) in tableObj['labelType']"
        :key="index"
        :prop="item.prop"
        :label="item.label"
      >
        <template slot-scope="scope">
          <span v-if="item.prop == 'status'" style="cursor: pointer">
            <svg
              @click="changeStatus(scope.row['status'], item, scope.row['id'])"
              v-if="scope.row['status']"
              t="1639374837648"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="5376"
              width="46"
              height="30"
            >
              <path
                d="M2 512c0-141 114-255 255-255h510c141 0 255 114 255 255S908 767 767 767H257C116 767 2 653 2 512z m765 208.8c115.5 0 208.8-93.2 208.8-208.8S882.5 303.2 767 303.2c-115.5 0-208.8 93.2-208.8 208.8S651.5 720.8 767 720.8z"
                fill="#1890FF"
                p-id="5377"
              ></path>
            </svg>
            <svg
              v-else
              @click="changeStatus(scope.row['status'], item, scope.row['id'])"
              t="1639375540306"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="5589"
              width="46"
              height="30"
            >
              <path
                d="M764.867148 249.793136 259.0735 249.793136c-143.070486 0-259.052011 115.984594-259.052011 259.052011 0 143.07151 115.982548 259.050987 259.052011 259.050987l505.793648 0c143.067416 0 259.050987-115.979478 259.050987-259.050987C1023.917112 365.778754 907.933541 249.793136 764.867148 249.793136zM259.0735 745.516428c-130.501216 0-236.671281-106.172111-236.671281-236.671281 0-130.501216 106.170065-236.671281 236.671281-236.671281S495.744781 378.344954 495.744781 508.84617C495.744781 639.34534 389.574716 745.516428 259.0735 745.516428z"
                p-id="5590"
                fill="#999999"
              ></path>
            </svg>
          </span>

          <el-tooltip
            v-else
            :content="
              scope.row[item.prop] === null ||
              scope.row[item.prop] === '' ||
              scope.row[item.prop] === undefined
                ? '/'
                : String(scope.row[item.prop])
            "
            effect="dark"
            placement="top"
          >
            <span :class="{ tips: !safari }">{{
              scope.row[item.prop] === null ||
              scope.row[item.prop] === "" ||
              scope.row[item.prop] === undefined
                ? "/"
                : String(scope.row[item.prop])
            }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tableObj['isplay']"
        fixed="right"
        label="操作"
        :width="`${tableObj['PlayBtn'].length * 80}px`"
      >
        <template slot-scope="scope" class="df_sa">
          <span v-for="(s, b) in tableObj['PlayBtn']" :key="b">
            <el-button
              v-if="
                filterPermissionsBtn(permissions, s.btn)
                  ? showbtn(scope.row['status'], s.name)
                  : fale
              "
              style="padding: 0 5px"
              @click.native.prevent="PlayCurrentItem(s.name, scope, scope.row)"
              type="text"
              size="small"
            >
              <i :class="iconData[s.name]"></i>
              {{ s.name }}
            </el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { tableObj } from "@/const/tabledata/index";
import { filterPermissionsBtn } from "@/util/filter.js";
export default {
  name: "UniUiTablebox",
  props: {
    tableObj: Object,
    tableData: Array,
    tagsdata: Array,
  },
  data() {
    return {
      tablestyle: tableObj,
      iconData: {
        查看: "el-icon-view",
        编辑: "el-icon-edit-outline",
        删除: "el-icon-delete",
        关闭: "el-icon-edit-outline",
        退回: "el-icon-edit-outline",
        认领: "el-icon-edit-outline",
        分配: "el-icon-edit-outline",
        转商机: "el-icon-edit-outline",
        设置标签: "el-icon-edit-outline",
        签约: "el-icon-edit-outline",
      },
      SelectionList: [],
      safari: false,
    };
  },
  created() {
    this.safari = this.isSafari();
    console.log("navigator.userAgent", this.isSafari());
  },
  mounted() {},
  computed: {
    ...mapGetters(["permissions"]),
  },
  methods: {
    filterPermissionsBtn(data, item) {
      if (item == "look") return true;
      return filterPermissionsBtn(data, item);
    },
    showbtn(status, item) {
      console.log("this.$route.path", this.$route.path);
      if (this.$route.path.indexOf("clue") !== -1) {
        if ((status == 10 || status == 15) && item !== "查看") {
          return false;
        } else {
          return true;
        }
      } else if (this.$route.path == "/opportunity/my/index") {
        if ((status == 10 || status == 15 || status == 6) && item !== "查看") {
          return false;
        } else {
          return true;
        }
      } else if (this.$route.path == "/opportunity/archives/index") {
        console.log(111, item);
        if (status == 15 || status == 6) {
          if (item !== "查看") {
            return false;
          } else {
            return true;
          }
        } else if (status == 10) {
          if (item == "查看" || item == "编辑") {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    handleSelectionChange(e) {
      let idarr = [];
      e.filter((item) => {
        idarr.push(item.id);
      });
      this.SelectionList = e;
      this.$emit("getSelectionClueId", idarr);
    },
    playBtn(item) {
      this.$emit("playBtn", item);
    },
    PlayCurrentItem(type, item, data) {
      this.$emit("playCurrentItem", type, item, data);
    },
    // status==5已关闭不允许选中操作
    checkSelectable(e) {
      if (e.status == 15 || e.status == 10) {
        return false;
      } else {
        return true;
      }
    },
    indexMethod(index) {
      return index + 1;
    },
    changeStatus(e, item, id) {
      console.log("e", e, item, id);
      this.$emit("changeStatus", e, item, id);
    },
    clear() {
      this.$refs.listTable.clearSelection();
    },
    rowclick(row, column, event) {
      console.log(row, column, event);
      let index = this.SelectionList.findIndex((item) => {
        // 判断已选数组中是否已存在该条数据
        return item.id == row.id;
      });
      if (index == -1) {
        // 如果未存在，设置已选状态，并在list中添加这条数据
        this.$refs.listTable.toggleRowSelection(row, true); //设置复选框为选中状态
        this.SelectionList.push(row);
      } else {
        // 如果已存在，设置未选状态，并在list中删除这条数据
        this.$refs.listTable.toggleRowSelection(row, false); //设置复选框为未选状态
        this.SelectionList.splice(index, 1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.tableStyle {
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  .tableTop {
    color: #2c88f5;
    margin-bottom: 10px;
  }
}

/deep/.el-table--mini,
.el-table--small,
.el-table__expand-icon {
  font-size: 14px;
}
</style>