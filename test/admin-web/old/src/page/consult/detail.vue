<template>
  <div class="orderDetail">
    <div class="orderDetail_btn">
      <el-button
        v-if="
          $route.query.type == '1' && permissions['enquiry_clue_school_edit']
        "
        type="primary"
        size="medium"
        @click="changeSchool"
        >{{ $t("consult.修改申请校区") }}</el-button
      >
      <el-button
        v-if="
          $route.query.type == '1'
            ? permissions['enquiry_all_edit']
            : $route.query.type == '2'
            ? permissions['enquiry_mine_edit']
            : true
        "
        type="primary"
        size="medium"
        @click="editStudent"
        >{{ $t("consult.编辑") }}</el-button
      >
      <el-button
        v-if="
          $route.query.type == '1'
            ? permissions['enquiry_all_follower_edit']
            : $route.query.type == '2'
            ? permissions['enquiry_mine_follower_edit']
            : true
        "
        type="primary"
        size="medium"
        @click="editAssigneds"
        >{{ $t("consult.跟进人") }}</el-button
      >
      <el-button
        v-if="
          $route.query.type == '1'
            ? permissions['enquiry_all_status_enter'] &&
              (clueData['followStatus'] === 1 || clueData['followStatus'] === 0)
            : permissions['enquiry_mine_status_enter'] &&
              (clueData['followStatus'] === 1 || clueData['followStatus'] === 0)
        "
        type="primary"
        size="medium"
        @click="changeClueStatus('enter')"
        >{{ $t("consult.入学") }}</el-button
      >
      <el-button
        v-if="
          $route.query.type == '1'
            ? permissions['enquiry_all_status_close'] &&
              (clueData['followStatus'] === 1 || clueData['followStatus'] === 0)
            : permissions['enquiry_mine_status_close'] &&
              (clueData['followStatus'] === 1 || clueData['followStatus'] === 0)
        "
        type="defult"
        size="medium"
        @click="changeClueStatus('close')"
        >{{ $t("consult.关闭") }}</el-button
      >
      <el-button
        v-if="
          $route.query.type == '1'
            ? permissions['enquiry_all_status_active'] &&
              clueData['followStatus'] === 3
            : permissions['enquiry_mine_status_active'] &&
              clueData['followStatus'] === 3
        "
        type="defult"
        size="medium"
        @click="changeClueStatus('activate')"
        >{{ $t("consult.激活") }}</el-button
      >
      <!-- <el-button type="defult" size="medium" @click="backList">返回</el-button> -->
    </div>
    <div class="orderDetail_content">
      <div class="orderDetail_item">
        <div class="orderDetail_item_title">{{ $t("consult.线索信息") }}</div>
        <div class="orderDetail_baseinfo">
          <div
            v-show="isHiddenIetm(item.value, checkNull(clueData[item.value]))"
            class="orderDetail_baseinfo_item"
            v-for="(item, index) in clueInfo"
            :key="index"
          >
            <span>{{ $t("consult")[item.label] }}</span>
            <span :title="checkNull(clueData[item.value])">{{
              checkNull(clueData[item.value])
            }}</span>
          </div>
        </div>
      </div>
      <div class="orderDetail_item">
        <div class="orderDetail_item_title df_sb">
          <div>{{ $t("consult.学生信息") }}</div>
          <!-- <el-button type="primary" size="medium" @click="editStudent"
            >编辑</el-button
          > -->
        </div>
        <div class="orderDetail_baseinfo">
          <div
            v-show="
              isHiddenIetm(item.value, checkNull(studentData[item.value]))
            "
            class="orderDetail_baseinfo_item"
            v-for="(item, index) in studentInfo"
            :key="index"
          >
            <span>{{ $t("consult")[item.label] }}</span>
            <span :title="checkNull(studentData[item.value])">{{
              checkNull(studentData[item.value])
            }}</span>
          </div>
        </div>
      </div>
      <div class="orderDetail_item">
        <div class="orderDetail_item_title df_sb">
          <div>{{ $t("consult.家长信息") }}</div>
        </div>
        <div class="orderDetail_baseinfo">
          <div
            class="orderDetail_baseinfo_item"
            v-for="(item, index) in parentInfo"
            :key="index"
          >
            <span>{{ $t("consult")[item.label] }}</span>
            <span :title="checkNull(firstGuardians[item.value])">{{
              checkNull(firstGuardians[item.value])
            }}</span>
          </div>
        </div>
      </div>
      <div class="orderDetail_item">
        <div class="orderDetail_item_title df_sb">
          <div>{{ $t("consult.其他联系人") }}</div>
          <el-button
            v-if="studentId != ''"
            type="primary"
            size="medium"
            @click="changeGuardians('add')"
            >{{ $t("consult.新增") }}</el-button
          >
        </div>
        <div class="orderDetail_baseinfo">
          <Table
            ref="Table"
            :tableTitle="tableTitle"
            :tableData="tableData"
            :tableBtn="tableBtn"
            :showSelection="false"
            @playTab="playTab"
          />
        </div>
      </div>
      <div class="orderDetail_item">
        <div class="orderDetail_item_title df_sb" style="margin-bottom: 20px">
          <div>{{ $t("consult.跟进记录") }}</div>
          <el-button type="primary" size="medium" @click="addlog">{{
            $t("consult.新增")
          }}</el-button>
        </div>
        <div class="orderDetail_baseinfo">
          <div class="followType">
            <div
              @click="changeFollowType({ value: 'all' })"
              :class="[
                'followType_item',
                {
                  currentFollow: currentFollow == 'all'
                }
              ]"
            >
              {{ $t("consult.全部") }}
            </div>
            <div
              @click="changeFollowType(item)"
              :class="[
                'followType_item',
                {
                  currentFollow: currentFollow == item.value
                }
              ]"
              v-for="(item, index) in dictionary['follow_type']"
              :key="index"
            >
              {{ i18nlocel == "en" ? item.enLabel : item.label }}
            </div>
          </div>
          <el-steps
            class="orderSteps"
            direction="vertical"
            :active="logListdata.length"
          >
            <el-step
              v-for="(i, k) in logListdata"
              :key="k"
              :title="
                $t('consult.跟进人') +
                  '：' +
                  (i.extras.length > 0 ? i.extras[0].value : '--') +
                  setLogDescription(i.extras)
              "
            >
              <template slot="description">
                <ShowText
                  v-if="i.followDesc !== null"
                  :label="i.followTypeLabel + '：' + i.followDesc"
                />
                <div class="df_sb">
                  <div class="time">
                    {{ i.followTime }}
                  </div>
                  <div
                    v-if="i.showDetail"
                    style="cursor: pointer"
                    @click="lookLog(i)"
                  >
                    {{ $t("consult.详情") }}
                  </div>
                </div>
              </template></el-step
            >
          </el-steps>
        </div>
      </div>
    </div>
    <Guardians
      v-if="showGuardians"
      ref="Guardians"
      :showGuardians="showGuardians"
      :studentId="studentId"
      :guardiansType="guardiansType"
      @changeModal="changeModal"
      @initData="initGuardianList"
    />
    <!-- 改变状态 -->
    <changeStatus
      v-if="showchangeStatus"
      :showchangeStatus="showchangeStatus"
      :currentClueType="currentClueType"
      :currentClueId="currentClueId"
      @changeModal="changeModal"
      @initData="initData"
    />
    <!-- 编辑学生信息 -->
    <editStudent
      ref="editStudent"
      v-if="showEditStudent"
      :showEditStudent="showEditStudent"
      :clueData="clueData"
      :studentData="studentData"
      :guardians="tableData"
      @changeModal="changeModal"
      @initData="initData"
    />
    <!-- 新增记录信息 -->
    <addLog
      v-if="showAddLog"
      :showAddLog="showAddLog"
      :currentClueId="currentClueId"
      @changeModal="changeModal"
      @initData="initLogList"
    />
    <!-- 记录信息 -->
    <logDetail
      v-if="logDetail"
      ref="logDetail"
      :logDetail="logDetail"
      @changeModal="changeModal"
      @initData="initData"
    />
    <addAssigned
      ref="addAssigned"
      v-if="showAddAssigned"
      :type="'edit'"
      :showAddAssigned="showAddAssigned"
      :clueIds="clueIds"
      @changeModal="changeModal"
      @initData="initData"
    />
    <changeSchool
      ref="changeSchool"
      v-if="showChangeSchool"
      :showChangeSchool="showChangeSchool"
      :clueId="clueData['id']"
      @changeModal="changeModal"
      @initData="initData"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getClueDetail,
  getGuardianList,
  delGuardian,
  logList
} from "@/api/consult/index.js";
import { consult } from "@/const/consult/index.js";
import Table from "@/components/common/Table.vue";
import ShowText from "@/components/common/ShowText.vue";
import Guardians from "@/page/consult/modal/guardians.vue";
import changeStatus from "@/page/consult/modal/changestatus.vue";
import editStudent from "@/page/consult/modal/editstudent.vue";
import addLog from "@/page/consult/modal/addlog.vue";
import logDetail from "@/page/consult/modal/logdetail.vue";
import addAssigned from "@/page/consult/modal/addAssigned.vue";
import changeSchool from "@/page/consult/modal/changeschool.vue";
export default {
  name: "PCOrderDetail",
  components: {
    Table,
    ShowText,
    Guardians,
    changeStatus,
    editStudent,
    addLog,
    logDetail,
    addAssigned,
    changeSchool
  },
  data() {
    return {
      clueInfo: [
        { label: "学生姓名", value: "studentName" },
        { label: "跟进状态", value: "followStatusLabel" },
        { label: "联系方式", value: "contactMethod" },
        { label: "家长称谓", value: "guardianTitle" },
        // { label: "校区", value: "schoolsLabel" },
        { label: "归属校区", value: "schoolsLabel" },
        { label: "申请年级", value: "enrollLevelLabel" },
        { label: "渠道", value: "channellLabel" },
        { label: "奖学金", value: "awardScholarship" },
        { label: "来源", value: "origin" },
        { label: "跟进标签", value: "followTagsLabel" },
        { label: "跟进人", value: "followers" },
        { label: "创建人", value: "Creator" },
        { label: "更新时间", value: "updateTime" }
      ],
      studentInfo: [
        { label: "姓", value: "lastName" },
        { label: "名", value: "firstName" },
        { label: "英文名", value: "studentNameEn" },
        { label: "性别", value: "sexlabel" },
        { label: "出生日期", value: "birthday" },
        { label: "在读学校", value: "atSchool" },
        { label: "在读年级", value: "enrollLevelInLabel" },
        { label: "校区", value: "applySchoolLabel" },
        { label: "入学年份", value: "enrollYear" },
        { label: "入学年级", value: "enrollLevelLabel" },
        { label: "方向", value: "directionLabel" },
        { label: "国籍", value: "nationality" },
        { label: "语言", value: "language" },
        { label: "家庭住址", value: "homeAddress" },
        { label: "奖学金返点", value: "scholarshipRemission" }
      ],
      parentInfo: [
        { label: "姓", value: "lastName" },
        { label: "名", value: "firstName" },
        { label: "性别", value: "sexlabel" },
        { label: "和申请人的关系", value: "relationTypeLabel" },
        { label: "邮箱", value: "email" },
        { label: "国籍", value: "nationality" },
        { label: "语言", value: "language" },
        { label: "电话", value: "phone" },
        { label: "微信号", value: "wechat" },
        { label: "首次探校时间", value: "schoolTour" }
      ],
      tableTitle: consult["guardiansTitle"],
      tableData: [],
      tableBtn: [
        {
          name: "编辑",
          type: "edit",
          permissions: "order_cancel",
          icon: "el-icon-circle-close"
        },
        {
          name: "删除",
          type: "del",
          permissions: "order_cancel",
          icon: "el-icon-circle-close"
        }
      ],
      studentId: "",
      clueData: {},
      studentData: {},
      firstGuardians: {},
      guardiansType: "",
      showGuardians: false,
      showchangeStatus: false,
      showEditStudent: false,
      showAddLog: false,
      currentClueType: "",
      currentClueId: "",
      logListdata: [],
      filterLog: {
        outerId: "",
        scene: "enquiry_enroll"
      },
      currentFollow: "all",
      logDetail: false,
      followersIds: [],
      showAddAssigned: false,
      clueIds: [],
      showChangeSchool: false
    };
  },

  created() {
    this.getClueDetail();
  },
  mounted() {},
  computed: {
    ...mapGetters([
      "dictionary",
      "userList",
      "permissions",
      "i18nlocel",
      "pooldictionary",
      "pooldictpermissions"
    ])
  },
  watch: {
    i18nlocel() {
      this.getClueDetail();
    }
  },
  methods: {
    getClueDetail() {
      getClueDetail(this.$route.query.clueId).then(res => {
        if (res.data.success) {
          let { clue, student, parent, followers } = res.data.data;
          this.clueData = clue;
          this.currentClueId = clue.id;
          this.filterLog["outerId"] = clue.id;
          this.clueData["followStatusLabel"] = this.$t("consult")[
            consult["followStatus"][this.clueData["followStatus"]]
          ];
          this.clueData["followTagsLabel"] = this.getDictLabel(
            student.applySchool,
            "enquiry_follow_tags",
            clue.followTags
          );
          this.clueData["enrollLevelLabel"] = this.getDictLabel(
            student.applySchool,
            "enquiry_enroll_level",
            clue.enrollLevel
          );
          this.clueData["enrollLevelLabel"] = this.getDictLabel(
            student.applySchool,
            "enquiry_enroll_level",
            clue.enrollLevel
          );
          this.clueData["channellLabel"] = this.getDictLabel(
            student.applySchool,
            "enquiry_channel",
            clue.channel
          );
          let channelChildOneLabel = this.getDictLabel(
            student.applySchool,
            "enquiry_channel_child_one",
            clue.channelChildOne
          );
          this.clueData["channellLabel"] =
            this.clueData["channellLabel"] +
            (channelChildOneLabel == "" ? "" : "/" + channelChildOneLabel);

          console.log(this.clueData["schools"]);
          if (this.clueData["schools"].length > 0) {
            let arr = [];
            this.clueData["schools"].map(item => {
              arr.push(this.getDataLabel(item, this.pooldictionary));
            });
            this.clueData["schoolsLabel"] = String(arr);
          }
          if (followers == null || followers.length == 0) {
            this.clueData["followers"] = "--";
          } else {
            let followerList = [];
            let followerIds = [];
            followers.map(item => {
              followerIds.push(item.id);
              followerList.push(item.username);
            });
            this.clueData["followers"] = String(followerList);
            this.followersIds = followerIds;
          }
          if (this.clueData["creatorId"]) {
            this.userList.map(item => {
              if (this.clueData["creatorId"] == String(item.value)) {
                this.clueData["Creator"] = item.label;
              }
            });
          }
          this.logList();
          if (parent != null) {
            this.firstGuardians = parent;
            this.firstGuardians["sexlabel"] = this.getDataLabel(
              this.firstGuardians["sex"],
              consult["sexList"]
            );
            this.firstGuardians["relationTypeLabel"] = this.getDataLabel(
              this.firstGuardians["relationType"],
              this.dictionary["enquiry_relation_type"]
            );
          }
          if (student != null) {
            this.studentId = student.id;
            this.getGuardianList();
            this.studentData = student;
            this.studentData["enrollYear"] =
              this.studentData["enrollYear"] == null
                ? null
                : String(this.studentData["enrollYear"]);
            this.studentData["enrollLevelLabel"] = this.getDictLabel(
              student.applySchool,
              "enquiry_enroll_level",
              student.enrollLevel
            );
            this.studentData["enrollLevelInLabel"] = this.getDictLabel(
              student.applySchool,
              "enquiry_enroll_level",
              student.enrollLevelIn
            );
            this.studentData["directionLabel"] = this.getDictLabel(
              student.applySchool,
              "enquiry_direction",
              student.direction
            );
            this.studentData["sexlabel"] = this.getDataLabel(
              this.studentData["sex"],
              consult["sexList"]
            );
            this.studentData["applySchoolLabel"] = this.getDataLabel(
              this.studentData["applySchool"],
              this.pooldictionary
            );
          }
        }
      });
    },
    getGuardianList() {
      getGuardianList(this.studentId).then(res => {
        if (res.data.success) {
          console.log("getGuardianList", res);
          this.tableData = [];
          let data = res.data.data;
          data.map((item, index) => {
            item["sexlabel"] = this.getDataLabel(
              item["sex"],
              consult["sexList"]
            );
            item["relationTypeLabel"] = this.getDataLabel(
              item["relationType"],
              this.dictionary["enquiry_relation_type"]
            );
          });
          this.tableData = data;
        }
      });
    },
    logList() {
      logList(this.filterLog).then(res => {
        if (res.data.success) {
          if (res.data.data != null) {
            console.log("logList", res.data.data);
            this.logListdata = res.data.data;
            this.logListdata.map(item => {
              if (item["followType"] == null) {
                item["followTypeLabel"] = this.$t("consult.备注");
                item["showDetail"] = false;
              } else {
                item["showDetail"] = true;
                item["followTypeLabel"] = this.getDataLabel(
                  item.followType,
                  this.dictionary["follow_type"]
                );
              }
            });
          }
        }
      });
    },
    changeFollowType(item) {
      this.currentFollow = item.value;
      if (item.value == "all") {
        delete this.filterLog["followType"];
      } else {
        this.filterLog["followType"] = item.value;
      }
      this.logList();
    },
    // 表格操作
    playTab(name, item, scope) {
      console.log(6666, name);
      switch (name) {
        case "edit":
          this.changeGuardians("edit");
          this.$nextTick(() => {
            this.$refs["Guardians"].ruleForm = _.cloneDeep(item);
          });
          break;
        case "del":
          let data = new FormData();
          data.append("guardianId", item.id);
          data.append("studentId", this.studentId);
          delGuardian(data).then(res => {
            if (res.data.success) {
              this.$message.success(this.$t("consult.成功"));
              this.initData();
            }
          });
          break;
      }
    },
    editStudent() {
      this.showEditStudent = true;
      console.log(" this.studentData", this.studentData);
      this.$nextTick(() => {
        this.$refs["editStudent"].init(
          this.clueData,
          this.studentData,
          this.firstGuardians
        );
      });
    },
    checkNull(str) {
      return str == null || str == undefined || str == "" ? "--" : str;
    },
    changeClueStatus(type) {
      this.currentClueType = type;
      this.showchangeStatus = true;
    },
    changeGuardians(type) {
      this.guardiansType = type;
      this.showGuardians = true;
    },
    addlog() {
      this.showAddLog = true;
    },
    initData() {
      this.getClueDetail();
      this.changeModal(false);
    },
    initLogList() {
      this.logList();
      this.getClueDetail();
      this.changeModal(false);
    },
    initGuardianList() {
      this.getClueDetail();
      this.getGuardianList();
      this.changeModal(false);
    },
    changeModal(type) {
      this.showGuardians = type;
      this.showchangeStatus = type;
      this.showEditStudent = type;
      this.showAddLog = type;
      this.logDetail = type;
      this.showAddAssigned = type;
      this.showChangeSchool = type;
    },
    getDictLabel(pid, type, cid) {
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
    getDataLabel(id, data) {
      console.log("getDataLabel", id, data);
      let str = "";
      data.map(item => {
        if (item.value == id) {
          str = this.i18nlocel == "en" ? item.enLabel : item.label;
        }
      });
      return str;
    },
    lookLog(i) {
      this.logDetail = true;
      this.$nextTick(() => {
        let data = { outerId: i.id, scene: "follow_record_attachment" };
        let extras = i.extras;
        this.$refs["logDetail"].ruleForm = {
          follow_user_name: extras.length > 0 ? extras[0].value : "",
          follow_contactor_name: extras.length > 1 ? extras[1].value : "",
          followTime: i.followTime,
          followTypeLabel: i.followType == null ? "" : i.followTypeLabel,
          followDesc: i.followDesc
        };
        this.$refs["logDetail"].setFeilList(data);
      });
    },
    editAssigneds() {
      this.clueIds = [this.$route.query.clueId];
      this.showAddAssigned = true;
      this.$nextTick(() => {
        this.$refs["addAssigned"].ruleForm.userIds = this.followersIds;
      });
    },
    backList() {},
    changeSchool() {
      this.showChangeSchool = true;
      this.$nextTick(() => {
        this.$refs["changeSchool"].ruleForm["schools"] = this.clueData[
          "schools"
        ];
        this.$refs["changeSchool"].setSchoolList(this.clueData["schools"]);
      });
    },
    setLogDescription(data) {
      let str = "";
      let newStatus = "";
      let oldStatus = "";
      data.map(item => {
        if (item["key"] == "follow_status_change") {
          let obj = JSON.parse(item["value"]);
          if (
            (obj["old"] || obj["old"] == 0) &&
            (obj["new"] || obj["new"] == 0)
          ) {
            console.log('obj["old"]', obj["old"]);

            switch (obj["old"]) {
              case 0:
                oldStatus = this.$t("consult.待分配");
                break;
              case 1:
                oldStatus = this.$t("consult.待跟进");
                break;
              case 2:
                oldStatus = this.$t("consult.已入学");
                break;
              case 3:
                oldStatus = this.$t("consult.已关闭");
                break;
            }
            switch (obj["new"]) {
              case 0:
                newStatus = this.$t("consult.待分配");
                break;
              case 1:
                newStatus = this.$t("consult.待跟进");
                break;
              case 2:
                newStatus = this.$t("consult.已入学");
                break;
              case 3:
                newStatus = this.$t("consult.已关闭");
                break;
            }
            if (obj["old"] == 3) {
              // str = this.$t("consult.激活");
              str = this.$t("consult.激活状态为") + newStatus;
            } else {
              str =
                this.i18nlocel == "en"
                  ? oldStatus + this.$t("consult.修改状态") + newStatus
                  : "修改" + oldStatus + "状态为" + newStatus;
            }
          }
        }
      });

      return str;
    },
    isHiddenIetm(type, data) {
      // console.log("isHiddenIetm", type, data);
      let isShow = false;
      let list = ["enrollLevelLabel", "channellLabel", "directionLabel"];
      isShow = data == "--" && list.includes(type);
      return !isShow;
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.el-step__description {
  padding-right: 0% !important;
}

.orderSteps {
  width: 100%;
}

.orderDetail_baseinfo {
  padding-bottom: 20px !important;
}

.orderDetail_baseinfo_item {
  margin-bottom: 20px;
}

.followType {
  width: 100%;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #efefef;
  display: flex;
  align-items: center;

  .followType_item {
    cursor: pointer;
    padding: 10px 20px 10px;
  }

  .currentFollow {
    position: relative;

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 20%;
      right: 20%;
      height: 3px;
      background-color: #175e67;
    }
  }
}
</style>
