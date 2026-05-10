<template>
  <div class="isa_center_page">
    <div class="searchFromBox">
      <div class="df_sb searchFromBox_header">
        <div class="searchFromBox_header_titel">
          {{ $t("isagroup.个人看板") }}
        </div>
        <!-- <el-select
          clearable
          v-model="schoolIds"
          :placeholder="$t('isagroup.选择学校')"
          @clear="initData"
          @change="changeSchool"
        >
          <el-option
            :key="k"
            v-for="(i, k) in schoolList"
            :label="i.enName"
            :value="i.id"
          >
          </el-option>
        </el-select> -->
      </div>
      <div class="df_sb">
        <el-autocomplete
          style="width: 240px"
          class="inline-input"
          suffix-icon="el-icon-search"
          v-model="studentStr"
          :fetch-suggestions="querySearch"
          :placeholder="$t('isagroup.请输入学生名/学号')"
          :trigger-on-focus="false"
          @select="handleSelect"
          @keyup.enter.native="handleSelect"
          @input="changeStyle('block', '.el-autocomplete-suggestion')"
          @keyup="changeStyle('block', '.el-autocomplete-suggestion')"
        ></el-autocomplete>
        <el-form
          v-if="!searchFrom['admissonNo'] == ''"
          class="df_align_center"
          :label-position="'top'"
          :inline="true"
          :model="searchFrom"
        >
          <el-form-item style="width: 160px">
            <el-select
              clearable
              @clear="initData"
              v-model="searchFrom['subject']"
              :placeholder="$t('isagroup.科目')"
            >
              <el-option
                v-for="item in subjectList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 160px">
            <el-select
              multiple
              clearable
              @clear="initData"
              v-model="searchFrom['academicYear']"
              :placeholder="$t('isagroup.学年')"
            >
              <el-option
                v-for="item in academicYearList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 160px">
            <el-select
              clearable
              @clear="initData"
              v-model="searchFrom['academicTerm']"
              :placeholder="$t('isagroup.学期')"
            >
              <el-option v-for="item in termList" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item style="width: auto; margin-right: 0">
            <el-button type="primary" size="large" @click="searchData">{{
              $t("btn.查询")
            }}</el-button>
            <el-button
              type="defult"
              size="large"
              icon="el-icon-refresh-right"
              @click="clearSearch"
              >{{ $t("btn.重置") }}</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="boardstudent">
      <div class="student df_sb">
        <div class="student_info df_sb">
          <div class="student_info_avatar">
            <el-image
              v-if="studentInfo['profilePhoto']"
              lazy
              style="width: 100%; height: 100%"
              :src="studentInfo['profilePhoto']"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
          <div class="student_info_stats">
            <div class="student_info_stats_item">
              <div class="student_info_stats_item_label">
                {{ $t("isagroup.学生姓名") + "：" }}
              </div>
              <div class="student_info_stats_item_value">
                {{ studentInfo["fullName"] }}
              </div>
            </div>
            <div class="student_info_stats_item df_sb">
              <div class="student_info_stats_item_label">
                {{ $t("isagroup.学生ID") + "：" }}
              </div>
              <div class="student_info_stats_item_value">
                {{ studentInfo["admissonNo"] }}
              </div>
            </div>
            <div class="student_info_stats_table">
              <div class="df_sb student_info_stats_item">
                <div class="student_info_stats_item_label">
                  {{ $t("isagroup.年级") }}
                </div>
                <div class="student_info_stats_item_label">
                  {{ $t("isagroup.班级") }}
                </div>
                <div class="student_info_stats_item_label">
                  {{ $t("isagroup.年龄") }}
                </div>
              </div>
              <div class="df_sb student_info_stats_item">
                <div class="student_info_stats_item_value">
                  {{ studentInfo["grade"] }}
                </div>
                <div class="student_info_stats_item_value">
                  {{ studentInfo["formCode"] }}
                </div>
                <div class="student_info_stats_item_value">
                  {{ studentInfo["age"] }}
                </div>
              </div>
            </div>
            <div class="student_info_stats_item df_sb">
              <div class="student_info_stats_item_label">
                {{ $t("isagroup.校区") + "：" }}
              </div>
              <span
                class="student_info_stats_item_value"
                :title="studentInfo['schoolName']"
              >
                {{ studentInfo["schoolName"] }}
              </span>
            </div>
            <div
              class="student_info_stats_item df_sb"
              v-if="!wuHanSchool.includes(studentInfo['externId'])"
            >
              <div class="student_info_stats_item_label">
                {{ $t("isagroup.学院") + "：" }}
              </div>
              <span
                class="student_info_stats_item_value"
                :title="studentInfo['boardingHouse']"
              >
                {{ studentInfo["boardingHouse"] }}
              </span>
            </div>
            <div class="student_info_stats_item df_sb">
              <div class="student_info_stats_item_label">
                {{ $t("isagroup.寄宿") + "：" }}
              </div>
              <span
                class="student_info_stats_item_value"
                :title="studentInfo['dormitoryStatus']"
              >
                {{ studentInfo["dormitoryStatus"] }}
              </span>
            </div>
            <div class="student_info_stats_item df_sb">
              <div class="student_info_stats_item_label">
                {{ $t("isagroup.班主任") + "：" }}
              </div>
              <span
                class="student_info_stats_item_value"
                :title="studentInfo['homeroomTC']"
              >
                {{ studentInfo["homeroomTC"] }}
              </span>
            </div>
          </div>
        </div>
        <div class="df_sb" style="flex: 1">
          <STUDENT-CAT ref="STUDENT-CAT" />
          <STUDENT-PROGRESS ref="STUDENT-PROGRESS" />
        </div>
      </div>
      <div class="table">
        <div class="table_top">
          <div class="table_title">ManageBac</div>
          <div class="score">
            <div class="score_item" v-for="(item, index) in scoreColorList" :key="index">
              <div
                class="score_item_color"
                :style="`background: ${item['value']};`"
              ></div>
              <div class="score_item_label">{{ item["label"] }}</div>
            </div>
          </div>
        </div>
        <div class="table_data">
          <Table
            height="400px"
            ref="manageBacTable"
            :tableTitle="manageBacTableTitle"
            :tableData="mbTableData"
          />
        </div>
      </div>
      <div class="table">
        <div class="table_top">
          <div class="table_title">PASS</div>
        </div>
        <div class="table_data">
          <Table
            height="400px"
            ref="passTable"
            :tableTitle="passTableTitle"
            :tableData="passTableData"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAcademicYearList,
  getTermList,
  getSubjectList,
  getStudentInfo,
  searchStudentList,
  getCAT4Bar,
  getProgressBar,
  getMBTable,
  getPassTable,
} from "@/api/isa/science/student.js";
import { getSchoolList } from "@/api/isa/index.js";
import { mapGetters } from "vuex";
import tabletitle from "@/const/isagroup/tabletitle.js";
import consts from "@/const/isagroup/consts.js";
import Table from "@/components/isagroupcommon/Table.vue";
import STUDENTCAT from "./components/studentcat";
import STUDENTPROGRESS from "./components/studentprogress";
export default {
  name: "student",
  components: { STUDENTCAT, STUDENTPROGRESS, Table },
  data() {
    return {
      scoreColorList: consts["scoreColorList"],
      manageBacTableTitle: tabletitle["manageBac"],
      passTableTitle: tabletitle["pass"],
      mbTableData: [],
      passTableData: [],
      searchFrom: {
        academicTerm: "",
        academicYear: [],
        subject: "",
        admissonNo: "",
      },
      studentStr: "",
      academicYearList: [],
      termList: [],
      subjectList: [],
      studentInfo: {},
      barCAT4: [],
      barProgress: [],
      wuHanSchool: ["CL6-0002", "CL6-0001", "CL6-0003"],
      //   wuHanSchool: ["CL6-0002"],
    };
  },
  created() {
    this.initDataList();
    this.initData();
  },
  mounted() {},
  activated() {
    this.initData();
  },
  computed: {
    ...mapGetters(["permissions", "i18nlocel"]),
  },
  methods: {
    initDataList() {
      this.getSchoolList();
      this.getSubjectList();
      this.getTermList();
      this.getAcademicYearList();
    },
    initData() {
      if (this.searchFrom["admissonNo"] == "") return;
      this.getStudentInfo();
      this.getCAT4Bar();
      this.getProgressBar();
      this.getMBTable();
      this.getPassTable();
    },
    changeSchool(schoolExternId) {
      if (this.wuHanSchool.includes(schoolExternId)) {
        this.manageBacTableTitle = tabletitle["wuhanManageBac"];
      } else {
        this.manageBacTableTitle = tabletitle["manageBac"];
      }
      console.log("changeSchool", schoolExternId);
    },
    getSchoolList() {
      getSchoolList().then((res) => {
        console.log("res", res);
        if (res.data.success) {
          this.schoolList = res.data.data;
        }
      });
    },
    getSubjectList() {
      getSubjectList().then((res) => {
        if (res.data.success) {
          this.subjectList = res.data.data;
        }
      });
    },
    getAcademicYearList() {
      getAcademicYearList().then((res) => {
        if (res.data.success) {
          this.academicYearList = res.data.data;
        }
      });
    },
    getTermList() {
      getTermList().then((res) => {
        if (res.data.success) {
          this.termList = res.data.data;
        }
      });
    },
    // 挂载查询到的学生
    async querySearch(queryString, cb) {
      searchStudentList({ student: queryString }).then((res) => {
        if (res.data.success) {
          let data = res.data.data;
          let list = [];
          Object.keys(data).forEach((key) => {
            list.push({
              value: key,
              admissonNo: data[key],
            });
          });
          cb(list);
        } else {
          cb([]);
        }
      });
    },
    handleSelect(item) {
      this.searchFrom["admissonNo"] = item["admissonNo"];
      this.changeStyle("none", ".el-autocomplete-suggestion");
      if (item["admissonNo"]) {
        this.studentInfo = {};
        this.clearData();
        this.clearSearch();
      } else {
        this.searchFrom["admissonNo"] = "";
        this.studentInfo = {};
        this.clearData();
      }
    },
    clearData() {
      this.mbTableData = [];
      this.passTableData = [];
      this.barCAT4 = [];
      this.barProgress = [];
      this.$refs["STUDENT-CAT"].setData(this.barCAT4);
      this.$refs["STUDENT-PROGRESS"].setData(this.barProgress);
    },
    //根据传进来的状态改变建议输入框的状态（展开|隐藏）
    changeStyle(status, className) {
      let dom = document.querySelectorAll(className);
      dom[0].style.display = status;
    },
    getStudentInfo() {
      getStudentInfo(this.searchFrom).then((res) => {
        if (res.data.success) {
          let data = res.data.data;
          this.changeSchool(data["externId"]);
          this.$nextTick(() => {
            this.studentInfo = {
              ...data,
            };
            this.studentInfo["profilePhoto"] = this.resetImgPath(data["profilePhoto"]);
            this.studentInfo["schoolName"] = this.getSchoolName(data["externId"]);
            console.log(" this.studentInfo", this.studentInfo);
          });
        }
      });
    },
    getCAT4Bar() {
      getCAT4Bar(this.searchFrom).then((res) => {
        if (res.data.success) {
          let data = res.data.data;
          if (data) {
            this.barCAT4 = data;
            this.$refs["STUDENT-CAT"].setData(this.barCAT4);
          } else {
            this.barCAT4 = [];
            this.$refs["STUDENT-CAT"].setData(this.barCAT4);
          }
        }
      });
    },
    getProgressBar() {
      getProgressBar(this.searchFrom).then((res) => {
        if (res.data.success) {
          let data = res.data.data;
          if (data) {
            this.barProgress = data;
            this.$refs["STUDENT-PROGRESS"].setData(this.barProgress);
          } else {
            this.barProgress = [];
            this.$refs["STUDENT-PROGRESS"].setData(this.barProgress);
          }
        }
      });
    },
    getMBTable() {
      getMBTable(this.searchFrom).then((res) => {
        if (res.data.success) {
          let data = res.data.data;
          if (data) {
            this.mbTableData = data;
            this.mbTableData.map((item) => {
              item["cellType"] = "mb";
            });
          } else {
            this.mbTableData = [];
          }
        }
      });
    },
    getPassTable() {
      getPassTable(this.searchFrom).then((res) => {
        if (res.data.success) {
          let data = res.data.data;
          if (data) {
            this.passTableData = data;
            this.passTableData.map((item) => {
              item["cellType"] = "pass";
            });
          } else {
            this.passTableData = [];
          }
        }
      });
    },
    searchData() {
      this.clearData();
      this.initData();
    },
    clearSearch() {
      this.searchFrom = {
        ...this.searchFrom,
        academicTerm: "",
        academicYear: [],
        subject: "",
      };
      this.initData();
    },
    resetImgPath(imgPath) {
      let newPath = imgPath;
      if (!newPath) return newPath;
      const NODE_ENV = process.env.NODE_ENV;
      const DATACENTER = process.env.VUE_APP_BASE_DATACENTER;
      let origin = window.location.origin;
      if (NODE_ENV != "local") {
        newPath = imgPath.replace(DATACENTER, origin);
      }
      console.log("newPath", newPath);
      return newPath;
    },
    getSchoolName(id) {
      let schoolName = "";
      this.schoolList.map((item) => {
        if (item["externId"] == id) {
          schoolName = item["enName"];
        }
      });
      return schoolName;
    },
  },
};
</script>

<style lang="scss" scoped>
.boardstudent {
  background-color: #fff;
  padding: 20px;

  .student {
    width: 100%;
    margin-bottom: 30px;
    .student_info {
      margin-right: 60px;
      .student_info_avatar {
        width: 166px;
        height: 216px;
        margin-right: 20px;
        background-size: cover;
        background: #dfdfdf;
      }
      .student_info_stats {
        width: 200px;

        .student_info_stats_item {
          width: 100%;
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          &:last-child {
            margin-bottom: 0;
          }
          .student_info_stats_item_label {
            font-family: AlibabaPuHuiTiR;
            font-size: 12px;
            color: #666666;
            line-height: 17px;
            text-align: left;
            white-space: nowrap;
          }
          .student_info_stats_item_value {
            font-family: AlibabaPuHuiTiR;
            font-size: 12px;
            color: #333333;
            line-height: 17px;
            text-align: left;
            flex: 1;
            white-space: nowrap; //不换行
            overflow: hidden; //超出部分隐藏
            text-overflow: ellipsis; //文本溢出显示省略号
          }
        }
        .student_info_stats_table {
          width: 100%;
          .student_info_stats_item {
            border-bottom: 1px solid #f2f2f2;
            padding-bottom: 10px;
            margin-bottom: 10px;
            &:last-child {
              border-bottom: 0;
              padding-bottom: 0;
            }
            .student_info_stats_item_label {
              width: 33.33%;
              text-align: center;
            }
            .student_info_stats_item_value {
              display: inline-block;
              width: 33.33%;
              text-align: center;
              white-space: nowrap; //不换行
              overflow: hidden; //超出部分隐藏
              text-overflow: ellipsis; //文本溢出显示省略号
            }
          }
        }
      }
    }
  }
  .table {
    margin-bottom: 30px;
    .table_top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 15px;
      .table_title {
        font-family: Biotif, Biotif;
        font-weight: 700;
        font-size: 16px;
        color: #333333;
      }
      .score {
        display: flex;
        align-items: center;
        .score_item {
          display: flex;
          align-items: center;
          margin-left: 20px;
          .score_item_color {
            width: 10px;
            height: 10px;
            background: #ffffff;
          }
          .score_item_label {
            font-family: Biotif, Biotif;
            font-weight: 400;
            font-size: 12px;
            color: #333333;
            margin-left: 4px;
          }
        }
      }
    }
  }
}
</style>
