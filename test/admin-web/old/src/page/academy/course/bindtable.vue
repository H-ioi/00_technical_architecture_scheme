<template>
  <div class="bindtable">
    <div class="bindtable_btn">
      <el-button type="primary" size="medium" @click="openModal">{{
        bindCourse[bindCourseType]
      }}</el-button>
    </div>
    <div class="tableBox">
      <el-table
        style="width: 100%"
        :header-cell-style="tablestyle['headercellstyle']"
        :cell-style="tablestyle['rowstyle']"
        :row-class-name="tableRowClassName"
        :data="bindTableData"
        @row-click="rowClick"
      >
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
      </el-table>
      <!-- <Pagination
        :total="paginationTotal"
        :pagination="pagination"
        @handleCurrentChange="handleCurrentChange"
      /> -->
    </div>
    <el-dialog
      :title="bindCourse[bindCourseType]"
      :visible.sync="showDialog"
      width="90%"
      :before-close="closeModal"
    >
      <div class="tableBox" style="max-height: 600px;overflow: auto;">
        <!-- <el-input
          @change="changeSearch"
          @blur="changeSearch"
          style="width: 320px;margin-bottom: 20px;"
          v-model="search"
          size="mini"
          placeholder="输入关键字搜索"
        /> -->
        <el-table
          ref="Table"
          style="width: 100%"
          :header-cell-style="tablestyle['headercellstyle']"
          :cell-style="tablestyle['rowstyle']"
          :row-class-name="tableRowClassName"
          :data="tableData"
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
        </el-table>
        <Pagination
          :total="paginationTotal"
          :pagination="pagination"
          @handleCurrentChange="handleCurrentChange"
        />
      </div>
      <div class="moadlFromBox">
        <div class="modalFromBtn df_center">
          <el-button type="primary" size="medium" @click="bindCourseConfirm"
            >保存</el-button
          >
          <el-button type="default" size="medium" @click="closeModal"
            >取消</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { tablestyle } from "@/const/tabledata/index";
import moment from "moment";
import Table from "@/components/common/Table.vue";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import course from "@/const/academy/course.js";
import { resetData } from "@/util/util.js";
import { getCourseChild, getAllCourse } from "@/api/academy/course.js";
import { getActivityChild, getAllActivity } from "@/api/academy/activity.js";
import {
  getCompetitionChild,
  getAllCompetition
} from "@/api/academy/competition.js";
import { download } from "@/util/download.js";

export default {
  name: "ISA-SEARCH",
  components: {
    Pagination,
    PaginationInfo,
    Table
  },
  props: {
    bindCourseType: {
      type: Number,
      default: 1
    },
    courseType: {
      type: String,
      require: true
    },
    type: {
      type: String,
      default: "add"
    },
    ignoreId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      search: "",
      showDialog: false,
      bindCourse: {
        1: "绑定课程",
        2: "绑定活动",
        3: "绑定赛事"
      },
      course: course,
      tablestyle: tablestyle,
      pagination: {
        size: 10,
        current: 1
      },
      paginationTotal: 100,
      tableTitle: course["courseBindTableTitle"],
      tableBtn: course["courseTableBtn"],
      bindSelectionId: [],
      bindTableData: [],
      tableData: [],
      tableDataAll: [],
      selectionId: [],
      currenntItem: {},
      searchFrom: {}
    };
  },
  created() {},

  mounted() {},
  activated() {},
  computed: {
    ...mapGetters(["permissions", "currentstatus"])
  },
  methods: {
    initData(data) {
      console.log("initData", data);
      this.bindTableData = data;
      this.bindSelectionId = this.bindTableData.map(item => {
        return item.id;
      });
      this.selectionId = this.bindSelectionId;
      this.bindTableData.map(item => {
        item["releaseLabel"] = course["courseStatusObj"][item["release"]];
        item["price"] = item["price"] / 100;
      });
    },
    toggleSelection() {
      let data = this.tableDataAll.filter(item => {
        return this.selectionId.includes(item["id"]);
      });
      data.forEach(item => {
        // checkedData为已选数据
        this.$nextTick(() => {
          this.tableData.find(obj => {
            // userData 表单数据
            if (item.id === obj.id) {
              this.$refs.Table.toggleRowSelection(obj, true);
            }
          });
        });
      });
    },
    getTabelData() {
      switch (this.bindCourseType) {
        case 1:
          if (this.courseType == "club") {
            getAllCourse().then(res => {
              if (res.data.success) {
                this.resetData(res);
                this.toggleSelection();
              }
            });
          } else {
            getCourseChild(
              this.courseType == "course" ? this.ignoreId : ""
            ).then(res => {
              if (res.data.success) {
                this.resetData(res);
                this.toggleSelection();
              }
            });
          }

          break;
        case 2:
          if (this.courseType == "club") {
            getAllActivity().then(res => {
              if (res.data.success) {
                this.resetData(res);
                this.toggleSelection();
              }
            });
          } else {
            getActivityChild(
              this.courseType == "activity" ? this.ignoreId : ""
            ).then(res => {
              if (res.data.success) {
                this.resetData(res);
                this.toggleSelection();
              }
            });
          }

          break;
        case 3:
          if (this.courseType == "club") {
            getAllCompetition().then(res => {
              if (res.data.success) {
                this.resetData(res);
                this.toggleSelection();
              }
            });
          } else {
            getCompetitionChild(
              this.courseType == "competition" ? this.ignoreId : ""
            ).then(res => {
              if (res.data.success) {
                this.resetData(res);
                this.toggleSelection();
              }
            });
          }

          break;
      }
    },
    resetData(res) {
      this.paginationTotal = res.data.data.length;
      this.tableDataAll = res.data.data;

      this.tableDataAll.map(item => {
        item["releaseLabel"] = course["courseStatusObj"][item["release"]];
        item["price"] = item["price"] / 100;
      });
      this.tableData = this.tableDataAll;
    },
    bindCourseConfirm() {
      console.log('this.selectionId',this.selectionId);
      this.bindTableData = this.tableDataAll.filter(item => {
        return this.selectionId.includes(item["id"]);
      });
      this.bindSelectionId = this.bindTableData.map(item => {
        return item.id;
      });
      this.showDialog = false;
      console.log("bindCourse", this.bindTableData, this.bindSelectionId);
    },
    changeSearch() {
      console.log(" this.search", this.search, !this.search);
      if (!this.search) {
        this.tableData = this.tableDataAll;
      } else {
        this.tableData = this.tableDataAll.filter(data => {
          return (
            data.nameCn.indexOf(this.search) != -1 ||
            data.nameEn.indexOf(this.search) != -1
          );
        });
      }
      this.$nextTick(() => {
        this.toggleSelection();
      });
    },
    rowClick(row, column, event) {
      console.log("rowClick", row, column, event);
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
    },
    // 搜索
    search(data) {
      this.searchFrom = data;
      this.pagination["current"] = 1;
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
      console.log('handleSelectionChange',arr);
      this.selectionId = [];
      arr.map(i => {
        this.selectionId.push(i.id);
      });
    },
    openModal() {
      this.showDialog = true;
      this.getTabelData();
    },
    closeModal() {
      this.showDialog = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.bindtable {
  width: 100%;
  text-align: right;
  .tableBox {
    padding: 20px 0;
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
