<template>
  <div>
    <StatusItem
      :statusList="statusList"
      :currentstatus="currentstatus"
      @changeStasus="changeStasus"
    />
    <div class="searchFromBox search" style="padding: 20px">
      <el-form
        ref="searchFrom"
        class="df_align_center searchFrom"
        :label-position="'top'"
        :inline="true"
        :model="searchFrom"
        :rules="searchRules"
      >
        <el-form-item
          v-if="currentstatus == '-1'"
          :label="$t('consult.跟进状态')"
          style="width: 160px"
        >
          <el-select
            clearable
            multiple
            v-model="pagination.followStatus"
            :placeholder="$t('consult.请选择')"
          >
            <el-option
              v-for="item in filterStatusList"
              :key="item.type"
              :label="$t('consult')[item.name]"
              :value="item.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('consult.关键词')" style="width: 160px">
          <el-input
            v-model="searchFrom.keyword"
            clearable
            :placeholder="$t('consult.请输入')"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item :label="$t('consult.创建人')" style="width: 160px">
          <CreatorTree
            ref="creator"
            size="small"
            @setuser="setCreator"
            :options="[]"
            :isDisabled="false"
          ></CreatorTree>
        </el-form-item> -->

        <!-- <el-form-item :label="$t('consult.跟进人')" style="width: 160px">
          <FollowerTree
            ref="follower"
            size="small"
            @setuser="setFollower"
            :options="[]"
            :isDisabled="false"
          ></FollowerTree>
        </el-form-item> -->
        <el-form-item
          v-if="dictpermissions['order_school'].length > 1"
          :label="$t('consult.归属校区')"
          style="width: 160px"
        >
          <el-select
            clearable
            multiple
            v-model="searchFrom.schools"
            :placeholder="$t('consult.请选择')"
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
          v-if="pooldictpermissions.length > 0"
          :label="$t('consult.校区')"
          style="width: 160px"
        >
          <el-select
            clearable
            multiple
            v-model="searchFrom.applySchools"
            :placeholder="$t('consult.请选择')"
            @change="changeSchool"
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
          style="width: 160px"
        >
          <el-select
            clearable
            multiple
            v-model="searchFrom.enrollLevels"
            :placeholder="$t('consult.请选择')"
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
          style="width: 160px"
        >
          <el-select
            clearable
            multiple
            v-model="searchFrom.directions"
            :placeholder="$t('consult.请选择')"
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
          style="width: 160px"
        >
          <el-select
            clearable
            multiple
            v-model="searchFrom.followTags"
            :placeholder="$t('consult.请选择')"
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
          style="width: 160px"
        >
          <SelectChannle
            ref="SelectChannle"
            :options="channelsList"
            @setChannel="setChannel"
          />
          <!-- <el-select
            clearable
            multiple
            v-model="searchFrom.channels"
            :placeholder="$t('consult.请选择')"
          >
            <el-option
              v-for="item in channelsList"
              :key="item.value"
              :label="i18nlocel == 'en' ? item.enLabel : item.label"
              :value="item.value"
            ></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item :label="$t('consult.新增时间')" style="width: 320px">
          <el-date-picker
            style="width: 100%"
            v-model="searchFrom.createdTime"
            type="datetimerange"
            clearable
            :range-separator="$t('consult.至')"
            :start-placeholder="$t('consult.开始')"
            :end-placeholder="$t('consult.结束')"
            :value-format="'yyyy-MM-dd HH:mm  '"
            :format="'yyyy-MM-dd HH:mm'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('consult.更新时间')" style="width: 320px">
          <el-date-picker
            style="width: 100%"
            v-model="searchFrom.updateTime"
            type="datetimerange"
            clearable
            :range-separator="$t('consult.至')"
            :start-placeholder="$t('consult.开始')"
            :end-placeholder="$t('consult.结束')"
            :value-format="'yyyy-MM-dd HH:mm'"
            :format="'yyyy-MM-dd HH:mm'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('consult.排序方式')" style="width: 160px">
          <el-select
            v-model="searchFrom.orderBy"
            :placeholder="$t('consult.请选择')"
          >
            <el-option
              v-for="item in sortModeList"
              :key="item.value"
              :label="$t('consult')[item['label']]"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 110px; margin-right: 0;margin-left:auto;">
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
      <div class="df_sb">
        <div class="df_sb">
          <el-button
            v-if="permissions['enquiry_mine_add']"
            type="primary"
            size="medium"
            @click="showAdd = true"
            >{{ $t("consult.新增线索") }}</el-button
          >
          <!-- <el-button
            v-if="permissions['enquiry_mine_add']"
            type="primary"
            size="medium"
            @click="showAdd = true"
            >{{ $t("consult.新增学生") }}</el-button
          > -->
          <el-button
            v-if="tableData.length > 0 && permissions['enquiry_mine_export']"
            type="primary"
            size="medium"
            @click="exportMyList"
            >{{ $t("consult.导出") }}</el-button
          >
          <el-button
            v-if="permissions['enquiry_mine_import']"
            type="primary"
            size="medium"
            @click="showUpdate = true"
            >{{ $t("consult.导入") }}</el-button
          >
          <el-button
            v-if="permissions['enquiry_mine_template_download']"
            type="primary"
            size="medium"
            @click="downloadTemplate"
            >{{ $t("consult.下载模板") }}</el-button
          >
          <el-button
            v-if="permissions['enquiry_mine_follower_add']"
            type="primary"
            size="medium"
            @click="addAssigneds('showAddAssigned')"
            >{{ $t("consult.添加跟进人") }}</el-button
          >
          <el-button
            type="primary"
            v-if="
              permissions['enquiry_mine_enter_cotice'] && currentstatus == '1'
            "
            size="medium"
            @click="addAssigneds('showAdmissionNotice')"
            >{{ $t("consult.入学通知") }}</el-button
          >
          <el-button
            type="primary"
            v-if="permissions['enquiry_mine_school_batch_edit']"
            size="medium"
            @click="addAssigneds('showBatchEditing')"
            >{{ $t("consult.批量编辑") }}</el-button
          >
          <el-button
            type="primary"
            v-if="
              permissions['enquiry_mine_status_batch_enter'] &&
                currentstatus == '1'
            "
            size="medium"
            @click="batchPlayTab('enter')"
            >{{ $t("consult.批量入学") }}</el-button
          >
          <el-button
            type="primary"
            v-if="
              permissions['enquiry_mine_status_batch_close'] &&
                currentstatus == '1'
            "
            size="medium"
            @click="batchPlayTab('close')"
            >{{ $t("consult.批量关闭") }}</el-button
          >
          <el-button
            type="primary"
            v-if="
              permissions['enquiry_mine_status_batch_active'] &&
                currentstatus == '3'
            "
            size="medium"
            @click="batchPlayTab('activate')"
            >{{ $t("consult.批量激活") }}</el-button
          >
        </div>
      </div>
      <PaginationInfo :paginationTotal="paginationTotal" />
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
      <Pagination
        :total="paginationTotal"
        :pagination="pagination"
        @handleCurrentChange="handleCurrentChange"
      />
    </div>
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
    <update
      ref="update"
      v-if="showUpdate"
      :showUpdate="showUpdate"
      @closeModal="changeModal"
      @initData="initData"
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
      :show="showBatchEditing"
      :clueIds="clueIds"
      @changeModal="changeModal"
      @initData="initData"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import Table from "@/components/common/Table.vue";
import StatusItem from "@/components/common/StatusItem.vue";
import {
  getMyClueList,
  exportMyList,
  importList,
  downloadTemplate
} from "@/api/consult/index.js";
import { download } from "@/util/download.js";
import { consult } from "@/const/consult/index.js";
import addStudent from "@/page/consult/modal/addstudent.vue";
import changeStatus from "@/page/consult/modal/changestatus.vue";
import addAssigned from "@/page/consult/modal/addAssigned.vue";
import update from "@/page/consult/modal/update.vue";
import AdmissionNotice from "@/page/consult/modal/admissionNotice.vue";
import BatchEditing from "@/page/consult/modal/batchEditing.vue";
import CreatorTree from "@/components/commonConpents/UserTree";
import FollowerTree from "@/components/commonConpents/DeptUserTree";
import SelectChannle from "@/components/common/pooldictselect/selectchannlemultiple.vue";
export default {
  name: "TestUniWel",
  components: {
    Pagination,
    Table,
    PaginationInfo,
    StatusItem,
    addStudent,
    changeStatus,
    addAssigned,
    update,
    AdmissionNotice,
    BatchEditing,
    CreatorTree,
    FollowerTree,
    SelectChannle
  },
  data() {
    return {
      isMultiple: false,
      showBatchEditing: false,
      showAdmissionNotice: false,
      showAdd: false,
      showchangeStatus: false,
      currentClueType: "",
      currentClueId: "",
      pagination: {
        size: 10,
        current: 1,
        followStatus: ["0", "1"]
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
        orderBy: "orderByCreateTime"
      },
      searchRules: {},
      searchData: { orderBy: "orderByCreateTime" },
      statusList: [],
      filterStatusList: consult["filterStatusList"],
      tableTitle: consult["tableTitle"],
      sortModeList: consult["sortMode"],
      currentstatus: "1",
      tableData: [],
      tableBtn: [],
      spaceType: [],
      showAddAssigned: false,
      clueIds: [],
      showUpdate: false,
      enrollLevelList: [],
      directionsList: [],
      channelsList: [],
      followTagsList: []
    };
  },
  computed: {
    ...mapGetters([
      "dictionary",
      "i18nlocel",
      "permissions",
      "dictpermissions",
      "pooldictionary",
      "pooldictpermissions"
    ])
  },

  created() {
    this.getstatusList();
    this.tableBtn = this.gettableBtn(this.statusList[0].btn);
    this.getMyClueList();
  },

  watch: {
    i18nlocel() {
      console.log("i18nlocel", this.i18nlocel);
      this.getstatusList();
      this.getMyClueList();
    }
  },
  mounted() {},
  activated() {
    this.getMyClueList();
  },
  methods: {
    getstatusList() {
      this.statusList = [];
      consult["statusMineList"].map(item => {
        let obj = {
          ...item,
          name: this.$t("consult")[item["name"]]
        };
        this.statusList.push(obj);
      });
    },
    getMyClueList() {
      getMyClueList({
        ...this.pagination,
        ...this.searchData
      }).then(res => {
        console.log("res", res);
        if (res.data.success) {
          let { data, total } = res.data.data;
          this.tableData = data;
          this.paginationTotal = total;
          this.tableData.map(item => {
            item["status"] = item["followStatus"] != 1 ? 0 : 1;
            item["enrollLevelLabel"] = this.getDataLabel(
              item.applySchool,
              "enquiry_enroll_level",
              item.enrollLevel
            );
            item["followTags"] = this.getDataLabel(
              item.applySchool,
              "enquiry_follow_tags",
              item.followTags
            );
            item["directionLabel"] = this.getDataLabel(
              item.applySchool,
              "enquiry_direction",
              item.direction
            );
            item["applySchoolLabel"] = this.getDatastr(
              item.applySchool,
              this.pooldictionary
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
          });
          // console.log(" this.tableData", this.tableData);
        }
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
          if (this.clueIds.length == 1) {
            this.showBatchEditing = true;
            this.$nextTick(() => {
              this.$refs["BatchEditing"].editSingleStudent(this.clueIds[0]);
            });
          } else {
            let applySchool = [];
            this.tableData.map(item => {
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
      }
    },
    // 导入用户
    importList(data) {
      importList(data).then(res => {
        console.log("res", res);
        this.$message.success(this.$t("consult.成功"));
        this.getMyClueList();
      });
    },
    // 导出
    exportMyList() {
      let data = {
        ...this.pagination,
        ...this.searchFrom
      };
      delete data["size"];
      delete data["current"];
      exportMyList(data).then(res => {
        console.log("res", res);
        this.$message.success(this.$t("consult.成功"));
        download(res.data, res.headers["content-disposition"]);
      });
    },
    // 导出
    downloadTemplate() {
      downloadTemplate().then(res => {
        console.log("res", res);
        this.$message.success(this.$t("consult.成功"));
        download(res.data, res.headers["content-disposition"]);
      });
    },
    // 下载模板
    downloadUserExcel() {
      downloadUserExcel().then(res => {
        console.log("res", res);
        this.$message.success(this.$t("consult.成功"));
        download(res.data, res.headers["content-disposition"]);
      });
    },
    // 表格操作
    playTab(name, item, scope) {
      console.log(6666, name);
      this.currentClueId = item.id;
      this.isMultiple = false;
      switch (name) {
        case "look":
          this.$router.push("/enquiry/detail?clueId=" + item.id + "&type=2");
          break;
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
    },
    rowClick(row, column, event) {
      this.$router.push("/enquiry/detail?clueId=" + row.id + "&type=2");
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
      this.pagination["current"] = page;
      this.getMyClueList();
    },
    // 搜索
    search() {
      this.searchData = {};
      this.searchData["keyword"] = this.searchFrom["keyword"];
      this.searchData["orderBy"] = this.searchFrom["orderBy"];
      this.searchData["enrollLevels"] = this.searchFrom["enrollLevels"];
      this.searchData["directions"] = this.searchFrom["directions"];
      this.searchData["schools"] = this.searchFrom["schools"];
      this.searchData["applySchools"] = this.searchFrom["applySchools"];
      this.searchData["followTags"] = this.searchFrom["followTags"];
      this.searchData["channels"] = this.searchFrom["channels"];
      this.searchData["channelChildOnes"] = this.searchFrom["channelChildOnes"];
      if (this.searchFrom["createdTime"].length > 0) {
        this.searchData["createTimeBegin"] = this.searchFrom["createdTime"][0];
        this.searchData["createTimeEnd"] = this.searchFrom["createdTime"][1];
      }
      if (this.searchFrom["updateTime"].length > 0) {
        this.searchData["updateTimeBegin"] = this.searchFrom["updateTime"][0];
        this.searchData["updateTimeEnd"] = this.searchFrom["updateTime"][1];
      }
      console.log(" this.searchFrom", this.searchFrom);
      this.pagination["current"] = 1;
      this.getMyClueList();
    },
    // 清除搜索
    clear() {
      this.searchFrom = {
        keyword: "",
        enrollLevel: [],
        directions: [],
        createdTime: [],
        updateTime: [],
        schools: [],
        applySchools: [],
        channels: [],
        channelChildOnes: [],
        creatorIds: [],
        followerIds: [],
        followTags: [],
        orderBy: "orderByCreateTime"
      };
      // this.$refs["creator"].clearselect();
      // this.$refs["follower"].clearselect();
      this.searchData = { orderBy: "orderByCreateTime" };
      this.pagination["current"] = 1;
      this.enrollLevelList = [];
      this.directionsList = [];
      this.followTagsList = [];
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
      let tableBtn = data.filter(res => {
        return (
          res["permissions"] == "look" || this.permissions[res["permissions"]]
        );
      });
      return tableBtn;
    },
    // 状态切换
    changeStasus(item, index) {
      console.log("item, index", item, index);
      this.currentstatus = item.type;
      this.tableBtn = this.gettableBtn(item.btn);
      this.pagination["current"] = 1;
      if (item.type == "-1") {
        // delete this.pagination["followStatus"];
        this.pagination["followStatus"] = [];
      } else {
        if (item.type == "1") {
          this.pagination["followStatus"] = ["0", "1"];
        } else {
          this.pagination["followStatus"] = item.type;
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
    },
    getDataLabel(pid, type, cid) {
      let str = "";
      this.pooldictionary.map(item => {
        if (item.value == pid) {
          if (item["child"][type]) {
            let data = item["child"][type];
            data.map(c => {
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
      console.log("getDataLabel", id, data);
      let str = "";
      data.map(item => {
        if (item.value == id) {
          str = this.i18nlocel == "en" ? item.enLabel : item.label;
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
      pooldictpermissions.map(item => {
        if (e.includes(item.value)) {
          if (item["child"]["enquiry_enroll_level"]) {
            item["child"]["enquiry_enroll_level"].map(level => {
              if (enrollLevelIds.includes(level.value)) {
                // console.log("enrollLevelList", enrollLevelList);
                enrollLevelList.map(enrollLevel => {
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
            item["child"]["enquiry_direction"].map(direction => {
              if (directionsIds.includes(direction.value)) {
                // console.log("directionsList", directionsList);
                directionsList.map(d => {
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
                        ...direction["enLabel"].split(",")
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
              child: item["child"]["enquiry_channel"]
            });
          }
          if (item["child"]["enquiry_follow_tags"]) {
            item["child"]["enquiry_follow_tags"].map(tags => {
              if (followtagsIds.includes(tags.value)) {
                followtagsList.map(d => {
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
      data.map(item => {
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
    }
  }
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
