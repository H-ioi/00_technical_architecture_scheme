<template>
  <div class="thepool_page">
    <StatusItem
      :statusList="statusList"
      :currentstatus="currentstatus"
      @changeStasus="changeStasus"
    />
    <div class="requestParam" v-if="requestList.length > 0">
      <div class="requestParam_title">{{ $t("consult.筛选信息") }}</div>
      <div class="requestParamlist">
        <div
          @click="selectCurrentRequestParam(item)"
          :class="[
            'requestParamlist_item',
            {
              active_item: item.id == searchRequestParamId,
            },
          ]"
          v-for="(item, index) in requestList"
          :key="index"
        >
          {{ item.description }}
          <i
            style="margin-left: 2px"
            class="el-icon-close"
            @click="delRequestParam(item.id)"
          ></i>
        </div>
      </div>
    </div>
    <div class="searchFromBox search" style="padding: 20px">
      <el-form
        ref="searchFrom"
        class="df_align_center searchFrom"
        :label-position="'top'"
        :inline="true"
        :model="searchFrom"
      >
        <el-form-item
          :label="$t('consult.关键词')"
          prop="keyword"
          style="width: 214px"
        >
          <el-input
            v-model="searchFrom.keyword"
            :placeholder="$t('consult.请输入')"
            maxlength="20"
            clearable
            @clear="search"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="currentstatus == '-1'"
          :label="$t('consult.状态')"
          style="width: 214px"
        >
          <el-select
            clearable
            @clear="search"
            multiple
            v-model="searchFrom.status"
            :placeholder="$t('consult.请选择')"
          >
            <el-option
              v-for="item in enrolledStatus"
              :key="item.value"
              :label="$t('consult')[item.label]"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="dictpermissions['order_school'].length > 1"
          :label="$t('consult.归属校区')"
          style="width: 214px"
        >
          <el-select
            multiple
            v-model="searchFrom.schools"
            :placeholder="$t('consult.请选择')"
            clearable
            @clear="search"
          >
            <el-option
              v-for="item in dictpermissions['order_school']"
              :key="item.value"
              :label="i18nlocel == 'en' ? item.enLabel : item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="pooldictpermissions.length > 1"
          :label="$t('consult.校区')"
          style="width: 214px"
        >
          <el-select
            multiple
            v-model="searchFrom.applySchools"
            :placeholder="$t('consult.请选择')"
            @change="changeSchool"
            clearable
            @clear="search"
          >
            <el-option
              v-for="item in pooldictpermissions"
              :key="item.value"
              :label="i18nlocel == 'en' ? item.enLabel : item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="enrollLevelList.length > 0"
          :label="$t('consult.申请年级')"
          style="width: 214px"
        >
          <el-select
            multiple
            v-model="searchFrom.enrollLevels"
            :placeholder="$t('consult.请选择')"
            clearable
            @clear="search"
          >
            <el-option
              v-for="item in enrollLevelList"
              :key="item.value"
              :label="i18nlocel == 'en' ? item.enLabel : item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="directionsList.length > 0"
          :label="$t('consult.方向')"
          style="width: 214px"
        >
          <el-select
            multiple
            v-model="searchFrom.directions"
            :placeholder="$t('consult.请选择')"
            clearable
            @clear="search"
          >
            <el-option
              v-for="item in directionsList"
              :key="item.value"
              :label="i18nlocel == 'en' ? item.enLabel : item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('consult.是否休学')"
          prop="isDropout"
          style="width: 214px"
        >
          <el-select
            style="width: 100%"
            v-model="searchFrom.isDropout"
            :placeholder="$t('consult.请选择')"
            clearable
            @clear="search"
          >
            <el-option
              v-for="item in consult['yesOrno']"
              :key="item.value"
              :label="i18nlocel == 'en' ? item.enLabel : item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('consult.新增时间')" style="width: 214px">
          <el-date-picker
            style="width: 100%"
            v-model="searchFrom.createdTime"
            type="daterange"
            :range-separator="$t('consult.至')"
            :start-placeholder="$t('consult.开始')"
            :end-placeholder="$t('consult.结束')"
            :value-format="'yyyy-MM-dd'"
            :format="'yyyy-MM-dd'"
            clearable
            @clear="search"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item style="width: 320px; margin-right: 0">
          <div class="df_sb">
            <el-button
              type="defult"
              size="small"
              round
              @click="saveRequestParam"
              >{{ $t("consult.保存筛选信息") }}</el-button
            >
            <el-button type="defult" size="small" round @click="search">{{
              $t("consult.搜索")
            }}</el-button>
            <el-button type="text" size="small" round @click="clear">
              <div class="clear_btn">
                <img src="/thepool/other/clear.png" alt="" />
                <span> {{ $t("consult.清除") }}</span>
              </div>
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="df_sb palyTableBox" style="padding-top: 0">
      <div class="df_sb">
        <el-button
          v-if="permissions['thepool_user_student_mine_add']"
          type="primary"
          size="small"
          round
          @click="addStudent"
          >{{ $t("consult.新增") }}</el-button
        >
        <el-button
          v-if="
            currentstatus == '2' && permissions['enquiry_student_upgrade_enter']
          "
          type="primary"
          size="small"
          round
          @click="showUpgrade"
          >{{ $t("consult.一键升学") }}</el-button
        >
        <el-button
          v-if="
            tableData.length > 0 &&
            currentstatus == '4' &&
            permissions['thepool_user_student_mine_enternotice']
          "
          type="primary"
          size="small"
          round
          @click="handleBtns('showAdmissionNotice')"
          >{{ $t("consult.入学通知") }}</el-button
        >
        <el-button
          v-if="permissions['thepool_user_student_mine_batchedit']"
          type="defult"
          size="small"
          round
          @click="handleBtns('batchEditstudent')"
          >{{ $t("consult.批量编辑") }}</el-button
        >

        <el-button
          v-if="
            tableData.length > 0 &&
            (currentstatus == '1' || currentstatus == '3') &&
            permissions['thepool_user_student_mine_enter']
          "
          type="defult"
          size="small"
          round
          @click="handleBtns('batchEnrollment')"
          >{{ $t("consult.批量入学") }}</el-button
        >
        <el-button
          v-if="
            tableData.length > 0 &&
            currentstatus == '2' &&
            permissions['thepool_user_student_mine_leaving']
          "
          type="defult"
          size="small"
          round
          @click="handleBtns('batchLeaving')"
          >{{ $t("consult.批量离校") }}</el-button
        >
        <el-button
          v-if="
            tableData.length > 0 &&
            currentstatus == '2' &&
            permissions['thepool_user_student_mine_graduated']
          "
          type="defult"
          size="small"
          round
          @click="handleBtns('batchGraduation')"
          >{{ $t("consult.批量毕业") }}</el-button
        >
        <el-button
          v-if="
            tableData.length > 0 &&
            currentstatus == '0' &&
            permissions['thepool_user_student_mine_apply']
          "
          type="defult"
          size="small"
          round
          @click="handleBtns('batchApply')"
          >{{ $t("consult.批量申请") }}</el-button
        >
        <el-button
          v-if="permissions['thepool_user_student_mine_import']"
          type="defult"
          size="small"
          round
          @click.stop="showUpload = true"
          >{{ $t("consult.导入") }}</el-button
        >
        <el-button
          v-if="
            tableData.length > 0 &&
            permissions['thepool_user_student_mine_export']
          "
          type="defult"
          size="small"
          round
          @click="exportList"
          >{{ $t("consult.导出") }}</el-button
        >
      </div>
      <div class="df_sb">
        <SelectTabletMenu
          type="studentMyTitle"
          @resetTableTitle="resetTableTitle"
        />
      </div>
    </div>
    <div class="tableBox">
      <Table
        ref="Table"
        :tableTitle="tableTitle"
        :tableData="tableData"
        :tableBtn="tableBtn"
        :showSelection="true"
        @playTab="playTab"
        @rowClick="rowClick"
      />
      <div class="df_sb palyTableBox" style="padding: 0">
        <PaginationInfo
          :paginationTotal="paginationTotal"
          :paginationSize="pagination['pageSize']"
        />
        <Pagination
          :showPageSizes="true"
          :total="paginationTotal"
          :pagination="pagination"
          @handleCurrentChange="handleCurrentChange"
          @handleSizeChange="handleSizeChange"
        />
      </div>
    </div>
    <!-- 批量导入 -->
    <BatchUpdload
      v-if="showUpload"
      ref="BatchUpdload"
      :showUpload="showUpload"
      @importList="importList"
      @closeModal="closeModal"
    />
    <!-- 新增学生 -->
    <AddStudent ref="AddStudent" @initData="getList" @closeModal="closeModal" />
    <!-- 批量编辑学生 -->
    <BatchEditstudent
      ref="BatchEditstudent"
      @initData="getList"
      @closeModal="closeModal"
    />
    <!-- 入学通知模板 -->
    <AdmissionNotice
      v-if="showAdmissionNotice"
      :show="showAdmissionNotice"
      :studentIds="studentIds"
      @changeModal="closeModal"
      @initData="getList"
    />
    <!-- 改变状态 -->
    <changeStatus
      ref="changeStatus"
      v-if="showchangeStatus"
      :showchangeStatus="showchangeStatus"
      :studentIds="studentIds"
      :isMultiple="true"
      :currentClueType="studentStatus"
      @changeModal="closeModal"
      @initData="getList"
    />
    <!-- 批量导出校验错误信息 -->
    <errorInfo ref="errorInfo" />
    <SelectSchool ref="SelectSchool" @exportStudentList="exportList" />
    <ErrorTable ref="ErrorTable" />
    <UpgradeTable ref="UpgradeTable" :isMine="true" />
    <SaveRequestParam
      ref="SaveRequestParam"
      @saveRequestParam="addRequestParam"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getMyStudentList,
  delStudent,
  batchStudent,
  exportMyStudentList,
  downloadStudentTemplate,
} from "@/api/consult/student.js";
import {
  getRequestParamList,
  addRequestParam,
  delRequestParam,
} from "@/api/consult/common.js";
import { download } from "@/util/download.js";
import { consult } from "@/const/consult/index.js";
import StatusItem from "@/components/thepoolcommon/StatusItem.vue";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import Table from "@/components/thepoolcommon/Table.vue";
import BatchUpdload from "@/page/thepool/modal/batchstudentupdload.vue";
import AddStudent from "@/page/thepool/modal/addstudent.vue";
import BatchEditstudent from "@/page/thepool/modal/batcheditstudent.vue";
import AdmissionNotice from "@/page/thepool/consult/modal/admissionNotice.vue";
import changeStatus from "@/page/thepool/consult/modal/changestatus.vue";
import errorInfo from "@/page/thepool/modal/errorinfo.vue";
import SelectSchool from "@/page/thepool/consult/modal/selectschool.vue";
import ErrorTable from "@/page/thepool/modal/errorinfo.vue";
import UpgradeTable from "@/page/thepool/modal/upgradeTable.vue";
import SaveRequestParam from "@/page/thepool/modal/saveRequestParam.vue";
import SelectTabletMenu from "@/components/common/pooldictselect/selecttabletmenu.vue";
export default {
  name: "TestUniWel",
  components: {
    StatusItem,
    Pagination,
    Table,
    PaginationInfo,
    BatchUpdload,
    AddStudent,
    BatchEditstudent,
    AdmissionNotice,
    changeStatus,
    errorInfo,
    SelectSchool,
    ErrorTable,
    UpgradeTable,
    SaveRequestParam,
    SelectTabletMenu,
  },
  data() {
    return {
      consult: consult,
      showUpload: false,
      statusList: consult["enrolledStatusMyList"],
      enrolledStatus: consult["enrolledStatus"],
      currentstatus: "0",
      tableTitle: consult["studentTitle"],
      sexList: consult["sexList"],
      tableData: [],
      tableBtn: [],
      pagination: {
        pageSize: 10,
        pageNum: 1,
        status: ["4"],
      },
      paginationTotal: 0,
      searchData: {},
      searchFrom: {
        keyword: "",
        applySchools: [],
        enrollLevels: [],
        directions: [],
        schools: [],
        createdTime: [],
      },
      enrollLevelList: [],
      directionsList: [],
      showAdmissionNotice: false,
      studentIds: [],
      showchangeStatus: false,
      studentStatus: "",
      searchRequestParamId: null,
      requestList: [],
      submitting: false,
    };
  },
  computed: {
    ...mapGetters([
      "dictionary",
      "i18nlocel",
      "permissions",
      "dictpermissions",
      "pooldictionary",
      "pooldictpermissions",
    ]),
  },

  created() {
    this.resetTableTitle();
    this.tableBtn = this.gettableBtn(this.statusList[0].btn);
    this.initRequestParam();
  },

  watch: {
    i18nlocel() {
      this.resetData();
    },
  },
  mounted() {
    this.wathKeyDowm();
  },
  beforeDestroy() {
    this.removeKeyDowm();
  },
  activated() {
    this.wathKeyDowm();
    this.getList();
  },
  methods: {
    // 监听回车事件
    wathKeyDowm() {
      // 添加全局回车事件监听
      document.addEventListener("keydown", this.handleKeyDown);
      // 监听路由变化
      this.routeChange = this.$router.afterEach(() => {
        // 路由跳转后移除事件监听器
        document.removeEventListener("keydown", this.handleKeyDown);
      });
    },
    removeKeyDowm() {
      // 移除全局回车事件监听
      document.removeEventListener("keydown", this.handleKeyDown);
      // 移除路由监听器
      if (this.routeChange) {
        this.routeChange();
      }
    },
    // 处理键盘事件
    handleKeyDown(event) {
      // 监听回车键
      if (event.key === "Enter") {
        // 调用搜索方法
        this.search();
      }
    },
    resetTableTitle() {
      let thePool_LocalCache = this.$store.getters.thePool_LocalCache;
      if (thePool_LocalCache["studentTitle"]) {
        this.tableTitle = thePool_LocalCache["studentTitle"].filter((item) => {
          return item["show"];
        });
      } else {
        this.tableTitle = consult["studentTitle"].filter((item) => {
          return item["show"];
        });
      }
      console.log("this.tableTitle", this.tableTitle);
    },
    getList() {
      getMyStudentList({
        ...this.pagination,
        ...this.searchData,
      }).then((res) => {
        console.log("res", res);
        if (res.data.success) {
          let { data, total } = res.data.data;
          this.tableData = data;
          this.paginationTotal = Number(total);
          this.resetData();
        }
      });
    },
    resetData() {
      this.tableData.map((item) => {
        item["enrollYear"] = item["enrollYear"]
          ? `${item["enrollYear"]}-${item["enrollYear"] + 1}`
          : "--";
        item["sexlabel"] = this.$getListLabel(this.sexList, item.sex);
        item["statusLabel"] = this.$getListLabel(
          this.enrolledStatus,
          item.status
        );
        item["isDropoutLabel"] = this.$getListLabel(
          consult["yesOrno"],
          String(item.isDropout)
        );
        if (item.applySchool) {
          item["applySchoolLabel"] = this.$getListLabel(
            this.pooldictionary,
            item.applySchool
          );
          item["enrollLevelLabel"] = this.getDataLabel(
            item.applySchool,
            "enquiry_enroll_level",
            item.enrollLevel
          );
          item["enrollLevelInLabel"] = this.getDataLabel(
            item.applySchool,
            "enquiry_enroll_level",
            item.enrollLevelIn
          );
          item["directionLabel"] = this.getDataLabel(
            item.applySchool,
            "enquiry_direction",
            item.direction
          );
          item["paySubjectLabel"] = this.getDataLabel(
            item.applySchool,
            "enquiry_pay_subject",
            item.paySubject
          );
        } else {
          item["enrollLevelLabel"] = this.$getListLabel(
            this.dictionary["enquiry_enroll_level"],
            item.enrollLevel
          );
          item["enrollLevelInLabel"] = this.$getListLabel(
            this.dictionary["enquiry_enroll_level"],
            item.enrollLevelIn
          );
          item["directionLabel"] = this.$getListLabel(
            this.dictionary["enquiry_direction"],
            item.direction
          );
          item["paySubjectLabel"] = this.$getListLabel(
            this.dictionary["enquiry_pay_subject"],
            item.paySubject
          );
        }
      });
    },
    // 导入用户
    importList(data) {
      // 防止重复提交
      if (this.submitting) {
        return;
      }

      // 设置提交中状态
      this.submitting = true;
      batchStudent(data)
        .then((res) => {
          console.log("res", res);
          this.submitting = false;
          if (res.status == 200) {
            this.showUpload = false;
            let { errList, failCount, successCount } = res.data.data;
            if (failCount > 0) {
              this.$refs.ErrorTable.show(res.data.data);
            }
            if (successCount > 0) {
              this.$message.success(this.$t("consult.成功"));
              this.showUpload = false;
              this.getList();
            }
            if (failCount == 0 && successCount == 0) {
              this.$message.success(this.$t("consult.请至少添加一条数据"));
            }
          }
          //  else {
          //   if (res.data.code == "601") {
          //     this.showUpload = false;
          //     this.$refs["errorInfo"].setData(res.data.data);
          //     this.getList();
          //   } else {
          //     this.$message.error(this.$t("consult.失败"));
          //     this.showUpload = false;
          //     this.getList();
          //   }
          // }
        })
        .catch((error) => {
          this.submitting = false;
          //   if (error.response.status === 600) {
          //     download(error.response.data, error.response.headers["content-disposition"]);
          //     this.$message.warning(
          //       "数据填写有误！请根据下载的错误说明，修改文件后重新上传"
          //     );
          //   }
        })
        .finally(() => {
          // 无论成功或失败，都重置提交状态
          this.submitting = false;
        });
    },
    exportBySchool(type) {
      this.$refs["SelectSchool"].innerVisible = true;
      this.$refs["SelectSchool"].type = type;
    },
    // 导出
    exportList() {
      let searchData = this.getSearchData();
      let data = {
        ...this.pagination,
        ...searchData,
      };
      delete data["pageSize"];
      delete data["pageNum"];
      exportMyStudentList(data).then((res) => {
        console.log("res", res);
        this.$message.success(this.$t("consult.成功"));
        download(res.data, res.headers["content-disposition"]);
      });
    },
    // 下载模板
    downloadTemplate() {
      downloadStudentTemplate().then((res) => {
        console.log("res", res);
        this.$message.success(this.$t("consult.成功"));
        download(res.data, res.headers["content-disposition"]);
      });
    },
    // 表格操作
    playTab(name, item, scope) {
      switch (name) {
        case "look":
          this.$router.push("/student/detail?id=" + item.id + "&type=1");
          break;
        case "edit":
          this.$refs["AddStudent"].getStudentDetail(item.id);
          break;
        case "del":
          delStudent(item.id).then((res) => {
            this.$message.success(this.$t("consult.成功"));
            this.getList();
          });
          break;
        case "enter":
          this.studentStatus = "enter";
          this.showchangeStatus = true;
          this.$nextTick(() => {
            this.$refs["changeStatus"].setStudentDetail([item]);
          });
          break;
        case "leaving":
          this.studentStatus = "leaving";
          this.studentIds = [item.id];
          this.showchangeStatus = true;
          break;
        case "apply":
          this.studentStatus = "apply";
          this.showchangeStatus = true;
          this.$nextTick(() => {
            this.$refs["changeStatus"].setStudentDetail([item]);
          });
          break;
        case "graduation":
          this.studentStatus = "graduation";
          this.studentIds = [item.id];
          this.showchangeStatus = true;

          break;
      }
    },
    handleBtns(type) {
      let batchStuentList = [];
      let selectionId = this.$refs["Table"].selectionId;
      if (selectionId == 0) {
        this.$message.error(this.$t("consult.请选择"));
      } else {
        batchStuentList = this.tableData.filter((item) => {
          return selectionId.includes(item.id);
        });
        switch (type) {
          case "batchEditstudent":
            let applySchoolIds = [];
            this.tableData.map((item) => {
              if (
                selectionId.includes(item.id) &&
                !applySchoolIds.includes(item.applySchool)
              ) {
                applySchoolIds.push(item.applySchool);
              }
            });
            if (applySchoolIds.length > 1) {
              this.$message.error(this.$t("consult.批量编辑不支持跨校区操作"));
            } else {
              this.$refs["BatchEditstudent"].getStudentDetail(selectionId);
            }
            break;
          case "showAdmissionNotice":
            this.studentIds = selectionId;
            this.showAdmissionNotice = true;
            break;
          case "batchEnrollment":
            this.studentStatus = "enter";
            this.studentIds = selectionId;
            this.showchangeStatus = true;
            this.$nextTick(() => {
              this.$refs["changeStatus"].setStudentDetail(batchStuentList);
            });
            break;
          case "batchLeaving":
            this.studentStatus = "leaving";
            this.studentIds = selectionId;
            this.showchangeStatus = true;
            break;
          case "batchApply":
            this.studentStatus = "apply";
            this.studentIds = selectionId;
            this.showchangeStatus = true;
            this.$nextTick(() => {
              this.$refs["changeStatus"].setStudentDetail(batchStuentList);
            });
            break;
          case "batchGraduation":
            this.studentStatus = "graduation";
            this.studentIds = selectionId;
            this.showchangeStatus = true;
            break;
        }
      }
    },
    rowClick(row, column, event) {
      console.log("rowClick", row);
      this.$router.push("/student/detail?id=" + row.id + "&type=1");
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["pageNum"] = page;
      this.getList();
    },
    handleSizeChange(size) {
      this.pagination["pageNum"] = 1;
      this.pagination["pageSize"] = size;
      this.getList();
    },
    // 搜索
    async search() {
      this.searchData = {};
      this.searchData = this.getSearchData();
      this.pagination["pageNum"] = 1;
      this.getList();
    },
    getSearchData() {
      let searchData = {};
      searchData["applySchools"] = this.searchFrom["applySchools"];
      searchData["enrollLevels"] = this.searchFrom["enrollLevels"];
      searchData["directions"] = this.searchFrom["directions"];
      searchData["schools"] = this.searchFrom["schools"];
      searchData["keyword"] = this.searchFrom["keyword"];
      searchData["isDropout"] = this.searchFrom["isDropout"];
      if (this.pagination["status"]) {
        searchData["status"] = this.pagination["status"];
      }
      if (this.currentstatus == "-1") {
        searchData["status"] = this.searchFrom["status"]
          ? this.searchFrom["status"]
          : [];
      }
      if (
        this.searchFrom["createdTime"] &&
        this.searchFrom["createdTime"].length > 0
      ) {
        searchData["createTimeBegin"] = this.searchFrom["createdTime"][0];
        searchData["createTimeEnd"] = this.searchFrom["createdTime"][1];
      }
      return searchData;
    },
    clear() {
      this.searchData = {};
      if (this.pooldictpermissions.length == 1) {
        this.searchFrom = {
          ...this.searchFrom,
          enrollLevels: [],
          directions: [],
          keyword: "",
          createdTime: [],
        };
      } else {
        this.searchFrom = {
          applySchools: [],
          enrollLevels: [],
          directions: [],
          schools: [],
          keyword: "",
          createdTime: [],
        };
        this.enrollLevelList = [];
        this.directionsList = [];
      }
      this.search();
    },
    changeStasus(item, index) {
      this.$refs["Table"].clearSelection();
      if (this.searchFrom["status"]) {
        delete this.searchFrom["status"];
      }
      if (this.searchData["status"]) {
        delete this.searchData["status"];
      }
      this.currentstatus = item.type;
      this.tableBtn = this.gettableBtn(item.btn);
      this.pagination["pageNum"] = 1;
      if (item.type == "-1") {
        delete this.pagination["status"];
      } else {
        this.pagination["status"] = [item.type];
      }
      this.getList();
    },
    gettableBtn(data) {
      let tableBtn = data.filter((res) => {
        return (
          res["permissions"] == "look" || this.permissions[res["permissions"]]
        );
      });
      return tableBtn;
    },
    getDataLabel(pid, type, cid) {
      let str = "";
      this.pooldictionary.map((item) => {
        if (item.value == pid) {
          if (item["child"][type]) {
            let data = item["child"][type];
            data.map((c) => {
              if (c.value == cid) {
                str = this.i18nlocel == "en" ? c.enLabel : c.label;
              }
            });
          }
        }
      });
      return str;
    },
    getDatastr(id, data) {
      // console.log("getDataLabel", id, data);
      let str = "";
      data.map((item) => {
        if (item.value == id) {
          str = this.i18nlocel == "en" ? item.enLabel : item.label;
        }
      });
      return str;
    },
    batchPlayTab() {
      let selectionId = this.$refs["Table"].selectionId;
      if (selectionId == 0) {
        this.$message.error(this.$t("consult.请选择"));
      } else {
      }
    },
    addStudent() {
      this.$refs["AddStudent"].initeForm();
    },
    closeModal(type) {
      this.showUpload = type;
      this.showAdmissionNotice = type;
      this.showchangeStatus = type;
      this.$refs["Table"].clearSelection();
    },
    changeSchool(e) {
      // console.log("changeSchool", e);
      if (e.length == 0) {
        this.enrollLevelList = [];
        this.directionsList = [];
        this.channelsList = [];
        this.followTagsList = [];
        this.searchFrom.applySchools = [];
        this.searchFrom.enrollLevels = [];
        this.searchFrom.directions = [];
        return;
      }
      let enrollLevelList = [];
      let directionsList = [];
      let enrollLevelIds = [];
      let directionsIds = [];
      this.enrollLevelList = [];
      this.directionsList = [];
      console.log("this.pooldictpermissions", this.pooldictpermissions);
      let pooldictpermissions = _.cloneDeep(this.pooldictpermissions);
      pooldictpermissions.map((item) => {
        if (e.includes(item.value)) {
          if (item["child"]["enquiry_enroll_level"]) {
            item["child"]["enquiry_enroll_level"].map((level) => {
              if (enrollLevelIds.includes(level.value)) {
                // console.log("enrollLevelList", enrollLevelList);
                enrollLevelList.map((enrollLevel) => {
                  if (level.value == enrollLevel.value) {
                    let label = enrollLevel["label"].split(",");
                    let enLabel = enrollLevel["enLabel"].split(",");
                    if (!label.includes(level["label"])) {
                      label = [...label, ...level["label"].split(",")];
                      enrollLevel["label"] = String([...new Set(label)]);
                    }
                    if (!enLabel.includes(level["enLabel"])) {
                      enLabel = [...enLabel, ...level["enLabel"].split(",")];
                      enrollLevel["enLabel"] = String([...new Set(enLabel)]);
                    }
                  }
                });
              } else {
                enrollLevelIds.push(level.value);
                enrollLevelList.push(level);
              }
            });
          }
          if (item["child"]["enquiry_direction"]) {
            item["child"]["enquiry_direction"].map((direction) => {
              if (directionsIds.includes(direction.value)) {
                // console.log("directionsList", directionsList);
                directionsList.map((d) => {
                  if (direction.value == d.value) {
                    let label = d["label"].split(",");
                    let enLabel = d["enLabel"].split(",");
                    if (!label.includes(direction["label"])) {
                      label = [...label, ...direction["label"].split(",")];
                      d["label"] = String([...new Set(label)]);
                    }
                    if (!enLabel.includes(direction["enLabel"])) {
                      enLabel = [
                        ...enLabel,
                        ...direction["enLabel"].split(","),
                      ];
                      d["enLabel"] = String([...new Set(enLabel)]);
                    }
                  }
                });
              } else {
                directionsIds.push(direction.value);
                directionsList.push(direction);
              }
            });
          }
        }
      });
      this.enrollLevelList = enrollLevelList;
      this.directionsList = directionsList;
    },
    showUpgrade() {
      this.$refs.UpgradeTable.show(this.searchFrom);
    },
    // 获取查询条件
    setRequestParam() {
      if (this.pooldictpermissions.length > 0) {
        this.pooldictpermissions.map((item) => {
          this.searchFrom["schools"].push(item["value"]);
        });
        this.searchData["schools"] = this.searchFrom["schools"];
      }

      if (this.pooldictpermissions.length == 1) {
        let applySchoolsId = this.pooldictpermissions[0].value;
        this.searchFrom["applySchools"] = [applySchoolsId];
        this.searchData["applySchools"] = this.searchFrom["applySchools"];
        this.changeSchool(applySchoolsId);
      }

      this.getList();
    },
    saveRequestParam() {
      this.requestParam = this.getSearchData();
      this.$refs["SaveRequestParam"].show();
    },
    // 保存查询条件
    async addRequestParam(name) {
      let data = await addRequestParam({
        description: name,
        type: "6",
        requestParam: JSON.stringify(this.requestParam),
      });
      this.$message.success(this.$t("consult.成功"));
      this.requestList = await getRequestParamList({ type: "6" });
    },
    async initRequestParam() {
      this.requestList = await getRequestParamList({ type: "6" });

      if (this.requestList.length > 0) {
        this.selectCurrentRequestParam(this.requestList[0]);
      } else {
        this.setRequestParam();
      }
    },
    async delRequestParam(id) {
      await delRequestParam({
        ids: [id],
      });
      this.$message.success(this.$t("consult.成功"));
      this.requestList = await getRequestParamList({ type: "6" });
    },
    selectCurrentRequestParam(item) {
      let { id, requestParam } = item;
      this.searchRequestParamId = id;
      let data = JSON.parse(requestParam);
      this.searchData = {
        ...data,
      };

      this.changeSchool(data.applySchools || []);
      this.$nextTick(() => {
        this.searchFrom = {
          keyword: data.keyword || "",
          schools: data.schools || [],
          applySchools: data.applySchools || [],
          enrollLevels: data.enrollLevels || [],
          directions: data.directions || [],
          createdTime:
            data.createTimeBegin && data.createTimeEnd
              ? [data.createTimeBegin, data.createTimeEnd]
              : [],
        };
        this.getList();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-range__close-icon {
  display: none;
}
.searchFrom {
  // justify-content: space-between;
}
.df_align_center {
  flex-wrap: wrap;
}
</style>
