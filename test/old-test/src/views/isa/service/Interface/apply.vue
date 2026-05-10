<template>
  <div>
    <div class="searchFromBox">
      <div class="df_sb searchFromBox_header">
        <div class="searchFromBox_header_titel">接口申请</div>
        <el-select
          v-model="currentType"
          clearable
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
      <el-form
        class="df_align_center"
        :label-position="'top'"
        :inline="true"
        :model="searchFrom"
      >
        <el-form-item style="width: 15%" v-if="currentType != 1">
          <el-select
            v-model="searchFrom.schoolIds"
            clearable
            filterable
            placeholder="所属校区"
            @clear="getTabelData"
          >
            <el-option
              :key="k"
              v-for="(i, k) in schoolList"
              :label="i.enName"
              :value="i.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 15%" v-if="currentType != 1">
          <el-select
            v-model="searchFrom.yearGroupName"
            clearable
            filterable
            placeholder="年级"
            @clear="getTabelData"
          >
            <el-option
              :key="k"
              v-for="(i, k) in yeargroupList"
              :label="i"
              :value="i"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 15%" v-if="currentType == 2">
          <el-select
            v-model="searchFrom.form"
            clearable
            filterable
            placeholder="班级"
            @clear="getTabelData"
          >
            <el-option
              :key="k"
              v-for="(i, k) in formList"
              :label="i"
              :value="i"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 15%" v-if="currentType == 2">
          <el-select
            v-model="searchFrom.studentStatus"
            clearable
            placeholder="学生状态"
            @clear="getTabelData"
          >
            <el-option
              :key="k"
              v-for="(i, k) in studentStatus"
              :label="i.label"
              :value="i.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 15%" v-if="currentType == 1">
          <el-input
            v-model="searchFrom.keyword"
            placeholder="课程名称"
            clearable
            @clear="getTabelData"
          ></el-input>
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
    <div class="df_sb palyTableBox" v-if="tableData.length > 0">
      <div>
        <el-button type="primary" size="medium" @click="exportData"
          >导出</el-button
        >
      </div>
      <PaginationInfo :paginationTotal="paginationTotal" />
    </div>
    <div class="tableBox">
      <Table
        ref="Table"
        :tableTitle="tableTitle"
        :tableData="tableData"
        :tableBtn="tableBtn"
        @playTab="playTab"
        @rowClick="rowClick"
      />
      <Pagination
        :total="paginationTotal"
        :pagination="pagination"
        @handleCurrentChange="handleCurrentChange"
      />
    </div>
    <el-dialog
      title="查看详情"
      :visible.sync="showDialog"
      width="80%"
      :before-close="() => (showDialog = false)"
    >
      <div class="tabledata">
        <div class="dataitem" v-for="(item, index) in dialogData" :key="index">
          <div class="dataitem_label">{{ item["label"] }}</div>
          <div class="dataitem_value">
            {{ currenntItem[item["prop"]] ? currenntItem[item["prop"]] : "--" }}
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import Table from "@/components/common/Table.vue";
import {
  getYeargroupList,
  getSchoolList,
  getFormList,
  getTeacherPage,
  getStudentPage,
  getParentPage,
  parentExport,
  studentExport,
  teacherExport
} from "@/api/isa/index.js";
import { download } from "@/util/download.js";
import moment from "moment";
export default {
  name: "ISA-SEARCH",
  components: {
    Pagination,
    PaginationInfo,
    Table
  },
  data() {
    return {
      showDialog: false,
      yeargroupList: [],
      schoolList: [],
      formList: [],
      pagination: {
        size: 10,
        current: 1
      },
      paginationTotal: 0,
      searchFrom: {},
      teacherFrom: {
        keyword: ""
      },
      parentFrom: {
        yearGroupName: "",
        schoolIds: ""
      },
      studentFrom: {
        yearGroupName: "",
        schoolIds: "",
        form: "",
        studentStatus: ""
      },
      tableTitle: [],
      parentTableTitle: [
        { label: "家长爱莎ID", prop: "isaParentCode", width: "" },
        { label: "家长姓名", prop: "fullName", width: "" },
        // { label: "国籍", prop: "nationality", width: "" },
        { label: "与学生关系", prop: "relationships", width: "" },
        { label: "学生爱莎ID", prop: "isaStudentCode", width: "" },
        { label: "学生姓名", prop: "studentName", width: "" },
        { label: "学校", prop: "schoolName", width: "" },
        { label: "学生年级", prop: "grade", width: "" },
        { label: "联系电话", prop: "telephoneNumber", width: "" },
        { label: "是否是主监护人", prop: "isContactParental", width: "" },
        { label: "邮箱地址", prop: "emailAddress", width: "" },
        { label: "地址", prop: "address", width: "" }
      ],
      teacherTableTitle: [
        { label: "教师爱莎ID", prop: "isaTeacherCode", width: "" },
        { label: "姓名", prop: "fullName", width: "" },
        { label: "国籍", prop: "nationalities", width: "" },
        { label: "性别", prop: "gender", width: "" },
        // { label: "任课年级", prop: "grade", width: "" },
        { label: "任课课程", prop: "className", width: "" },
        { label: "电话号码", prop: "phoneNumber", width: "" },
        { label: "电子邮件", prop: "email", width: "" }
      ],
      studentTableTitle: [
        { label: "学生爱莎ID", prop: "isaStudentCode", width: "" },
        { label: "学号", prop: "admissonNo", width: "" },
        { label: "姓名", prop: "fullName", width: "" },
        { label: "性别", prop: "gender", width: "80px" },
        { label: "国籍", prop: "nationality", width: "" },
        { label: "生日", prop: "birthday", width: "" },
        { label: "学校", prop: "schoolName", width: "" },
        { label: "年级", prop: "grade", width: "80px" },
        { label: "班级", prop: "formCode", width: "" },
        { label: "学生状态", prop: "studentStatus", width: "" }
      ],
      student: [
        { label: "邮箱地址", prop: "emailAddress", width: "" },
        { label: "入学日期", prop: "enrolmentDate", width: "" },
        { label: "离开日期", prop: "leavingDate", width: "" },
        { label: "毕业日期", prop: "dateOfLeaving", width: "" }
      ],
      dialogData: [],
      tableBtn: [],
      tableData: [],
      typeList: [
        { label: "学生表", value: 2 },
        { label: "老师表", value: 1 },
        { label: "家长表", value: 3 }
      ],
      studentStatus: [
        { label: "未入学", value: 0 },
        { label: "在校", value: 1 },
        { label: "离校", value: 2 }
      ],
      studentStatusObj: {
        0: "未入学",
        1: "在校",
        2: "离校"
      },
      currentType: 2,
      currenntItem: {}
    };
  },
  created() {
    this.tableTitle = this.teacherTableTitle;
    this.searchFrom = this.studentFrom;
    this.getSelectList();
    this.getTabelData();
  },

  mounted() {},
  activated() {
    this.getTabelData();
  },
  computed: {
    ...mapGetters([
      "dictionary",
      "tagList",
      "tag",
      "permissions",
      "currentstatus"
    ])
  },
  methods: {
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
      let params = {
        ...this.pagination,
        ...this.searchFrom
      };
      switch (this.currentType) {
        case 1:
          getTeacherPage(params).then(res => {
            console.log("getTeacherPage", res);
            if (res.data.success) {
              this.tableTitle = this.teacherTableTitle;
              let { data, total, current } = res.data.data;
              this.tableData = data;
              this.paginationTotal = total;
            }
          });
          break;
        case 2:
          getStudentPage(params).then(res => {
            console.log("res", res);
            if (res.data.success) {
              this.tableTitle = this.studentTableTitle;
              let { data, total, current } = res.data.data;
              this.paginationTotal = total;
              this.tableData = data;
              this.tableData.map(item => {
                item["birthday"] = this.setDate(item["birthday"]);
                item["enrolmentDate"] = this.setDate(item["enrolmentDate"]);
                item["dateOfLeaving"] = this.setDate(item["dateOfLeaving"]);
                item["studentStatus"] = this.studentStatusObj[
                  item["studentStatus"]
                ];
              });
            }
          });
          break;
        case 3:
          getParentPage(params).then(res => {
            console.log("res", res);
            if (res.data.success) {
              this.tableTitle = this.parentTableTitle;
              let { data, total, current } = res.data.data;
              this.tableData = data;
              this.paginationTotal = total;
              this.tableData.map(item => {
                item["isContactParental"] = item["isContactParental"]
                  ? "是"
                  : "否";
              });
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
      }
    },
    changeCurrentType(e) {
      this.pagination["current"] = 1;
      switch (this.currentType) {
        case 1:
          this.searchFrom = this.teacherFrom;
          break;
        case 2:
          this.searchFrom = this.studentFrom;
          break;
        case 3:
          this.searchFrom = this.parentFrom;
          break;
      }
      this.getTabelData();
    },
    playTab(name, item, scope) {
      switch (name) {
        case "distribute":
          break;
      }
    },

    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getTabelData();
    },
    // 搜索
    search() {
      this.pagination["current"] = 1;
      this.getTabelData();
    },
    setDate(date) {
      return !date ? "--" : moment(date).format("YYYY-MM-DD");
    },
    rowClick(row, column, event) {
      this.dialogData = [];
      switch (this.currentType) {
        case 1:
          this.dialogData = this.tableTitle;
          break;
        case 2:
          this.dialogData = [...this.tableTitle, ...this.student];

          break;
        case 3:
          this.dialogData = this.tableTitle;
          break;
      }
      this.currenntItem = row;
      this.showDialog = true;
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
        background: #d4ab85;
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
  align-items: center;
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
</style>
