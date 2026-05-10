<template>
  <div>
    <div class="searchFromBox">
      <div class="df_sb searchFromBox_header">
        <div class="searchFromBox_header_titel">数据检索</div>
        <el-select
          v-model="currentType"
          filterable
          placeholder="请选择需要查询的表"
          @change="changeCurrentType"
        >
          <el-option
            :key="k"
            v-for="(i, k) in typeList"
            :label="i.label"
            :value="i.value"
          ></el-option>
        </el-select>
      </div>
      <TeacherForm
        v-if="currentType == 1"
        @search="search"
        @clear="clear"
        :yeargroupList="yeargroupList"
        :schoolList="schoolList"
        :formList="formList"
      />
      <StudentForm
        v-if="currentType == 2"
        @search="search"
        @clear="clear"
        :yeargroupList="yeargroupList"
        :schoolList="schoolList"
        :formList="formList"
      />
      <ParentForm
        v-if="currentType == 3"
        @search="search"
        @clear="clear"
        :yeargroupList="yeargroupList"
        :schoolList="schoolList"
        :formList="formList"
      />
      <MedicationForm
        v-if="currentType == 4"
        @search="search"
        @clear="clear"
        :yeargroupList="yeargroupList"
        :schoolList="schoolList"
        :formList="formList"
      />
      <DinningForm
        v-if="currentType == 5"
        @search="search"
        @clear="clear"
        :yeargroupList="yeargroupList"
        :schoolList="schoolList"
        :formList="formList"
      />
      <MedicalBasicForm
        v-if="currentType == 6"
        @search="search"
        @clear="clear"
        :yeargroupList="yeargroupList"
        :schoolList="schoolList"
        :formList="formList"
      />
      <MedicalContactForm
        v-if="currentType == 7"
        @search="search"
        @clear="clear"
        :yeargroupList="yeargroupList"
        :schoolList="schoolList"
        :formList="formList"
      />
      <StayForm
        v-if="currentType == 8"
        @search="search"
        @clear="clear"
        :yeargroupList="yeargroupList"
        :schoolList="schoolList"
        :formList="formList"
      />
    </div>
    <div class="df_sb palyTableBox" v-if="tableData.length > 0">
      <div>
        <el-button
          v-if="isShowExport"
          type="primary"
          size="medium"
          @click="exportData"
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
            <el-image
              v-if="
                (item['prop'] == 'signature' || item['prop'] == 'image') &&
                  scope.row[item['prop']] != null &&
                  scope.row[item['prop']] != ''
              "
              style="width: 40px; height: 40px"
              :src="scope.row[item['prop']]"
              :preview-src-list="[scope.row[item['prop']]]"
            >
            </el-image>
            <span
              class="tableRow"
              v-else
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
    <el-dialog
      title="查看详情"
      :visible.sync="showDialog"
      width="1000px"
      :before-close="() => (showDialog = false)"
    >
      <div class="tabledata">
        <div
          class="dataitem"
          :style="`width:${propList.includes(item['prop']) ? '100%' : '30%'}`"
          v-for="(item, index) in dialogData"
          :key="index"
        >
          <div class="dataitem_label">{{ item["label"] }}</div>
          <div
            class="dataitem_value"
            v-if="
              (item['prop'] == 'signature' ||
                item['prop'] == 'image' ||
                item['prop'] == 'profilePhoto') &&
                currenntItem[item['prop']] != null &&
                currenntItem[item['prop']] != ''
            "
          >
            <el-image
              style="width: 80px; height: 80px"
              :src="currenntItem[item['prop']]"
              :preview-src-list="[currenntItem[item['prop']]]"
            >
            </el-image>
          </div>
          <div class="dataitem_value" v-else>
            {{ currenntItem[item["prop"]] ? currenntItem[item["prop"]] : "--" }}
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="查看教师详情"
      :visible.sync="showTeacherDialog"
      width="1000px"
      :before-close="() => (showTeacherDialog = false)"
    >
      <div class="teacherCouseInfo_box">
        <div v-for="(item, index) in teacherTableData" :key="index">
          <div class="teacherCouseInfo">
            <div
              class="teacherCouseInfo_item"
              v-for="info in isaData['teacherCouseInfo']"
              :key="info['prop']"
            >
              <div>{{ info["label"] }}：</div>
              <div>{{ item[info["prop"]] }}</div>
            </div>
          </div>
          <el-table
            style="width: 100%;margin-bottom: 30px;"
            :header-cell-style="tablestyle['headercellstyle']"
            :cell-style="tablestyle['rowstyle']"
            :row-class-name="tableRowClassName"
            :data="item['commonTeachersStudentDTOList']"
          >
            <el-table-column
              v-for="column in isaData['teacherDialogTableTitle']"
              :key="column['prop']"
              :prop="column['prop']"
              :label="column['label']"
            >
            </el-table-column>
          </el-table>
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
import StudentForm from "./formlist/studentform.vue";
import TeacherForm from "./formlist/teacherform.vue";
import ParentForm from "./formlist/parentform.vue";
import MedicationForm from "./formlist/medicationform.vue";
import DinningForm from "./formlist/dinningform.vue";
import MedicalBasicForm from "./formlist/medicalbasicform.vue";
import MedicalContactForm from "./formlist/medicalcontactform.vue";
import StayForm from "./formlist/stayform.vue";
import {
  getYeargroupList,
  getSchoolList,
  getFormList,
  getTeacherPage,
  getStudentPage,
  getParentPage,
  getStuApply4MedicationPage,
  getStuDinningInfoPage,
  getStuMedicalBasicInfoPage,
  getStuMedicalContactPage,
  getStuStayPage,
  getTeacherDetail,
  parentExport,
  studentExport,
  teacherExport,
  stuApply4MedicationExport,
  stuDinningInfoExport,
  stuMedicalBasicInfoExport,
  stuMedicalContactExport,
  stuStayExport
} from "@/api/isa/index.js";
import { download } from "@/util/download.js";
import isaData from "./const";

export default {
  name: "ISA-SEARCH",
  components: {
    Pagination,
    PaginationInfo,
    Table,
    StudentForm,
    TeacherForm,
    ParentForm,
    MedicationForm,
    DinningForm,
    MedicalBasicForm,
    MedicalContactForm,
    StayForm
  },
  data() {
    return {
      propList: ["allergyReaction", "healthAllergiesDescription"],
      tablestyle: tablestyle,
      isaData: isaData,
      pagination: {
        size: 10,
        current: 1
      },
      paginationTotal: 0,
      showDialog: false,
      showTeacherDialog: false,
      yeargroupList: [],
      schoolList: [],
      formList: [],
      dialogData: [],
      tableTitle: [],
      tableBtn: [],
      tableData: [],
      currenntItem: {},
      searchFrom: {},
      typeList: [],
      currentType: 0,
      isShowExport: false,
      teacherTableData: []
    };
  },
  created() {
    this.initTypeList();
    this.getSelectList();
  },

  mounted() {},
  activated() {
    this.getTabelData();
  },
  computed: {
    ...mapGetters(["permissions", "currentstatus"])
  },
  methods: {
    initTypeList() {
      this.typeList = isaData["typeList"].filter(item => {
        return this.permissions[item["permissions"]];
      });
      console.log("this.typeList", this.typeList);
      if (this.typeList.length > 0) {
        this.currentType = this.typeList[0]["value"];
        this.getTabelData();
        this.getTableTitle();
        this.showExport();
      }
    },
    getTableTitle() {
      switch (this.currentType) {
        case 1:
          this.tableTitle = isaData["teacherTableTitle"];
          break;
        case 2:
          this.tableTitle = isaData["studentTableTitle"];
          break;
        case 3:
          this.tableTitle = isaData["parentTableTitle"];
          break;
        case 4:
          this.tableTitle = isaData["stuApply4MedicationTitle"];
          break;
        case 5:
          this.tableTitle = isaData["stuDinningInfoTitle"];
          break;
        case 6:
          this.tableTitle = isaData["stuMedicalBasicInfoTitle"];
          break;
        case 7:
          this.tableTitle = isaData["stuMedicalContactTitle"];
          break;
        case 8:
          this.tableTitle = isaData["stuStayTitle"];
          break;
      }
    },
    // 导出权限
    showExport() {
      switch (this.currentType) {
        case 1:
          this.isShowExport = this.permissions["master_data_teacher_download"];
          break;
        case 2:
          this.isShowExport = this.permissions["master_data_student_download"];
          break;
        case 3:
          this.isShowExport = this.permissions["master_data_parent_download"];
          break;
        case 4:
          this.isShowExport = this.permissions[
            "service_data_stu_apply4medication_download"
          ];
          break;
        case 5:
          this.isShowExport = this.permissions[
            "service_data_stu_dining_info_download"
          ];
          break;
        case 6:
          this.isShowExport = this.permissions[
            "service_data_stu_medical_basic_info_download"
          ];
          break;
        case 7:
          this.isShowExport = this.permissions[
            "service_data_stu_medical_contact_download"
          ];
          break;
        case 8:
          this.isShowExport = this.permissions[
            "service_data_stu_stay_download"
          ];
          break;
      }
    },
    getSelectList() {
      getYeargroupList().then(res => {
        console.log("res", res);
        if (res.data.success) {
          this.yeargroupList = res.data.data;
        }
      });
      getSchoolList().then(res => {
        console.log("res", res);
        if (res.data.success) {
          this.schoolList = res.data.data;
        }
      });
      getFormList().then(res => {
        console.log("res", res);
        if (res.data.success) {
          this.formList = res.data.data;
        }
      });
    },
    getTabelData() {
      let params = {};
      let data = _.cloneDeep({
        ...this.pagination,
        ...this.searchFrom
      });
      Object.keys(data).forEach(res => {
        if (data[res] != "" && data[res] != null && data[res] != undefined) {
          params[res] = data[res];
        }
      });

      switch (this.currentType) {
        case 1:
          getTeacherPage(params).then(res => {
            console.log("getTeacherPage", res);
            if (res.data.success) {
              this.tableData = [];
              let { data, total, current } = res.data.data;
              this.getTableTitle();
              this.tableData = data;
              this.paginationTotal = total;
            }
          });
          break;
        case 2:
          getStudentPage(params).then(res => {
            console.log("res", res);
            if (res.data.success) {
              this.tableData = [];
              let { data, total, current } = res.data.data;
              this.getTableTitle();
              this.paginationTotal = total;
              this.tableData = data;
              this.tableData.map(item => {
                item["birthday"] = this.setDate(item["birthday"], "YYYY-MM-DD");
                item["appliedDate"] = this.setDate(
                  item["appliedDate"],
                  "YYYY-MM-DD"
                );
                item["enrolmentDate"] = this.setDate(
                  item["enrolmentDate"],
                  "YYYY-MM-DD"
                );
                item["dateOfLeaving"] = this.setDate(
                  item["dateOfLeaving"],
                  "YYYY-MM-DD"
                );
                item["studentStatus"] =
                  isaData["studentStatusObj"][item["studentStatus"]];
              });
            }
          });
          break;
        case 3:
          getParentPage(params).then(res => {
            console.log("res", res);
            if (res.data.success) {
              this.tableData = [];
              let { data, total, current } = res.data.data;
              this.getTableTitle();
              this.tableData = data;
              this.paginationTotal = total;
              this.tableData.map(item => {
                item["isContactParental"] = item["isContactParental"]
                  ? "是"
                  : "否";
                item["studentStatus"] =
                  isaData["studentStatusObj"][item["studentStatus"]];
              });
            }
          });
          break;
        case 4:
          getStuApply4MedicationPage(params).then(res => {
            console.log("res", res);
            if (res.data.success) {
              this.tableData = [];
              let { data, total, current } = res.data.data;
              this.getTableTitle();
              this.paginationTotal = total;
              this.tableData = data;
              this.tableData.map(item => {
                item["createTime"] = this.setDate(
                  item["createTime"],
                  "YYYY-MM-DD hh:mm"
                );
              });
            }
          });
          break;
        case 5:
          getStuDinningInfoPage(params).then(res => {
            console.log("res", res);
            if (res.data.success) {
              this.tableData = [];
              let { data, total, current } = res.data.data;
              this.getTableTitle();
              this.tableData = data;
              this.paginationTotal = total;
            }
          });
          break;
        case 6:
          getStuMedicalBasicInfoPage(params).then(res => {
            console.log("res", res);
            if (res.data.success) {
              this.tableData = [];
              let { data, total, current } = res.data.data;
              this.getTableTitle();
              this.tableData = data;
              this.paginationTotal = total;
            }
          });
          break;
        case 7:
          getStuMedicalContactPage(params).then(res => {
            console.log("res", res);
            if (res.data.success) {
              this.tableData = [];
              let { data, total, current } = res.data.data;
              this.getTableTitle();
              this.tableData = data;
              this.paginationTotal = total;
            }
          });
          break;
        case 8:
          getStuStayPage(params).then(res => {
            console.log("res", res);
            if (res.data.success) {
              this.tableData = [];
              let { data, total, current } = res.data.data;
              this.getTableTitle();
              this.tableData = data;
              this.paginationTotal = total;
            }
          });
          break;
      }
    },
    // 导出数据
    exportData: _.throttle(function() {
      this.downFile();
    }, 1000),
    downFile() {
      console.log(333333);
      let data = {
        ...this.searchFrom
      };
      switch (this.currentType) {
        case 1:
          teacherExport(data).then(res => {
            this.$message.success("成功");
            download(res.data, res.headers["content-disposition"]);
          });
          break;
        case 2:
          studentExport(data).then(res => {
            this.$message.success("成功");
            download(res.data, res.headers["content-disposition"]);
          });
          break;
        case 3:
          parentExport(data).then(res => {
            this.$message.success("成功");
            download(res.data, res.headers["content-disposition"]);
          });
          break;
        case 4:
          stuApply4MedicationExport(data).then(res => {
            this.$message.success("成功");
            download(res.data, res.headers["content-disposition"]);
          });
          break;
        case 5:
          stuDinningInfoExport(data).then(res => {
            this.$message.success("成功");
            download(res.data, res.headers["content-disposition"]);
          });
          break;
        case 6:
          stuMedicalBasicInfoExport(data).then(res => {
            this.$message.success("成功");
            download(res.data, res.headers["content-disposition"]);
          });
          break;
        case 7:
          stuMedicalContactExport(data).then(res => {
            this.$message.success("成功");
            download(res.data, res.headers["content-disposition"]);
          });
          break;
        case 8:
          stuStayExport(data).then(res => {
            this.$message.success("成功");
            download(res.data, res.headers["content-disposition"]);
          });
          break;
      }
    },
    changeCurrentType(e) {
      this.pagination["current"] = 1;
      this.searchFrom = {};
      this.showExport();
      this.getTabelData();
    },
    rowClick(row, column, event) {
      console.log("rowClick", row, column, event);
      let { property } = column;
      if (property == "image" || property == "signature") return;
      this.dialogData = [];
      switch (this.currentType) {
        case 1:
          this.teacherTableData = [];
          getTeacherDetail(row.teacherIdInt).then(res => {
            console.log("getTeacherDetail", res);
            if (res.data.success) {
              this.teacherTableData = res.data.data;
              if (this.teacherTableData.length > 0) {
                this.teacherTableData.map(item => {
                  item["fullName"] = row["fullName"];
                });
                this.showTeacherDialog = true;
              } else {
                this.$message.warning("无关联数据");
              }
            }
          });
          // this.dialogData = this.tableTitle;
          // this.currenntItem = row;
          // this.showDialog = true;
          break;
        case 2:
          this.dialogData = isaData["studentTableData"];
          this.currenntItem = {
            ...this.currenntItem,
            ...row
          };
          this.currenntItem["profilePhoto"] = this.resetImgPath(
            row["profilePhoto"]
          );
          this.showDialog = true;
          break;
        case 3:
          this.dialogData = this.tableTitle;
          this.currenntItem = {
            ...this.currenntItem,
            ...row
          };
          this.showDialog = true;
          break;
        case 4:
          this.dialogData = this.tableTitle;
          this.currenntItem = {
            ...this.currenntItem,
            ...row
          };
          this.showDialog = true;
          break;
        case 5:
          this.dialogData = this.tableTitle;
          this.currenntItem = {
            ...this.currenntItem,
            ...row
          };
          this.showDialog = true;
          break;
        case 6:
          this.dialogData = this.tableTitle;
          this.currenntItem = {
            ...this.currenntItem,
            ...row
          };
          this.showDialog = true;
          break;
        case 7:
          this.dialogData = [
            ...this.tableTitle,
            ...isaData["stuMedicalContactOtherTitle"]
          ];
          this.currenntItem = {
            ...this.currenntItem,
            ...row
          };
          this.showDialog = true;
          break;
        case 8:
          this.dialogData = this.tableTitle;
          this.currenntItem = {
            ...this.currenntItem,
            ...row
          };
          this.showDialog = true;
          break;
      }
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
      switch (this.currentType) {
        case 1:
          this.teacherFrom = {
            keyword: ""
          };
          this.searchFrom = { ...this.teacherFrom };
          break;
        case 2:
          this.studentFrom = {
            yearGroupName: "",
            schoolIds: "",
            form: "",
            studentStatus: ""
          };
          this.searchFrom = { ...this.studentFrom };
          break;
        case 3:
          this.parentFrom = {
            yearGroupName: "",
            schoolIds: ""
          };
          this.searchFrom = { ...this.parentFrom };
          break;
      }
      this.getTabelData();
    },
    setDate(date, timeStr) {
      return !date ? "--" : moment(date).format(timeStr);
    },
    resetTabelData(data) {
      return data === null || data === "" || data === undefined
        ? "--"
        : String(data);
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 > 0 ? "shinning" : "";
    },
    resetImgPath(imgPath) {
      let newPath = imgPath;
      if (!newPath) return newPath;
      const NODE_ENV = process.env.NODE_ENV;
      const DATACENTER = process.env.VUE_APP_BASE_DATACENTER;
      let origin = window.location.origin;
      console.log("resetImgPath", origin, NODE_ENV, DATACENTER);
      if (NODE_ENV != "local") {
        newPath = imgPath.replace(DATACENTER, origin);
      }
      console.log("newPath", newPath);
      return newPath;
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
.tabledata {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  .dataitem {
    width: 30%;
    margin-bottom: 20px;
    padding: 0 10px;
    text-align: left;
    .dataitem_label {
      font-size: 16px;
      color: #333333;
      line-height: 24px;
      margin-bottom: 5px;
    }
    .dataitem_value {
      font-size: 14px;
      color: #999999;
      line-height: 24px;
    }
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
.teacherCouseInfo_box {
  width: 100%;
  height: 500px;
  overflow-y: auto;
}
.teacherCouseInfo {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .teacherCouseInfo_item {
    width: 32%;
    display: flex;
    align-items: center;
    padding-right: 10px;
    box-sizing: border-box;
    white-space: nowrap;
    line-height: 28px;
  }
}
</style>
