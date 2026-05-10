<template>
  <el-form
    class="df_align_center"
    :label-position="'top'"
    :inline="true"
    :model="searchFrom"
  >
    <el-form-item v-if="schoolList.length > 1" style="width: 15%">
      <el-select
        v-model="searchFrom['schoolIds']"
        clearable
        filterable
        placeholder="所属校区"
        @clear="search"
      >
        <el-option
          :key="k"
          v-for="(i, k) in schoolList"
          :label="i.enName"
          :value="i.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item style="width: 15%">
      <el-select
        v-model="searchFrom['yearGroupName']"
        multiple
        clearable
        filterable
        placeholder="年级"
        @clear="search"
      >
        <el-option
          :key="k"
          v-for="(i, k) in yeargroupList"
          :label="i"
          :value="i"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item style="width: 15%">
      <el-select
        v-model="searchFrom['form']"
        multiple
        clearable
        filterable
        placeholder="班级"
        @clear="search"
      >
        <el-option
          :key="k"
          v-for="(i, k) in formList"
          :label="i"
          :value="i"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item style="width: 15%">
      <el-select
        v-model="searchFrom['studentStatus']"
        clearable
        placeholder="学生状态"
        @clear="search"
      >
        <el-option
          :key="k"
          v-for="(i, k) in isaData['studentStatus']"
          :label="i.label"
          :value="i.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item class="search_form_btn" style="width: auto; margin-right: 0">
      <el-popover
        placement="bottom"
        width="1000"
        trigger="click"
        style="margin-right: 10px;"
      >
        <el-form
          class="df_aw"
          :label-position="'top'"
          :inline="true"
          :model="searchFrom"
        >
          <el-form-item style="width: 24%">
            <el-input
              v-model="searchFrom['isaStudentCode']"
              placeholder="学生爱莎ID"
              clearable
              @clear="search"
            ></el-input>
          </el-form-item>
          <el-form-item style="width: 24%">
            <el-input
              v-model="searchFrom['admissonNo']"
              placeholder="学号"
              clearable
              @clear="search"
            ></el-input>
          </el-form-item>

          <el-form-item style="width: 24%">
            <el-input
              v-model="searchFrom['allName']"
              placeholder="学生姓名/昵称/中文"
              clearable
              @clear="search"
            ></el-input>
          </el-form-item>
          <el-form-item style="width: 24%">
            <el-select
              style="width: 100%;"
              v-model="searchFrom['gender']"
              placeholder="性别"
              clearable
              @clear="search"
            >
              <el-option
                v-for="item in isaData['genderList']"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 24%">
            <el-date-picker
              style="width: 100%;"
              :value-format="'yyyy-MM-dd'"
              v-model="searchFrom['birthday']"
              type="date"
              placeholder="出生日期"
              clearable
              @clear="search"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item style="width: 24%">
            <el-input
              v-model="searchFrom['nationality']"
              placeholder="国籍"
              clearable
              @clear="search"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item style="width: 24%">
            <el-date-picker
              style="width: 100%;"
              :value-format="'yyyy-MM-dd'"
              v-model="searchFrom['enrolmentDate']"
              type="date"
              placeholder="入学日期"
              clearable
              @clear="search"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item style="width: 24%">
            <el-date-picker
              style="width: 100%;"
              :value-format="'yyyy-MM-dd'"
              v-model="searchFrom['leavingDate']"
              type="date"
              placeholder="离校日期"
              clearable
              @clear="search"
            >
            </el-date-picker>
          </el-form-item> -->
          <el-form-item style="width: 24%">
            <el-select
              style="width: 100%;"
              v-model="currentDateType"
              placeholder="入学日期/离校日期"
              clearable
              @change="changeDateType"
            >
              <el-option
                v-for="item in dateType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 24%" v-if="currentDateType != ''">
            <el-select
              style="width: 100%;"
              v-model="currentTimeType"
              placeholder="时间维度"
              clearable
              @clear="clearDate"
              @change="changeTimeType"
            >
              <el-option
                v-for="item in selectTimeType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!--年度 季度 -->
          <el-form-item style="width: 24%" v-if="currentTimeType == 3">
            <el-date-picker
              style="width: 100%;"
              value-format="yyyy"
              v-model="searchFrom['yearQuarter']"
              type="year"
              placeholder="选择年"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            style="width: 24%"
            v-if="currentTimeType == 3 && searchFrom['yearQuarter']"
          >
            <el-select
              style="width: 100%;"
              v-model="currentQuarter"
              placeholder="季度"
              clearable
              @change="changeQuarter"
            >
              <el-option
                v-for="item in selectQuarter"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 日期范围 -->
          <el-form-item style="width: 30%" v-if="currentTimeType == 4">
            <el-date-picker
              style="width: 100%;"
              v-model="rangeDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="changeRangeDate"
            >
            </el-date-picker>
          </el-form-item>
          <!-- 月份范围 -->
          <el-form-item style="width: 24%" v-if="currentTimeType == 2">
            <el-date-picker
              style="width: 100%;"
              v-model="rangeDate"
              type="monthrange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM"
              @change="changeRangeDate"
            >
            </el-date-picker>
          </el-form-item>
          <!-- 年份范围-->
          <el-form-item style="width: 24%" v-if="currentTimeType == 1">
            <div class="df_sb">
              <el-date-picker
                value-format="yyyy"
                v-model="rangeYear['beginYear']"
                type="year"
                placeholder="开始年份"
                @change="changeBeginYear"
              >
              </el-date-picker>
              <span>-</span>
              <el-date-picker
                value-format="yyyy"
                v-model="rangeYear['endYear']"
                type="year"
                placeholder="结束年份"
                @change="changeEndYear"
              >
              </el-date-picker>
            </div>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="large" slot="reference"
          >高级筛选</el-button
        >
      </el-popover>
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
</template>

<script>
import { mapGetters } from "vuex";
import isaData from "../const.js";
export default {
  name: "form",
  components: {},
  props: {
    yeargroupList: {
      default: () => {
        return [];
      },
      type: Array
    },
    schoolList: {
      default: () => {
        return [];
      },
      type: Array
    },
    formList: {
      default: () => {
        return [];
      },
      type: Array
    }
  },
  data() {
    return {
      isaData: isaData,
      currentDateType: "",
      currentTimeType: "",
      currentQuarter: "",
      rangeDate: [],
      rangeYear: {
        beginYear: "",
        endYear: ""
      },
      dateType: [
        {
          label: "入学日期",
          value: 1
        },
        {
          label: "离校日期",
          value: 2
        }
      ],
      selectTimeType: [
        {
          label: "年份",
          value: 1,
          dateType: ""
        },
        {
          label: "月份",
          value: 2,
          dateType: ""
        },
        {
          label: "季度",
          value: 3,
          dateType: ""
        },
        {
          label: "日期",
          value: 4,
          dateType: ""
        }
      ],
      selectQuarter: [
        {
          label: "第一季度",
          value: 1
        },
        {
          label: "第二季度",
          value: 2
        },
        {
          label: "第三季度",
          value: 3
        },
        {
          label: "第四季度",
          value: 4
        }
      ],
      searchFrom: {
        schoolIds: "",
        yearGroupName: [],
        form: [],
        studentStatus: "",
        allName: "",
        gender: "",
        birthday: "",
        isaStudentCode: "",
        // enrolmentDate: "",
        // leavingDate: "",
        nationality: "",
        admissonNo: "",
        // 入学日期
        enrolmentBeginDate: "",
        enrolmentEndDate: "",
        // 离校日期
        leavingBeginDate: "",
        leavingEndDate: "",
        // 季度年份/季度
        yearQuarter: "",
        enrolmentQuarter: "",
        leavingQuarter: ""
      }
    };
  },
  created() {},

  mounted() {},
  activated() {},
  methods: {
    // 搜索
    search() {
      console.log("searchFrom", this.searchFrom);
      this.$emit("search", this.searchFrom);
      setTimeout(() => {
        this.clearForm();
      }, 1000);
    },
    // 全部清除选项
    clear() {
      this.clearData();
      this.search();
    },
    clearDateType() {},
    changeDateType(e) {
      this.currentDateType = e ? e : "";
      this.currentTimeType = "";
      this.clearDate();
    },
    changeTimeType(e) {
      this.currentTimeType = e;
      this.clearDate();
    },
    changeRangeDate(e) {
      console.log("changeRangeDate", e);
      if (e) {
        if (this.currentDateType == 1) {
          this.searchFrom["enrolmentBeginDate"] = e[0];
          this.searchFrom["enrolmentEndDate"] = e[1];
        }
        if (this.currentDateType == 2) {
          this.searchFrom["leavingBeginDate"] = e[0];
          this.searchFrom["leavingEndDate"] = e[1];
        }
      } else {
        this.searchFrom = {
          ...this.searchFrom,
          // 入学日期
          enrolmentBeginDate: "",
          enrolmentEndDate: "",
          // 离校日期
          leavingBeginDate: "",
          leavingEndDate: ""
        };
      }
    },
    changeQuarter(e) {
      console.log("changeQuarter", e);
      if (this.currentDateType == 1) {
        this.searchFrom["enrolmentQuarter"] = e ? e : "";
      }
      if (this.currentDateType == 2) {
        this.searchFrom["leavingQuarter"] = e ? e : "";
      }
    },
    changeBeginYear(e) {
      console.log("changeBeginYear", e);
      let canSelect = true;
      if (e && this.rangeYear["endYear"]) {
        let beginYear = new Date(e).getTime();
        let endYear = new Date(this.rangeYear["endYear"]).getTime();
        console.log("changeBeginYear", beginYear, endYear, beginYear < endYear);
        canSelect = beginYear < endYear;
      }
      if (canSelect) {
        if (this.currentDateType == 1) {
          this.searchFrom["enrolmentBeginDate"] = e ? e : "";
        }
        if (this.currentDateType == 2) {
          this.searchFrom["leavingBeginDate"] = e ? e : "";
        }
      } else {
        this.$message.warning("开始年份应小于结束年份");
        // this.rangeYear["beginYear"] = "";
      }
    },
    changeEndYear(e) {
      console.log("changeEndYear", e);
      let canSelect = true;
      if (e && this.rangeYear["beginYear"]) {
        let beginYear = new Date(this.rangeYear["beginYear"]).getTime();
        let endYear = new Date(e).getTime();
        console.log("changeEndYear", beginYear, endYear, endYear > beginYear);
        canSelect = endYear > beginYear;
      }
      if (canSelect) {
        if (this.currentDateType == 1) {
          this.searchFrom["enrolmentEndDate"] = e ? e : "";
        }
        if (this.currentDateType == 2) {
          this.searchFrom["leavingEndDate"] = e ? e : "";
        }
      } else {
        this.$message.warning("结束年份应大于开始年份");
        // this.rangeYear["endYear"] = "";
      }
    },
    clearData() {
      this.searchFrom = {
        ...this.searchFrom,
        schoolIds: "",
        yearGroupName: [],
        form: [],
        studentStatus: "",
        allName: "",
        gender: "",
        birthday: "",
        enrolmentDate: "",
        isaStudentCode: "",
        leavingDate: "",
        nationality: "",
        admissonNo: "",
        // 入学日期
        enrolmentBeginDate: "",
        enrolmentEndDate: "",
        // 离校日期
        leavingBeginDate: "",
        leavingEndDate: "",
        // 季度年份/季度
        yearQuarter: "",
        enrolmentQuarter: "",
        leavingQuarter: ""
      };
      this.clearDate();
    },
    clearDate() {
      this.searchFrom = {
        ...this.searchFrom,
        // 入学日期
        enrolmentBeginDate: "",
        enrolmentEndDate: "",
        // 离校日期
        leavingBeginDate: "",
        leavingEndDate: "",
        // 季度年份/季度
        yearQuarter: "",
        enrolmentQuarter: "",
        leavingQuarter: ""
      };
      this.currentQuarter = "";
      this.rangeDate = [];
      this.rangeYear = {
        beginYear: "",
        endYear: ""
      };
    },
    clearForm() {
      this.searchFrom = {
        ...this.searchFrom,
        isaStudentCode: "",
        admissonNo: "",
        allName: "",
        gender: "",
        birthday: "",
        nationality: "",
        nationality: ""
      };
      this.currentDateType = "";
      this.currentTimeType = "";
      this.currentQuarter = "";
      this.clearDate();
    }
  }
};
</script>

<style lang="scss" scoped>
.search_form_btn {
  /deep/.el-form-item__content {
    display: flex !important;
    align-items: center;
  }
}
</style>
