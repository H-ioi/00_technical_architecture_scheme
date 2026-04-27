<template>
  <div>
    <div class="searchFromBox">
      <div class="df_sb searchFromBox_header">
        <div class="searchFromBox_header_titel">赛事管理</div>
      </div>
      <CourseForm @search="search" />
    </div>
    <div class="df_sb palyTableBox">
      <div>
        <el-button
          v-if="permissions['isaic_competition_add']"
          type="primary"
          size="medium"
          @click="$router.push('/academy/course/editcompetition?type=add')"
          >添加赛事</el-button
        >
        <!-- <el-button type="primary" size="medium">删除</el-button> -->
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
          v-if="tableBtn.length > 0"
          fixed="right"
          label="操作"
          :width="`${tableBtn.length * 60}px`"
        >
          <template slot-scope="scope">
            <div class="df_align_center table_textbtn">
              <span>
                <el-button
                  type="text"
                  size="small"
                  @click.stop="playTab('look', scope.row, scope)"
                >
                  查看
                </el-button>
              </span>
              <span v-if="permissions['isaic_competition_edit']">
                <el-button
                  :disabled="scope.row.release == 1"
                  type="text"
                  size="small"
                  @click.stop="playTab('edit', scope.row, scope)"
                >
                  编辑
                </el-button>
              </span>
              <span
                v-if="
                  permissions['isaic_competition_release'] &&
                    (scope.row.release == 2 || scope.row.release == 0)
                "
              >
                <el-button
                  type="text"
                  size="small"
                  @click.stop="playTab('up', scope.row, scope)"
                >
                  上架
                </el-button>
              </span>
              <span
                v-if="
                  permissions['isaic_competition_release'] &&
                    scope.row.release === 1
                "
              >
                <el-button
                  type="text"
                  size="small"
                  @click.stop="playTab('down', scope.row, scope)"
                >
                  下架
                </el-button>
              </span>
              <span v-if="permissions['isaic_competition_download_signup']">
                <el-button
                  type="text"
                  size="small"
                  @click.stop="playTab('download', scope.row, scope)"
                >
                  下载报名表
                </el-button>
              </span>
              <span v-if="permissions['isaic_competition_del']">
                <el-button
                  :disabled="scope.row.release == 1"
                  type="text"
                  size="small"
                  @click.stop="playTab('del', scope.row, scope)"
                >
                  删除
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
import moment from "moment";
import Table from "@/components/common/Table.vue";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import CourseForm from "./formlist/competitionform.vue";
import course from "@/const/academy/course.js";
import {
  getCompetitionPage,
  getCompetitionChild,
  getCompetitionDetail,
  addCompetition,
  putCompetition,
  downCompetition,
  upCompetition,
  delCompetition,
  downloadCompetitionSignup
} from "@/api/academy/competition.js";
import { download } from "@/util/download.js";
import { resetData } from "@/util/util.js";

export default {
  name: "ISA-SEARCH",
  components: {
    Pagination,
    PaginationInfo,
    Table,
    CourseForm
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
      tableTitle: course["courseTableTitle"],
      tableBtn: course["courseTableBtn"],
      tableData: [],
      selectionId: [],
      currenntItem: {},
      searchFrom: {}
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
      getCompetitionPage(data).then(res => {
        console.log("getCompetitionPage", res);
        if (res.data.success) {
          let { data, total, records, current } = res.data.data;
          this.paginationTotal = total;
          this.tableData = records;
          this.tableData.map(item => {
            item["releaseLabel"] = course["courseStatusObj"][item["release"]];
            item["price"] = item["price"] / 100;
            item["recommendLabel"] = item["recommend"] ? "是" : "否";
          });
        }
      });
    },
    playTab(type, row, scope) {
      switch (type) {
        case "look":
          this.$router.push(`/academy/course/coursedetail?type=3&id=${row.id}`);
          break;
        case "edit":
          this.$router.push(
            "/academy/course/editcompetition?type=edit&id=" + row.id
          );
          break;
        case "up":
          this.$confirm("确认上架吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              upCompetition(row["id"]).then(res => {
                if (res.data.success) {
                  this.getTabelData();
                  this.$message({
                    type: "success",
                    message: "上架成功"
                  });
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消"
              });
            });
          break;
        case "down":
          this.$confirm("确认下架吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              downCompetition(row["id"]).then(res => {
                if (res.data.success) {
                  this.getTabelData();
                  this.$message({
                    type: "success",
                    message: "下架成功"
                  });
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消"
              });
            });
          break;
        case "download":
          downloadCompetitionSignup(row["id"]).then(res => {
            this.$message({
              type: "success",
              message: "下载成功"
            });
            download(res.data, res.headers["content-disposition"]);
          });
          break;
        case "del":
          this.$confirm("确认删除吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              delCompetition(row["id"]).then(res => {
                if (res.data.success) {
                  this.getTabelData();
                  this.$message({
                    type: "success",
                    message: "删除成功"
                  });
                }
              });
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
