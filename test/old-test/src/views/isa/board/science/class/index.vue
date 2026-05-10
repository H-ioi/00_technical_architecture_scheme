<template>
  <div class="isa_center_page">
    <div class="searchFromBox">
      <div class="df_sb searchFromBox_header">
        <div class="searchFromBox_header_titel">
          {{ $t("isagroup.班级看板") }}
        </div>
      </div>
      <el-form
        class="df_align_center"
        :label-position="'top'"
        :inline="true"
        :model="searchFrom"
      >
        <el-form-item style="width: 180px">
          <el-select
            clearable
            v-model="searchFrom['schoolIds']"
            :placeholder="$t('isagroup.选择学校')"
            @clear="initData"
          >
            <el-option
              :key="k"
              v-for="(i, k) in schoolList"
              :label="i.enName"
              :value="i.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 180px">
          <el-select
            multiple
            clearable
            v-model="searchFrom['academicYear']"
            :placeholder="$t('isagroup.学年')"
            @clear="initData"
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
        <el-form-item style="width: 180px">
          <el-select
            clearable
            v-model="searchFrom['academicTerm']"
            :placeholder="$t('isagroup.学期')"
            @clear="initData"
          >
            <el-option v-for="item in termList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 180px">
          <el-select
            clearable
            v-model="searchFrom['yearGroup']"
            :placeholder="$t('isagroup.年级')"
            @clear="initData"
          >
            <el-option
              v-for="item in gradeList"
              :key="item['id']"
              :label="item['label']"
              :value="item['value']"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 180px">
          <el-select
            multiple
            clearable
            v-model="searchFrom['form']"
            :placeholder="$t('isagroup.班级')"
            @clear="initData"
          >
            <el-option v-for="item in formList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: auto; margin-right: 0">
          <el-button type="primary" size="large" @click="initData">{{
            $t("btn.查询")
          }}</el-button>
          <el-button
            type="defult"
            size="large"
            icon="el-icon-refresh-right"
            @click="clear"
            >{{ $t("btn.重置") }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div
      class="df_sb palyTableBox"
      v-if="permissions['class_profiles_download'] && activeTab == '2'"
    >
      <el-button
        type="primary"
        size="medium"
        :loading="downLoadIng"
        @click="exportList"
        >{{ $t("consult.导出") }}</el-button
      >
    </div>
    <div class="table_tabs">
      <div class="score">
        <div class="score_item" v-for="(item, index) in scoreColorList" :key="index">
          <div class="score_item_color" :style="`background: ${item['value']};`"></div>
          <div class="score_item_label">{{ item["label"] }}</div>
        </div>
      </div>

      <el-tabs v-model="activeTab" @tab-click="handleClick">
        <el-tab-pane label="ManageBac  " name="1">
          <Table
            tableType="classManageBac"
            ref="MB"
            :searchFrom="searchFrom"
            :schoolList="schoolList"
          />
        </el-tab-pane>
        <el-tab-pane label="Progress&PASS&CAT4" name="2">
          <Table
            tableType="classCombine"
            ref="classCombine"
            :searchFrom="searchFrom"
            :schoolList="schoolList"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  getAcademicYearList,
  getTermList,
  getFormList,
  getGradeList,
} from "@/api/isa/science/student.js";
import { getSchoolList } from "@/api/isa/index.js";
import { exportCombineCLASSTable } from "@/api/isa/science/class.js";
import { fetchTypeList } from "@/api/workorder/order/orderlist.js";
import { mapGetters } from "vuex";
import Table from "./components/table.vue";
import consts from "@/const/isagroup/consts.js";
import { getStore } from "@/util/store";
import { download } from "@/util/download.js";
export default {
  name: "student",
  components: { Table },
  data() {
    return {
      activeTab: "1",
      scoreColorList: consts["scoreColorList"],
      list: [],
      academicYearList: [],
      termList: [],
      formList: [],
      gradeList: [],
      schoolList: [],
      searchFrom: {
        // academicYear: [],
        // academicTerm: "",
        // form: [],
        // yearGroup: ""
      },
      downLoadIng: false,
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
  watch: {},
  methods: {
    initDataList() {
      this.getFormList();
      this.getTermList();
      this.getGradeList();
      this.getAcademicYearList();
      this.getSchoolList();
    },
    initData() {
      this.$nextTick(() => {
        this.$refs["MB"].pagination["current"] = 1;
        this.$refs["classCombine"].pagination["current"] = 1;
        this.$refs["MB"].getList();
        this.$refs["classCombine"].getList();
      });
    },
    getFormList() {
      getFormList().then((res) => {
        if (res.data.success) {
          this.formList = res.data.data;
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
    getSchoolList() {
      getSchoolList().then((res) => {
        console.log("res", res);
        if (res.data.success) {
          this.schoolList = res.data.data;
        }
      });
    },
    getGradeList() {
      fetchTypeList("isadatacenter_enroll_level").then((res) => {
        console.log("isadatacenter_enroll_level", res.data);
        if (res.data.success) {
          this.gradeList = [];
          let data = res.data.data;
          let userInfo = getStore({
            name: "userInfo",
          });
          let dataDictValues = userInfo["dataDictValues"];
          let enrollLevel = dataDictValues["isadatacenter_enroll_level"]
            ? dataDictValues["isadatacenter_enroll_level"]
            : [];
          data.map((item) => {
            if (!item.archived && item.status && enrollLevel.includes(item["value"])) {
              this.gradeList.push(item);
            }
          });
        }
      });
    },
    // 导出
    exportList() {
      let sortFrom = this.$refs["classCombine"].sortFrom;
      let data = {
        ...this.searchFrom,
        ...sortFrom,
      };
      this.downLoadIng = true;
      exportCombineCLASSTable(data)
        .then((res) => {
          console.log("res", res);
          this.$message.success(this.$t("consult.成功"));
          download(res.data, res.headers["content-disposition"]);
          this.downLoadIng = false;
        })
        .catch((err) => {
          this.downLoadIng = false;
        });
    },
    handleClick(tab, event) {
      console.log("handleClick", tab, event);
    },
    search() {},
    clear() {
      this.searchFrom = {
        // academicYear: [],
        // academicTerm: "",
        // form: [],
        // yearGroup: ""
      };
      this.initData();
    },
  },
};
</script>

<style lang="scss" scoped>
.table_tabs {
  padding: 0 20px 30px;
  background-color: #fff;
  position: relative;

  .score {
    display: flex;
    align-items: center;
    position: absolute;
    right: 20px;
    top: 20px;
    transform: translate(0, -50%);
    z-index: 3;
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
</style>
