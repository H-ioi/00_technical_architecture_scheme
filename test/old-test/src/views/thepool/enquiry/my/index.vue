<template>
  <div class="thepool_page">
    <el-scrollbar style="height: 100%">
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
          :rules="searchRules"
        >
          <div class="df_w">
            <el-form-item
              v-if="currentstatus == '-1'"
              :label="$t('consult.跟进状态')"
              style="width: 214px"
            >
              <el-select
                multiple
                v-model="pagination.followStatus"
                :placeholder="$t('consult.请选择')"
                clearable
                @clear="search"
              >
                <el-option
                  v-for="item in filterStatusList"
                  :key="item.type"
                  :label="$t('consult')[item.name]"
                  :value="item.type"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('consult.关键词')" style="width: 214px">
              <el-input
                v-model="searchFrom.keyword"
                :placeholder="$t('consult.请输入')"
                clearable
                @clear="search"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('consult.归属校区')" style="width: 214px">
              <el-select
                multiple
                v-model="searchFrom.schools"
                :placeholder="$t('consult.请选择')"
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
            <el-form-item :label="$t('consult.校区')" style="width: 214px">
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
              v-if="followTagsList.length > 0"
              :label="$t('consult.跟进标签')"
              style="width: 214px"
            >
              <el-select
                multiple
                v-model="searchFrom.followTags"
                :placeholder="$t('consult.请选择')"
                clearable
                @clear="search"
              >
                <el-option
                  v-for="item in followTagsList"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="channelsList.length > 0"
              :label="$t('consult.渠道')"
              style="width: 214px"
            >
              <SelectChannle
                ref="SelectChannle"
                :options="channelsList"
                @setChannel="setChannel"
              />
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
            <el-form-item :label="$t('consult.更新时间')" style="width: 214px">
              <el-date-picker
                style="width: 100%"
                v-model="searchFrom.updateTime"
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
            <el-form-item :label="$t('consult.排序方式')" style="width: 214px">
              <el-select
                v-model="searchFrom.orderBy"
                :placeholder="$t('consult.请选择')"
                clearable
                @clear="search"
              >
                <el-option
                  v-for="item in sortModeList"
                  :key="item.value"
                  :label="$t('consult')[item['label']]"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('consult.排序')" style="width: 214px">
              <el-select
                v-model="searchFrom.order"
                :placeholder="$t('consult.请选择')"
                clearable
                @clear="search"
              >
                <el-option
                  v-for="item in upOrdown"
                  :key="item.value"
                  :label="$t('consult')[item['label']]"
                  :value="item.value"
                ></el-option>
              </el-select>
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
          </div>
        </el-form>
      </div>
      <div class="df_sb palyTableBox" style="padding-top: 0">
        <div class="df_sb">
          <div class="df_sb">
            <el-button
              v-if="permissions['enquiry_mine_add']"
              type="primary"
              size="small"
              round
              @click="showAdd = true"
              >{{ $t("consult.新增咨询") }}</el-button
            >
            <el-button
              v-if="permissions['enquiry_mine_add']"
              type="primary"
              size="small"
              round
              @click="showAddClue = true"
              >{{ $t("consult.新增线索") }}</el-button
            >
            <el-button
              v-if="permissions['enquiry_mine_follower_add']"
              type="primary"
              size="small"
              round
              @click="addAssigneds('showAddAssigned')"
              >{{ $t("consult.添加跟进人") }}</el-button
            >
            <el-button
              v-if="tableData.length > 0 && permissions['enquiry_mine_export']"
              type="defult"
              size="small"
              round
              @click="exportMyList"
              >{{ $t("consult.导出线索") }}</el-button
            >
            <el-button
              v-if="tableData.length > 0 && permissions['enquiry_mine_export']"
              type="defult"
              size="small"
              round
              @click="exportHybridMyList"
              >{{ $t("consult.导出咨询") }}</el-button
            >
            <el-button
              v-if="permissions['enquiry_mine_import']"
              type="defult"
              size="small"
              round
              @click="showUpdate = true"
              >{{ $t("consult.导入线索") }}</el-button
            >
            <el-button
              v-if="permissions['enquiry_all_import']"
              type="defult"
              size="small"
              round
              @click="showUpdateHybrid = true"
              >{{ $t("consult.导入咨询") }}</el-button
            >

            <el-button
              type="defult"
              v-if="permissions['enquiry_mine_school_batch_edit']"
              size="small"
              round
              @click="addAssigneds('showBatchEditing')"
              >{{ $t("consult.批量编辑") }}</el-button
            >
            <el-button
              type="defult"
              v-if="
                ((currentstatus == '1' || currentstatus == '0') &&
                  permissions['enquiry_mine_status_batch_close']) ||
                (currentstatus == '2' &&
                  permissions['enquiry_status_batch_apply_close'])
              "
              size="small"
              round
              @click="batchPlayTab('close')"
              >{{ $t("consult.批量关闭") }}</el-button
            >
            <el-button
              type="defult"
              v-if="
                permissions['enquiry_mine_status_batch_active'] &&
                currentstatus == '4'
              "
              size="small"
              round
              @click="batchPlayTab('activate')"
              >{{ $t("consult.批量激活") }}</el-button
            >
            <el-button
              v-if="tableData.length > 0 && permissions['clue_mine_send_email']"
              type="defult"
              size="small"
              round
              @click="sendEmail"
              >{{ $t("consult.邮件发送") }}</el-button
            >
          </div>
        </div>
        <div class="df_sb">
          <SelectTabletMenu
            type="enquiryTableMy"
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
          @changeSelectedCount="changeSelectedCount"
        />
        <div class="df_sb" v-if="paginationTotal > 10">
          <div class="df_sb">
            <el-checkbox
              style="padding: 0 10px"
              class="checkbox"
              @change="changeSelectAll"
              v-model="isSelectAll"
              >{{ $t("consult.全选") }}</el-checkbox
            >
            <span v-if="selectedCount != 0" style="color: #999999"
              >{{ $t("consult.已选择") }}
              <span style="color: #ba8e62">{{ selectedCount }}</span>
              {{ $t("consult.条") }},</span
            >
            <span style="color: #999999">{{
              $t("consult.最多选择1000条")
            }}</span>
            <!-- <el-button type="primary" size="small" round @click="selectAll">{{
              $t("consult.全选")
            }}</el-button>
            <el-button type="defult" size="small" round @click="cancelSelectAll">{{
              $t("consult.取消全选")
            }}</el-button> -->
          </div>
          <div class="palyTableBox df_align_center" style="padding: 0">
            <PaginationInfo
              :paginationTotal="paginationTotal"
              style="margin-right: 20px"
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
      </div>
    </el-scrollbar>
    <!-- 新增线索 -->
    <addClue
      v-if="showAddClue"
      :showAdd="showAddClue"
      @changeModal="changeModal"
      @initData="initData"
    />
    <!-- 新增学生线索 -->
    <addStudent
      v-if="showAdd"
      :showAdd="showAdd"
      :isMine="true"
      @changeModal="changeModal"
      @initData="initData"
    />
    <!-- 改变状态 -->
    <changeStatus
      v-if="showchangeStatus"
      :showchangeStatus="showchangeStatus"
      :clueIds="clueIds"
      :isMultiple="isMultiple"
      :currentClueType="currentClueType"
      :currentClueId="currentClueId"
      :studentList="enterStudentList"
      @changeModal="changeModal"
      @initData="initData"
    />
    <addAssigned
      ref="addAssigned"
      v-if="showAddAssigned"
      :type="'add'"
      :showAddAssigned="showAddAssigned"
      :clueIds="clueIds"
      @changeModal="changeModal"
      @initData="initData"
    />
    <updateClue
      ref="updateClue"
      v-if="showUpdate"
      :showUpdate="showUpdate"
      :canDownload="permissions['enquiry_mine_template_download']"
      @closeModal="changeModal"
      @initData="initData"
      @showErrorData="showErrorData"
      @showErrList="showErrList"
    />
    <updateHybrid
      ref="updateHybrid"
      v-if="showUpdateHybrid"
      :showUpdate="showUpdateHybrid"
      :canDownload="permissions['enquiry_mine_template_download']"
      @closeModal="changeModal"
      @initData="initData"
      @showErrorData="showErrorData"
      @showErrList="showErrList"
    />
    <AdmissionNotice
      v-if="showAdmissionNotice"
      :show="showAdmissionNotice"
      :clueIds="clueIds"
      @changeModal="changeModal"
      @initData="initData"
    />
    <BatchEditing
      ref="BatchEditing"
      v-if="showBatchEditing"
      :showEditClue="showBatchEditing"
      :clueIds="clueIds"
      @changeModal="changeModal"
      @initData="initData"
    />
    <!-- 批量导出校验错误信息 -->
    <errorInfo ref="errorInfo" />
    <SelectSchool
      ref="SelectSchool"
      @exportMyList="exportMyList"
      @exportHybridMyList="exportHybridMyList"
    />
    <ErrorTable ref="ErrorTable" />
    <!-- 发送邮件 -->
    <sendemail ref="sendemail" :type="1" @cancelSelectAll="cancelSelectAll" />
    <!-- 保存筛选信息 -->
    <SaveRequestParam
      ref="SaveRequestParam"
      @saveRequestParam="addRequestParam"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import Table from "@/components/thepoolcommon/Table.vue";
import StatusItem from "@/components/thepoolcommon/StatusItem.vue";
import {
  getMyClueList,
  exportMyList,
  importList,
  downloadTemplate,
  exportHybridMyList,
  getMyClueIds,
} from "@/api/consult/index.js";
import {
  getRequestParamList,
  addRequestParam,
  delRequestParam,
  getDptUserList,
} from "@/api/consult/common.js";
import { download } from "@/util/download.js";
import { consult } from "@/const/consult/index.js";
import addClue from "@/page/thepool/consult/modal/addclue.vue";
import addStudent from "@/page/thepool/consult/modal/addstudent.vue";
import changeStatus from "@/page/thepool/consult/modal/changestatus.vue";
import addAssigned from "@/page/thepool/consult/modal/addAssigned.vue";
import updateClue from "@/page/thepool/consult/modal/updateclue.vue";
import updateHybrid from "@/page/thepool/consult/modal/updatehybrid.vue";
import AdmissionNotice from "@/page/thepool/consult/modal/admissionNotice.vue";
import BatchEditing from "@/page/thepool/consult/modal/batcheditclue.vue";
import CreatorTree from "@/components/commonConpents/UserTree";
import FollowerTree from "@/components/commonConpents/DeptUserTree";
import SelectChannle from "@/components/common/pooldictselect/selectchannlemultiple.vue";
import SelectTabletMenu from "@/components/common/pooldictselect/selecttabletmenu.vue";
import errorInfo from "@/page/thepool/modal/errorinfo.vue";
import SelectSchool from "@/page/thepool/consult/modal/selectschool.vue";
import ErrorTable from "@/page/thepool/modal/errorinfo.vue";
import sendemail from "@/page/thepool/email/modal/sendemail.vue";
import SaveRequestParam from "@/page/thepool/modal/saveRequestParam.vue";
export default {
  name: "TestUniWel",
  components: {
    Pagination,
    Table,
    PaginationInfo,
    StatusItem,
    addClue,
    addStudent,
    changeStatus,
    addAssigned,
    updateClue,
    updateHybrid,
    AdmissionNotice,
    BatchEditing,
    CreatorTree,
    FollowerTree,
    SelectChannle,
    SelectTabletMenu,
    errorInfo,
    SelectSchool,
    ErrorTable,
    sendemail,
    SaveRequestParam,
  },
  beforeRouteEnter(to, from, next) {
    if (from.path == "/loginisa") {
      let query = { ...from["query"] };
      delete query["path"];
      if (from["query"]["path"] && from["query"]["path"] != "/redirect") {
        setTimeout(() => {
          next((vm) => {
            vm.$nextTick(() => {
              vm.$router.push({
                path: from["query"]["path"],
                query: query,
              });
            });
          });
        }, 300);
      } else {
        next();
      }
    } else {
      next();
    }
  },
  data() {
    return {
      isMultiple: false,
      showBatchEditing: false,
      showAdmissionNotice: false,
      showAddClue: false,
      showAdd: false,
      showchangeStatus: false,
      currentClueType: "",
      currentClueId: "",
      pagination: {
        pageSize: 10,
        pageNum: 1,
        followStatus: ["0", "1"],
      },
      paginationTotal: 0,
      currentUserId: "",
      searchFrom: {
        keyword: "",
        schools: [],
        applySchools: [],
        enrollLevels: [],
        directions: [],
        createdTime: [],
        updateTime: [],
        channels: [],
        channelChildOnes: [],
        followTags: [],
        orderBy: "orderByCreateTime",
      },
      searchRules: {},
      searchData: { orderBy: "orderByCreateTime" },
      // statusList: [],
      statusList: consult["statusMineList"],
      filterStatusList: consult["filterStatusList"],
      tableTitle: consult["selectTableTitle"],
      sortModeList: consult["sortMode"],
      upOrdown: consult["upOrdown"],
      currentstatus: "1",
      tableData: [],
      tableBtn: [],
      spaceType: [],
      showAddAssigned: false,
      clueIds: [],
      showUpdate: false,
      showUpdateHybrid: false,
      enrollLevelList: [],
      directionsList: [],
      channelsList: [],
      followTagsList: [],
      enterStudentList: [],
      isSelectAll: false,
      selectedCount: 0,
      searchRequestParamId: null,
      requestList: [],
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
    // this.getstatusList();
    this.tableBtn = this.gettableBtn(this.statusList[0].btn);
    this.schoolList = this.pooldictpermissions;
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
    this.getMyClueList();
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
    resetRouteEnter() {},
    showErrorData(data) {
      console.log("showErrorData", data);
      this.$refs["errorInfo"].setData(data);
    },
    resetTableTitle() {
      let thePool_LocalCache = this.$store.getters.thePool_LocalCache;
      if (thePool_LocalCache["enquiryTableMy"]) {
        this.tableTitle = thePool_LocalCache["enquiryTableMy"].filter(
          (item) => {
            return item["show"];
          }
        );
      } else {
        this.tableTitle = consult["selectTableTitle"].filter((item) => {
          return item["show"];
        });
      }
    },
    getstatusList() {
      this.statusList = [];
      consult["statusMineList"].map((item) => {
        let obj = {
          ...item,
          name: this.$t("consult")[item["name"]],
        };
        this.statusList.push(obj);
      });
    },
    getMyClueList() {
      getMyClueList({
        ...this.pagination,
        ...this.searchData,
      }).then((res) => {
        console.log("res", res);
        if (res.data.success) {
          let { data, total } = res.data.data;
          this.tableData = data || [];
          this.paginationTotal = Number(total);
          this.resetData();
        }
      });
    },
    resetData() {
      this.tableData.map((item) => {
        item["students"] = item["students"] || [];
        if (item.applySchool) {
          item["applySchoolLabel"] = this.$getListLabel(
            this.pooldictionary,
            item.applySchool
          );
          item["followTags"] = this.getDataLabel(
            item.applySchool,
            "enquiry_follow_tags",
            item.followTags
          );
          item["channellLabel"] = this.getDataLabel(
            item.applySchool,
            "enquiry_channel",
            item.channel
          );
          let channelChildOneLabel = this.getDataLabel(
            item.applySchool,
            "enquiry_channel_child_one",
            item.channelChildOne
          );
          item["channellLabel"] =
            item["channellLabel"] +
            (channelChildOneLabel == "" ? "" : "/" + channelChildOneLabel);
        } else {
          item["followTags"] = this.$getListLabel(
            this.dictionary["enquiry_follow_tags"],
            item.followTags
          );
          item["channellLabel"] = this.$getListLabel(
            this.dictionary["enquiry_channel"],
            item.channel
          );
          if (item.channelChildOne) {
            item["channellLabel"] =
              item["channellLabel"] +
              "/" +
              this.$getListLabel(
                this.dictionary["enquiry_channel_child_one"],
                item.channelChildOne
              );
          }
        }
        item["atSchoolLabel"] = this.setAtSchool(item);
        item["directionLabel"] = this.setDirection(item);
        item["enrollLevelLabel"] = this.setEnrollLevel(item);
        item["enrollLevelInLabel"] = this.setEnrollLevelIn(item);
      });
    },
    addAssigneds(type) {
      console.log("addAssigneds", type);
      let selectionId = this.$refs["Table"].selectionId;
      if (selectionId == 0) {
        this.$message.error(this.$t("consult.请选择咨询信息"));
      } else {
        this.clueIds = selectionId;
        if (type == "showAddAssigned") {
          this.showAddAssigned = true;
        }
        if (type == "showAdmissionNotice") {
          this.showAdmissionNotice = true;
        }
        if (type == "showBatchEditing") {
          let applySchool = [];
          this.tableData.map((item) => {
            if (
              this.clueIds.includes(item.id) &&
              !applySchool.includes(item.applySchool)
            ) {
              applySchool.push(item.applySchool);
            }
          });
          console.log("newApplySchool", applySchool);
          if (applySchool.length == 1) {
            this.showBatchEditing = true;
          } else {
            this.$message.error(this.$t("consult.批量编辑不支持跨校区操作"));
          }
        }
      }
    },
    // 导入用户
    importList(data) {
      importList(data).then((res) => {
        console.log("res", res);
        if (res.status == 200) {
          let { errList, failCount, successCount } = res.data.data;
          if (failCount > 0) {
            this.$refs.ErrorTable.show(res.data.data);
          }
          if (successCount > 0) {
            this.$message.success(this.$t("consult.成功"));
            this.getMyClueList();
          }
          if (failCount == 0 && successCount == 0) {
            this.$message.success(this.$t("consult.请至少添加一条数据"));
          }
        }
      });
    },
    showErrList(data) {
      let { errList, failCount, successCount } = data;
      if (failCount > 0) {
        this.$refs.ErrorTable.show(data);
      }
      if (successCount > 0) {
        this.$message.success(this.$t("consult.成功"));
        // this.getMyClueList();
      }
      if (failCount == 0 && successCount == 0) {
        this.$message.success(this.$t("consult.请至少添加一条数据"));
      }
    },
    exportBySchool(type) {
      this.$refs["SelectSchool"].innerVisible = true;
      this.$refs["SelectSchool"].type = type;
    },
    // 导出
    exportMyList() {
      let searchData = this.getSearchData();
      let data = {
        ...this.pagination,
        ...searchData,
      };
      delete data["pageSize"];
      delete data["pageNum"];
      exportMyList(data).then((res) => {
        console.log("res", res);
        this.$message.success(this.$t("consult.成功"));
        download(res.data, res.headers["content-disposition"]);
      });
    },
    // 导出
    exportHybridMyList() {
      let searchData = this.getSearchData();
      let data = {
        ...this.pagination,
        ...searchData,
      };
      delete data["pageSize"];
      delete data["pageNum"];
      exportHybridMyList(data).then((res) => {
        console.log("res", res);
        this.$message.success(this.$t("consult.成功"));
        download(res.data, res.headers["content-disposition"]);
      });
    },
    // 导出
    downloadTemplate() {
      downloadTemplate().then((res) => {
        console.log("res", res);
        this.$message.success(this.$t("consult.成功"));
        download(res.data, res.headers["content-disposition"]);
      });
    },
    // 下载模板
    downloadUserExcel() {
      downloadUserExcel().then((res) => {
        console.log("res", res);
        this.$message.success(this.$t("consult.成功"));
        download(res.data, res.headers["content-disposition"]);
      });
    },
    // 表格操作
    playTab(name, item, scope) {
      this.currentClueId = item.id;
      this.isMultiple = false;
      switch (name) {
        case "look":
          this.rowClick(item);
          break;
        case "close":
          this.currentClueType = "close";
          this.showchangeStatus = true;
          break;
        case "enter":
          this.currentClueType = "enter";
          this.enterStudentList = item["students"].filter((item) => {
            return item["status"] == 1 || item["status"] == 3;
          });
          if (this.enterStudentList.length == 0) {
            this.$message.warning("该线索无可入学学生");
          } else {
            this.showchangeStatus = true;
          }
          break;
        case "activate":
          this.currentClueType = "activate";
          this.showchangeStatus = true;
          break;
        case "apply":
          this.currentClueType = "apply";
          this.enterStudentList = item["students"].filter((item) => {
            return item["status"] == 0;
          });
          if (this.enterStudentList.length == 0) {
            this.$message.warning("该线索无可申请学生");
          } else {
            this.showchangeStatus = true;
          }
          break;
        case "leaving":
          this.currentClueType = "leaving";
          this.enterStudentList = item["students"].filter((item) => {
            return item["status"] == 2;
          });
          if (this.enterStudentList.length == 0) {
            this.$message.warning("该线索无可离校学生");
          } else {
            this.showchangeStatus = true;
          }
          break;
      }
    },
    rowClick(row) {
      //   this.$router.push("/thepool/enquiry/detail?clueId=" + row.id + "&type=2");
      const routeUrl = this.$router.resolve({
        path: "/thepool/enquiry/detail",
        query: {
          clueId: row.id,
          type: "2",
        },
      });
      window.open(routeUrl.href, "_blank");
    },
    // 上传
    beforeUpload(file) {
      console.log("file", file);
      let obj = new FormData();
      obj.append("file", file);
      this.importList(obj);
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["pageNum"] = page;
      this.getMyClueList();
    },
    handleSizeChange(size) {
      this.pagination["pageNum"] = 1;
      this.pagination["pageSize"] = size;
      this.getMyClueList();
    },
    // 搜索
    async search() {
      this.searchData = {};
      this.searchData = this.getSearchData();
      this.pagination["pageNum"] = 1;
      this.getMyClueList();
    },
    getSearchData() {
      let searchData = {};
      searchData["keyword"] = this.searchFrom["keyword"];
      searchData["orderBy"] = this.searchFrom["orderBy"];
      searchData["order"] = this.searchFrom["order"];
      searchData["enrollLevels"] = this.searchFrom["enrollLevels"];
      searchData["directions"] = this.searchFrom["directions"];
      searchData["schools"] = this.searchFrom["schools"];
      searchData["applySchools"] = this.searchFrom["applySchools"];
      searchData["followTags"] = this.searchFrom["followTags"];
      searchData["channels"] = this.searchFrom["channels"];
      searchData["channelChildOnes"] = this.searchFrom["channelChildOnes"];
      if (
        this.searchFrom["createdTime"] &&
        this.searchFrom["createdTime"].length > 0
      ) {
        searchData["createTimeBegin"] = this.searchFrom["createdTime"][0];
        searchData["createTimeEnd"] = this.searchFrom["createdTime"][1];
      }
      if (
        this.searchFrom["updateTime"] &&
        this.searchFrom["updateTime"].length > 0
      ) {
        searchData["updateTimeBegin"] = this.searchFrom["updateTime"][0];
        searchData["updateTimeEnd"] = this.searchFrom["updateTime"][1];
      }
      return searchData;
    },
    // 清除搜索
    clear() {
      if (this.pooldictpermissions.length == 1) {
        this.searchFrom = {
          ...this.searchFrom,
          keyword: "",
          directions: [],
          enrollLevels: [],
          createdTime: [],
          updateTime: [],
          channels: [],
          channelChildOnes: [],
          creatorIds: [],
          followerIds: [],
          followTags: [],
          orderBy: "orderByCreateTime",
          order: "",
        };
      } else {
        this.searchFrom = {
          keyword: "",
          directions: [],
          enrollLevels: [],
          createdTime: [],
          updateTime: [],
          schools: [],
          applySchools: [],
          channels: [],
          channelChildOnes: [],
          creatorIds: [],
          followerIds: [],
          followTags: [],
          orderBy: "orderByCreateTime",
          order: "",
        };
        this.enrollLevelList = [];
        this.directionsList = [];
        this.followTagsList = [];
      }
      this.searchData = { orderBy: "orderByCreateTime" };
      this.pagination["pageNum"] = 1;
      if (this.currentstatus == "-1") {
        this.pagination["followStatus"] = [];
      }
      if (this.channelsList.length > 0) {
        this.channelsList = [];
        this.$refs["SelectChannle"].clear();
      } else {
        this.channelsList = [];
      }

      this.getMyClueList();
    },
    gettableBtn(data) {
      let tableBtn = data.filter((res) => {
        return (
          res["permissions"] == "look" || this.permissions[res["permissions"]]
        );
      });
      return tableBtn;
    },
    // 状态切换
    changeStasus(item, index) {
      this.isSelectAll = false;
      this.$refs["Table"].clearSelection();
      this.currentstatus = item.type;
      this.tableBtn = this.gettableBtn(item.btn);
      this.pagination["pageNum"] = 1;
      if (item.type == "-1") {
        this.pagination["followStatus"] = [];
      } else {
        if (item.type == "1") {
          this.pagination["followStatus"] = ["0", "1"];
        } else {
          this.pagination["followStatus"] = [item.type];
        }
      }
      this.getMyClueList();
    },
    initData() {
      this.changeModal(false);
      this.getMyClueList();
    },
    changeModal(type) {
      this.showAdd = type;
      this.showchangeStatus = type;
      this.showAddAssigned = type;
      this.showUpdate = type;
      this.showAdmissionNotice = type;
      this.showBatchEditing = type;
      this.showUpdateHybrid = type;
      this.showAddClue = type;
      this.currentClueId = "";
      this.clueIds = [];
      this.enterStudentList = [];
      this.$refs["Table"].clearSelection();
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
    batchPlayTab(type) {
      let selectionId = this.$refs["Table"].selectionId;
      if (selectionId == 0) {
        this.$message.error(this.$t("consult.请选择咨询信息"));
      } else {
        this.clueIds = selectionId;
        this.isMultiple = true;
        switch (type) {
          case "close":
            this.currentClueType = "close";
            this.showchangeStatus = true;
            break;
          case "enter":
            this.currentClueType = "enter";
            this.showchangeStatus = true;
            break;
          case "activate":
            this.currentClueType = "activate";
            this.showchangeStatus = true;
            break;
        }
      }
    },
    changeSchool(e) {
      // console.log("changeSchool", e);
      if (e.length == 0) {
        this.enrollLevelList = [];
        this.directionsList = [];
        this.channelsList = [];
        this.followTagsList = [];
        this.searchFrom.enrollLevels = [];
        this.searchFrom.directions = [];
        this.searchFrom.channels = [];
        this.searchFrom.channelChildOnes = [];
        this.searchFrom.followTags = [];
        return;
      }
      let enrollLevelList = [];
      let directionsList = [];
      let channelsList = [];
      let followtagsList = [];
      let enrollLevelIds = [];
      let directionsIds = [];
      let channelsIds = [];
      let followtagsIds = [];
      this.enrollLevelList = [];
      this.directionsList = [];
      this.channelsList = [];
      this.followTagsList = [];
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
          if (item["child"]["enquiry_channel"]) {
            channelsList.push({
              ...item,
              child: item["child"]["enquiry_channel"],
            });
          }
          if (item["child"]["enquiry_follow_tags"]) {
            item["child"]["enquiry_follow_tags"].map((tags) => {
              if (followtagsIds.includes(tags.value)) {
                followtagsList.map((d) => {
                  if (tags.value == d.value) {
                    let label = d["label"].split(",");
                    let enLabel = d["enLabel"].split(",");
                    if (!label.includes(tags["label"])) {
                      label = [...label, ...tags["label"].split(",")];
                      d["label"] = String([...new Set(label)]);
                    }
                    if (!enLabel.includes(tags["enLabel"])) {
                      enLabel = [...enLabel, ...tags["enLabel"].split(",")];
                      d["enLabel"] = String([...new Set(enLabel)]);
                    }
                  }
                });
              } else {
                followtagsIds.push(tags.value);
                followtagsList.push(tags);
              }
            });
          }
        }
      });
      console.log("enrollLevelList", enrollLevelList);
      this.enrollLevelList = enrollLevelList;
      this.directionsList = directionsList;
      this.channelsList = channelsList;
      this.followTagsList = followtagsList;
    },
    setCreator(data) {
      console.log("setCreator", data);
      this.searchFrom["creatorIds"] = data;
    },
    setFollower(data) {
      console.log("setFollower", data);
      this.searchFrom["followerIds"] = data;
    },
    setChannel(data) {
      this.searchFrom["channels"] = [];
      this.searchFrom["channelChildOnes"] = [];
      let channels = [];
      let channelChildOnes = [];
      data.map((item) => {
        switch (item.length) {
          // case 0:
          //   break;
          // case 1:
          //   break;
          case 2:
            channels.push(item[1]);
            break;
          case 3:
            // this.searchFrom["channels"].push(data[1]);
            channelChildOnes.push(item[2]);
            break;
        }
      });
      this.searchFrom["channels"] = [...new Set(channels)];
      this.searchFrom["channelChildOnes"] = [...new Set(channelChildOnes)];
      console.log("this.searchFrom", this.searchFrom);
    },
    setStudent(data) {
      let studentName = [];
      if (data["students"] && data["students"].length > 0) {
        studentName = data["students"].map((item) => {
          return item["lastName"] + item["firstName"];
        });
      } else {
        studentName = [data["studentName"]];
      }
      return String(studentName);
    },
    setAtSchool(data) {
      let atSchool = [];
      if (data["students"] && data["students"].length > 0) {
        data["students"].map((item) => {
          if (
            item["atSchool"] != "" &&
            item["atSchool"] != undefined &&
            item["atSchool"] != null
          ) {
            atSchool.push(item["atSchool"]);
          }
        });
      }
      return String(atSchool);
    },
    setEnrollLevel(data) {
      let enrollLevel = [];
      if (data["students"] && data["students"].length > 0) {
        data["students"].map((item) => {
          let str = "";
          if (item.applySchool) {
            str = this.getDataLabel(
              item.applySchool,
              "enquiry_enroll_level",
              item.enrollLevel
            );
          } else {
            str = this.$getListLabel(
              this.dictionary["enquiry_enroll_level"],
              item.enrollLevel
            );
          }
          if (str != "") {
            enrollLevel.push(str);
          }
        });
      }
      return String(enrollLevel);
    },
    setEnrollLevelIn(data) {
      let enrollLevel = [];
      if (data["students"] && data["students"].length > 0) {
        data["students"].map((item) => {
          let str = "";
          if (item.applySchool) {
            str = this.getDataLabel(
              item.applySchool,
              "enquiry_enroll_level",
              item.enrollLevelIn
            );
          } else {
            str = this.$getListLabel(
              this.dictionary["enquiry_enroll_level"],
              item.enrollLevelIn
            );
          }
          if (str != "") {
            enrollLevel.push(str);
          }
        });
      }
      return String(enrollLevel);
    },
    setDirection(data) {
      let direction = [];
      if (data["students"] && data["students"].length > 0) {
        data["students"].map((item) => {
          let str = "";
          if (item.applySchool) {
            str = this.getDataLabel(
              item.applySchool,
              "enquiry_direction",
              item.direction
            );
          } else {
            str = this.$getListLabel(
              this.dictionary["enquiry_channel"],
              item.direction
            );
          }

          if (str != "") {
            direction.push(str);
          }
        });
      }
      return String(direction);
    },
    // 发送邮件
    sendEmail() {
      let selectionId = this.$refs["Table"].selectionId;
      if (selectionId == 0) {
        this.$message.error(this.$t("consult.请选择咨询信息"));
      } else {
        this.$refs["sendemail"].initData(selectionId);
      }
    },
    changeSelectAll(e) {
      if (e) {
        this.selectAll();
      } else {
        this.cancelSelectAll();
      }
    },
    changeSelectedCount(length) {
      this.selectedCount = length;
      if (this.paginationTotal > 1000) {
        this.isSelectAll = this.selectedCount == 1000;
      } else {
        this.isSelectAll = this.selectedCount
          ? this.selectedCount == this.paginationTotal
          : false;
      }
    },
    async selectAll() {
      let data = {
        ...this.searchData,
        pageSize: 1000,
      };
      if (this.currentstatus != "-1") {
        if (this.currentstatus == "1") {
          data["followStatus"] = ["0", "1"];
        } else {
          data["followStatus"] = [this.currentstatus];
        }
      }
      let clueIds = await getMyClueIds(data);
      console.log("clueIds", clueIds);
      this.$refs["Table"].selectedIds = clueIds;
      this.$refs["Table"].selectionId = clueIds;
      this.$refs["Table"].syncSelectedRows();
    },
    cancelSelectAll() {
      this.$refs["Table"].clearSelection();
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
    },
    saveRequestParam() {
      this.requestParam = this.getSearchData();
      if (this.channelsList.length > 0) {
        this.requestParam["selectChannle"] =
          this.$refs["SelectChannle"].cascaderValue;
      } else {
        delete this.requestParam["selectChannle"];
      }
      this.$refs["SaveRequestParam"].show();
    },
    // 保存查询条件
    async addRequestParam(name) {
      let data = await addRequestParam({
        description: name,
        type: "2",
        requestParam: JSON.stringify(this.requestParam),
      });
      this.$message.success(this.$t("consult.成功"));
      this.requestList = await getRequestParamList({ type: "2" });
    },
    async initRequestParam() {
      this.requestList = await getRequestParamList({ type: "2" });
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
      this.requestList = await getRequestParamList({ type: "2" });
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
          orderBy: data.orderBy || "",
          enrollLevels: data.enrollLevels || [],
          directions: data.directions || [],
          applySchools: data.applySchools || [],
          followTags: data.followTags || [],
          channels: data.channels || [],
          channelChildOnes: data.channelChildOnes || [],
          createdTime:
            data.createTimeBegin && data.createTimeEnd
              ? [data.createTimeBegin, data.createTimeEnd]
              : [],
          updateTime:
            data.updateTimeBegin && data.updateTimeEnd
              ? [data.updateTimeBegin, data.updateTimeEnd]
              : [],
        };
        if (data.selectChannle) {
          this.$refs["SelectChannle"].cascaderValue = data.selectChannle;
        }
        this.getMyClueList();
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
