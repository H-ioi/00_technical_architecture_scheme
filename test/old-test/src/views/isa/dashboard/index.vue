<template>
  <div class="isa_center_page">
    <div class="searchFromBox">
      <div class="df_sb searchFromBox_header">
        <div class="searchFromBox_header_titel">
          {{ $t("isagroup.统计报表") }}
        </div>
        <div>
          <el-select
            v-model="dimension"
            :placeholder="$t('isagroup.选择维度')"
            @change="changeTable"
          >
            <el-option
              v-for="item in DashBoard['dimensionList']"
              :key="item.value"
              :label="i18nlocel == 'zh' ? item.label : item.enLabel"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <el-form
        class="df_align_center"
        :label-position="'top'"
        :inline="true"
        :model="searchFrom"
      >
        <el-form-item style="width: 15%">
          <el-select
            v-model="searchFrom['schoolId']"
            clearable
            filterable
            :placeholder="$t('isagroup.选择学校')"
            @change="changeSchool"
          >
            <el-option
              :key="k"
              v-for="(i, k) in schoolList"
              :label="i.enName"
              :value="i.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 15%" v-if="dimension == '2'">
          <el-date-picker
            style="width: 100%;"
            value-format="yyyy"
            v-model="searchFrom['selectYear']"
            type="year"
            :placeholder="$t('isagroup.选择年份')"
            clearable
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item style="width: 15%" v-if="divisionNameList.length > 0">
          <el-select
            v-model="searchFrom['divisionName']"
            clearable
            filterable
            :placeholder="$t('isagroup.选择方向/学部')"
          >
            <el-option
              :key="k"
              v-for="(i, k) in divisionNameList"
              :label="i"
              :value="i"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          style="width: 15%"
          v-if="dimension != '1' && dimension != '2' && dimension != ''"
        >
          <el-select
            v-model="searchFrom['gender']"
            clearable
            filterable
            :placeholder="$t('isagroup.选择性别')"
          >
            <el-option
              :key="k"
              v-for="(item, k) in DashBoard['genderList']"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: auto; margin-right: 0">
          <el-button
            class="el-button-icon"
            type="primary"
            size="large"
            icon="el-icon-search"
            @click="search"
          ></el-button>
          <el-button
            class="el-button-icon"
            type="defult"
            size="large"
            icon="el-icon-delete"
            @click="clear"
          ></el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="df_sb palyTableBox">
      <div>
        <el-button
          v-if="tableData.length > 0"
          type="primary"
          size="medium"
          @click="downFile"
          :loading="loading"
          >{{ $t("btn.导出") }}</el-button
        >
      </div>
      <!-- <PaginationInfo :paginationTotal="paginationTotal" /> -->
    </div>
    <div class="tableBox">
      <el-table
        style="width: 100%"
        :header-cell-style="tablestyle['headercellstyle']"
        :cell-style="tablestyle['rowstyle']"
        :row-class-name="tableRowClassName"
        :data="tableData"
        @row-click="rowClick"
        max-height="500"
      >
        <el-table-column
          v-for="(item, index) in tableTitle"
          :key="index"
          :prop="item['prop']"
          :label="
            item['hasEn']
              ? $t('isagroup')[item['label']]
              : i18nlocel == 'zh'
              ? item['label']
              : item['enLabel']
          "
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
    <!-- 详情弹窗 -->
    <el-dialog
      :title="$t('isagroup.详情')"
      :visible.sync="showDialog"
      width="80%"
      :before-close="() => (showDialog = false)"
    >
      <div class="tabledata">
        <div
          class="dataitem"
          style="width:30%"
          v-for="(item, index) in tableTitle"
          :key="index"
        >
          <div class="dataitem_label">
            {{
              item["hasEn"]
                ? $t("isagroup")[item["label"]]
                : i18nlocel == "zh"
                ? item["label"]
                : item["enLabel"]
            }}
          </div>
          <div class="dataitem_value">
            {{
              currenntItem[item["prop"]]
                ? currenntItem[item["prop"]]
                : currenntItem[item["prop"]] === 0
                ? 0
                : "--"
            }}
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getStudentCountryCounts,
  getStudentCurrentCounts,
  getStudentDorCounts,
  getStudentEntryYearCounts,
  getStudentGenderCounts,
  stuCountryCountsExport,
  stuCurrentCountsExport,
  stuDorCountsExport,
  stuEntryYearCountsExport,
  stuGenderCountsExport,
  getDivisionNameList
} from "@/api/isa/dashboard.js";
import { getSchoolList } from "@/api/isa/index.js";
import { tablestyle } from "@/const/tabledata/index";
import { download } from "@/util/download.js";
import DashBoard from "./const";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import Table from "@/components/common/Table.vue";

export default {
  name: "maskingRules",
  components: {
    Pagination,
    PaginationInfo,
    Table
  },
  data() {
    return {
      tablestyle: tablestyle,
      DashBoard: DashBoard,
      pagination: {
        size: 10,
        current: 1
      },
      paginationTotal: 0,
      searchFrom: {
        schoolId: "",
        selectYear: "",
        divisionName: "",
        gender: ""
      },
      dimension: "",
      tableData: [],
      tableTitle: [],
      schoolList: [],
      divisionNameList: [],
      loading: false,
      showDialog: false,
      currenntItem: {}
    };
  },
  created() {
    this.getPageList();
    this.getSelectList();
  },
  mounted() {},
  activated() {
    this.getPageList();
    this.getSelectList();
  },
  computed: {
    ...mapGetters(["permissions", "i18nlocel"])
  },
  methods: {
    getSelectList() {
      getSchoolList().then(res => {
        console.log("res", res);
        if (res.data.success) {
          this.schoolList = res.data.data;
        }
      });
    },
    getDivisionNameList(schoolId) {
      getDivisionNameList({ schoolId }).then(res => {
        console.log("res", res);
        if (res.data.success) {
          this.divisionNameList = res.data.data;
        }
      });
    },
    getPageList() {
      let query = {};
      Object.keys(this.searchFrom).forEach(item => {
        if (
          this.searchFrom[item] != "" &&
          this.searchFrom[item] != undefined &&
          this.searchFrom[item] != null
        ) {
          query[item] = this.searchFrom[item];
        }
      });
      switch (this.dimension) {
        // 在读学生国籍分布
        case "1":
          getStudentCountryCounts(query).then(res => {
            if (res.data.success) {
              console.log("getStudentCountryCounts", res);
              this.tableTitle = this.DashBoard["nationalityTable"];
              let yearList = [];
              let yearCounts = {};
              let data = res.data.data;
              if (data[0]["yearCounts"]) {
                yearCounts = data[0]["yearCounts"];
              }

              data.map(item => {
                if (item["yearCounts"]) {
                  Object.keys(item["yearCounts"]).forEach(year => {
                    item[year] = item["yearCounts"][year];
                  });
                  console.log(333333, item);
                }
              });
              Object.keys(yearCounts).forEach(year => {
                yearList.push({
                  label: year + "年",
                  enLabel: year,
                  prop: year,
                  width: "",
                  fixed: "",
                  hasEn: false
                });
              });
              this.tableTitle = [
                ...this.DashBoard["nationalityTable"],
                ...yearList.reverse()
              ];
              this.tableData = data;
              console.log("   this.tableData ", this.tableData);
            }
          });
          break;
        //   每年入读学生数量
        case "2":
          getStudentEntryYearCounts(query).then(res => {
            if (res.data.success) {
              this.tableTitle = this.DashBoard["enrolledTable"];
              let { data } = res;
              this.tableData = data.data;
              console.log("getStudentEntryYearCounts", res);
            }
          });
          break;
        //   当前学年住宿学生年级数量
        case "3":
          getStudentDorCounts(query).then(res => {
            if (res.data.success) {
              console.log("getStudentDorCounts", data);
              this.tableTitle = this.DashBoard["stayTable"];
              let { data } = res;
              this.tableData = data.data;
              //   this.paginationTotal = total;
            }
          });
          break;
        //   在读学生当前学年各年级学生数量
        case "4":
          getStudentCurrentCounts(query).then(res => {
            if (res.data.success) {
              this.tableTitle = this.DashBoard["gradeTable"];
              let { data } = res;
              this.tableData = data.data;
              console.log("getStudentCurrentCounts", res);
            }
          });
          break;
        //   在读学生性别
        case "5":
          getStudentGenderCounts(query).then(res => {
            if (res.data.success) {
              console.log("getStudentGenderCounts", res);
              let yearList = [];
              let yearCounts = {};
              let data = res.data.data;
              if (data[0]["yearCounts"]) {
                yearCounts = data[0]["yearCounts"];
              }

              data.map(item => {
                if (item["yearCounts"]) {
                  Object.keys(item["yearCounts"]).forEach(year => {
                    item[year] = item["yearCounts"][year];
                  });
                  console.log(333333, item);
                }
              });
              Object.keys(yearCounts).forEach(year => {
                yearList.push({
                  label: year,
                  prop: year,
                  width: "",
                  fixed: ""
                });
              });
              this.tableTitle = [
                ...this.DashBoard["genderTable"],
                ...yearList.reverse()
              ];
              this.tableData = data;
              console.log("   this.tableData ", this.tableData);
            }
          });
          break;
      }
    },
    downFile() {
      this.loading = true;
      let query = {};
      Object.keys(this.searchFrom).forEach(item => {
        if (
          this.searchFrom[item] != "" &&
          this.searchFrom[item] != undefined &&
          this.searchFrom[item] != null
        ) {
          query[item] = this.searchFrom[item];
        }
      });
      switch (this.dimension) {
        // 在读学生国籍分布
        case "1":
          stuCountryCountsExport(query).then(res => {
            try {
              this.loading = false;
              this.$message.success(this.$t("isagroup.成功"));
              download(res.data, res.headers["content-disposition"]);
            } catch (error) {
              this.loading = false;
            }
          });
          break;
        //   每年入读学生数量
        case "2":
          stuEntryYearCountsExport(query).then(res => {
            try {
              this.loading = false;
              this.$message.success(this.$t("isagroup.成功"));
              download(res.data, res.headers["content-disposition"]);
            } catch (error) {
              this.loading = false;
            }
          });
          break;
        //   当前学年住宿学生年级数量
        case "3":
          stuDorCountsExport(query).then(res => {
            try {
              this.loading = false;
              this.$message.success(this.$t("isagroup.成功"));
              download(res.data, res.headers["content-disposition"]);
            } catch (error) {
              this.loading = false;
            }
          });
          break;
        //   在读学生当前学年各年级学生数量
        case "4":
          stuCurrentCountsExport(query).then(res => {
            console.log("stuCurrentCountsExport", res);
            try {
              this.loading = false;
              this.$message.success(this.$t("isagroup.成功"));
              download(res.data, res.headers["content-disposition"]);
            } catch (error) {
              this.loading = false;
            }
          });
          break;
        //   在读学生性别
        case "5":
          stuGenderCountsExport(query).then(res => {
            try {
              this.loading = false;
              this.$message.success(this.$t("isagroup.成功"));
              download(res.data, res.headers["content-disposition"]);
            } catch (error) {
              this.loading = false;
            }
          });
          break;
      }
    },
    changeSchool(e) {
      this.divisionNameList = [];
      this.searchFrom["divisionName"] = "";
      this.getDivisionNameList(e);
    },
    changeTable(e) {
      console.log("changeTable", e);
      this.clear();
    },
    rowClick(row, column, event) {
      if (this.dimension != "3") return;
      console.log("rowClick", row);
      this.currenntItem = row;
      this.showDialog = true;
    },
    playTab(name, item, scope) {
      switch (name) {
        case "look":
          this.showDialog = true;
          break;
      }
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getPageList();
    },
    // 搜索
    search() {
      this.pagination["current"] = 1;
      this.getPageList();
    },
    clear() {
      this.divisionNameList = [];
      this.searchFrom = {
        schoolId: "",
        selectYear: "",
        divisionName: "",
        gender: ""
      };
      // this.pagination["current"] = 1;
      this.getPageList();
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 > 0 ? "shinning" : "";
    },
    resetTabelData(data) {
      return data === null || data === "" || data === undefined
        ? "--"
        : String(data);
    }
  }
};
</script>

<style lang="scss" scoped></style>
