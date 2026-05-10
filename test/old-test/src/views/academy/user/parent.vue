<template>
  <div>
    <div class="searchFromBox">
      <div class="df_sb searchFromBox_header">
        <div class="searchFromBox_header_titel">家长列表</div>
      </div>
      <ParentForm @search="search" />
    </div>
    <div class="df_sb palyTableBox">
      <div>
        <el-button type="primary" size="medium" @click="exportParent"
          >导出</el-button
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
              <span>
                <el-button
                  :disabled="scope.row['isActive']"
                  type="text"
                  size="small"
                  @click.stop="playTab('enable', scope.row, scope)"
                >
                  启用
                </el-button>
              </span>
              <span>
                <el-button
                  :disabled="!scope.row['isActive']"
                  type="text"
                  size="small"
                  @click.stop="playTab('disable', scope.row, scope)"
                >
                  禁用
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
import ParentForm from "./formlist/parentform.vue";
import course from "@/const/academy/course.js";
import {
  getParentPage,
  getParentToggle,
  exportParent,
  getParentDetail
} from "@/api/academy/user.js";
import { download } from "@/util/download.js";

export default {
  name: "ISA-SEARCH",
  components: {
    Pagination,
    PaginationInfo,
    Table,
    ParentForm
  },
  data() {
    return {
      course: course,
      tablestyle: tablestyle,
      pagination: {
        size: 10,
        current: 1
      },
      paginationTotal: 100,
      tableTitle: course["parentTableTitle"],
      tableBtn: [
        {
          name: "查看",
          type: "look",
          icon: "",
          permissions: ""
        },
        {
          name: "启用",
          type: "enable",
          icon: "",
          permissions: ""
        },
        {
          name: "禁用",
          type: "disable",
          icon: "",
          permissions: ""
        }
      ],
      selectionId: [],
      tableData: [],
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
    ...mapGetters(["permissions", "currentstatus"])
  },
  methods: {
    getTabelData() {
      let data = {
        ...this.searchFrom,
        ...this.pagination
      };
      getParentPage(data).then(res => {
        console.log("getParentPage", res);
        if (res.data.success) {
          let { data, total } = res.data.data;
          this.paginationTotal = total;
          this.tableData = data;
          this.tableData.map(item => {
            item["payingSum"] = item["payingSum"] / 100;
            item["isActiveLabel"] = item["isActive"] ? "是" : "否";
          });
        }
      });
    },
    exportParent() {
      exportParent(this.searchFrom).then(res => {
        this.$message.success("成功");
        download(res.data, res.headers["content-disposition"]);
      });
    },
    playTab(type, row, scope) {
      switch (type) {
        case "look":
          this.$router.push("/academy/user/parentdetail?id=" + row["id"]);
          break;
        case "enable":
          this.$confirm("确认启用吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              getParentToggle(row["id"]).then(res => {
                if (res.data.success) {
                  this.getTabelData();
                  this.$message({
                    type: "success",
                    message: "已启用"
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
        case "disable":
          this.$confirm("确认禁用吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              getParentToggle(row["id"]).then(res => {
                if (res.data.success) {
                  this.getTabelData();
                  this.$message({
                    type: "success",
                    message: "已禁用"
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
    setDate(date, timeStr) {
      return !date ? "--" : moment(date).format(timeStr);
    },
    resetTabelData(data) {
      return data != 0 && (data === null || data === "" || data === undefined)
        ? "--"
        : String(data);
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
