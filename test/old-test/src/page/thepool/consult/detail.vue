<template>
  <div class="thepool_page">
    <el-scrollbar style="height: 100%">
      <div class="thepool-detail">
        <div class="thepool-detail_left">
          <div class="thepool-detail_top">
            <div class="thepool-tabs">
              <div
                @click="changeTab('clueInfo')"
                :class="[
                  'thepool-tabs-item',
                  { 'is-active': currentTab === 'clueInfo' },
                ]"
              >
                {{ $t("consult.线索信息") }}
              </div>
              <div
                @click="changeTab('studentInfo')"
                :class="[
                  'thepool-tabs-item',
                  { 'is-active': currentTab === 'studentInfo' },
                ]"
              >
                {{ $t("consult.学生信息") }}
              </div>
              <div
                @click="changeTab('guardianInfo')"
                :class="[
                  'thepool-tabs-item',
                  { 'is-active': currentTab === 'guardianInfo' },
                ]"
              >
                {{ $t("consult.家长信息") }}
              </div>
            </div>
            <div class="thepool-btns" v-if="currentTab === 'clueInfo'">
              <el-button
                v-if="
                  enquiryType == '1' && permissions['enquiry_clue_school_edit']
                "
                type="primary"
                size="small"
                round
                @click="changeSchool"
                >{{ $t("consult.修改申请校区") }}</el-button
              >
              <el-button
                v-if="
                  enquiryType == '1'
                    ? permissions['enquiry_all_edit']
                    : enquiryType == '2'
                    ? permissions['enquiry_mine_edit']
                    : true
                "
                type="primary"
                size="small"
                round
                @click="editCLue"
                >{{ $t("consult.编辑") }}</el-button
              >
              <el-button
                v-if="
                  enquiryType == '1'
                    ? permissions['enquiry_all_follower_edit']
                    : enquiryType == '2'
                    ? permissions['enquiry_mine_follower_edit']
                    : true
                "
                type="primary"
                size="small"
                round
                @click="editAssigneds"
                >{{ $t("consult.跟进人") }}</el-button
              >
              <el-button
                v-if="
                  (enquiryType == '1'
                    ? clueData['followStatus'] == 1 ||
                      clueData['followStatus'] == 0
                    : clueData['followStatus'] == 1 ||
                      clueData['followStatus'] == 0) &&
                  canShowChangeStatus('apply')
                "
                type="primary"
                size="small"
                round
                @click="changeClueStatus('apply')"
                >{{ $t("consult.申请") }}</el-button
              >
              <el-button
                v-if="
                  (enquiryType == '1'
                    ? permissions['enquiry_all_status_enter'] &&
                      clueData['followStatus'] === 2
                    : permissions['enquiry_mine_status_enter'] &&
                      clueData['followStatus'] === 2) &&
                  canShowChangeStatus('enter')
                "
                type="primary"
                size="small"
                round
                @click="changeClueStatus('enter')"
                >{{ $t("consult.入学") }}</el-button
              >
              <el-button
                v-if="
                  (enquiryType == '1'
                    ? clueData['followStatus'] == 3 &&
                      permissions['thepool_user_student_leaving']
                    : clueData['followStatus'] == 3 &&
                      permissions['thepool_user_student_mine_leaving']) &&
                  canShowChangeStatus('leaving')
                "
                type="primary"
                size="small"
                round
                @click="changeClueStatus('leaving')"
                >{{ $t("consult.离校") }}</el-button
              >
              <el-button
                v-if="
                  enquiryType == '1'
                    ? (permissions['enquiry_all_status_close'] &&
                        (clueData['followStatus'] == 1 ||
                          clueData['followStatus'] == 0)) ||
                      (permissions['enquiry_all_status_batch_apply_close'] &&
                        clueData['followStatus'] == 2)
                    : (permissions['enquiry_mine_status_close'] &&
                        (clueData['followStatus'] == 1 ||
                          clueData['followStatus'] == 0)) ||
                      (permissions['enquiry_mine_status_batch_apply_close'] &&
                        clueData['followStatus'] == 2)
                "
                type="defult"
                size="small"
                round
                @click="changeClueStatus('close')"
                >{{ $t("consult.关闭") }}</el-button
              >
              <el-button
                v-if="
                  enquiryType == '1'
                    ? permissions['enquiry_all_status_active'] &&
                      clueData['followStatus'] == 4
                    : permissions['enquiry_mine_status_active'] &&
                      clueData['followStatus'] == 4
                "
                type="defult"
                size="small"
                round
                @click="changeClueStatus('activate')"
                >{{ $t("consult.激活") }}</el-button
              >
            </div>
            <div class="thepool-btns" v-if="currentTab === 'studentInfo'">
              <el-button
                v-if="
                  enquiryType == '1'
                    ? permissions['thepool_user_student_mine_add']
                    : permissions['thepool_user_student_add']
                "
                type="primary"
                size="small"
                round
                @click="addStudentBindClue"
                >{{ $t("consult.新增") }}</el-button
              >
              <el-button
                v-if="
                  studentList.length > 0 &&
                  (enquiryType == '1'
                    ? permissions['thepool_user_student_mine_edit']
                    : permissions['thepool_user_student_edit'])
                "
                type="primary"
                size="small"
                round
                @click="editStudentBindClue"
                >{{ $t("consult.编辑") }}</el-button
              >
              <el-button
                v-if="
                  enquiryType == '1'
                    ? permissions['enquiry_mine_bind_student']
                    : permissions['enquiry_bind_student']
                "
                type="primary"
                size="small"
                round
                @click="setStudentClue"
                >{{ $t("consult.绑定") }}</el-button
              >
            </div>
            <div class="thepool-btns" v-if="currentTab === 'guardianInfo'">
              <el-button
                v-if="
                  enquiryType == '1'
                    ? permissions['thepool_user_guardian_mine_add']
                    : permissions['thepool_user_guardian_add']
                "
                type="primary"
                size="small"
                round
                @click="addGuardianBindClue"
                >{{ $t("consult.新增") }}</el-button
              >
              <el-button
                v-if="
                  guardianList.length > 0 &&
                  (enquiryType == '1'
                    ? permissions['thepool_user_guardian_mine_edit']
                    : permissions['thepool_user_guardian_edit'])
                "
                type="primary"
                size="small"
                round
                @click="editGuardianBindClue"
                >{{ $t("consult.编辑") }}</el-button
              >
              <el-button
                v-if="
                  enquiryType == '1'
                    ? permissions['enquiry_mine_bind_guardian']
                    : permissions['enquiry_bind_guardian']
                "
                type="primary"
                size="small"
                round
                @click="setGuardianClue"
                >{{ $t("consult.绑定") }}</el-button
              >
            </div>
          </div>
          <div class="thepool-detail_content">
            <el-scrollbar class="detail-content" height="100%">
              <!-- 线索详情 -->
              <DETAIL-ENQUIRY
                v-show="currentTab === 'clueInfo'"
                ref="DETAIL-ENQUIRY"
              />
              <!-- 学生详情 -->
              <DETAIL-STUDENT
                v-show="currentTab === 'studentInfo'"
                ref="DETAIL-STUDENT"
              />
              <!-- 家长详情 -->
              <DETAIL-PARENT
                v-show="currentTab === 'guardianInfo'"
                ref="DETAIL-PARENT"
              />
            </el-scrollbar>
          </div>
        </div>
        <div class="thepool-detail_right" ref="detailRight">
          <div class="thepool-detail_top">
            <div class="title">{{ $t("consult.跟进记录") }}</div>
            <div class="thepool-btns">
              <el-button type="primary" round @click="addLogList">{{
                $t("consult.新增")
              }}</el-button>
            </div>
          </div>
          <!-- 跟进记录 -->
          <div class="pool-tabs">
            <el-tabs v-model="currentFollow" @tab-click="changeFollowType">
              <el-tab-pane :label="$t('consult.全部')" name="all">
              </el-tab-pane>
              <el-tab-pane
                v-for="(item, index) in dictionary['follow_type']"
                :key="index"
                :label="i18nlocel == 'en' ? item.enLabel : item.label"
                :name="item.value"
              >
              </el-tab-pane>
            </el-tabs>
          </div>
          <el-scrollbar height="100%" class="thepool-detail_content">
            <LOG-LIST
              ref="LOG-LIST"
              :studentList="studentList"
              :guardianList="guardianList"
            />
          </el-scrollbar>
        </div>
      </div>
      <!-- 修改归属校区 -->
      <changeSchool
        ref="changeSchool"
        v-if="showChangeSchool"
        :showChangeSchool="showChangeSchool"
        :clueId="currentClueId"
        @changeModal="changeModal"
        @initData="initData"
      />
      <!-- 编辑学生信息 -->
      <editCLue
        ref="editCLue"
        v-if="showEditClue"
        :showEditClue="showEditClue"
        :clueData="clueData"
        :templateForm="templateForm"
        @changeModal="changeModal"
        @initData="initData"
      />
      <!-- 修改跟进人 -->
      <addAssigned
        ref="addAssigned"
        v-if="showAddAssigned"
        :type="'edit'"
        :showAddAssigned="showAddAssigned"
        :clueIds="[currentClueId]"
        @changeModal="changeModal"
        @initData="initData"
      />
      <!-- 新增记录信息 -->
      <addLog
        ref="addLog"
        v-if="showAddLog"
        :showAddLog="showAddLog"
        :currentClueId="currentClueId"
        @changeModal="changeModal"
        @initData="initData"
      />
      <!-- 新增学生 -->
      <AddStudent ref="AddStudent" @initData="initPageData" />
      <!-- 绑定学生 -->
      <BindClueStudent ref="BindClueStudent" @initData="initPageData" />
      <!-- 新增家长 -->
      <AddGuardians ref="AddGuardians" @initData="initPageData" />
      <!-- 绑定家长 -->
      <BindClueGuardians ref="BindClueGuardians" @initData="initPageData" />
      <!-- 改变状态 -->
      <changeStatus
        v-if="showchangeStatus"
        :showchangeStatus="showchangeStatus"
        :currentClueType="currentClueType"
        :isMultiple="isMultiple"
        :currentClueId="currentClueId"
        :studentList="enterStudentList"
        :isClue="true"
        @changeModal="changeModal"
        @initData="initPageData"
      />
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getPoolStudentTemplate,
  getStudentfillInfo,
} from "@/api/consult/collection.js";
import { getClueDetail } from "@/api/consult/index.js";
import DETAILENQUIRY from "@/page/thepool/detailinfo/enquiry.vue";
import DETAILSTUDENT from "@/page/thepool/detailinfo/student.vue";
import DETAILPARENT from "@/page/thepool/detailinfo/parent.vue";
import LOGLIST from "@/page/thepool/consult/modal/loglist.vue";
import changeStatus from "@/page/thepool/consult/modal/changestatus.vue";
import editCLue from "@/page/thepool/consult/modal/editclue.vue";
import addLog from "@/page/thepool/consult/modal/addlog.vue";
import addAssigned from "@/page/thepool/consult/modal/addAssigned.vue";
import changeSchool from "@/page/thepool/consult/modal/changeschool.vue";
import AddStudent from "@/page/thepool/modal/addstudent.vue";
import AddGuardians from "@/page/thepool/modal/addguardians.vue";
import LogList from "@/page/thepool/consult/modal/loglist.vue";
import BindClueGuardians from "@/page/thepool/consult/modal/bindclueguardians.vue";
import BindClueStudent from "@/page/thepool/consult/modal/bindcluestudent.vue";
import { useDragResize } from "@/util/dragresize";
export default {
  name: "PCOrderDetail",
  components: {
    DETAILENQUIRY,
    DETAILSTUDENT,
    DETAILPARENT,
    LOGLIST,
    changeStatus,
    editCLue,
    addLog,
    addAssigned,
    changeSchool,
    AddStudent,
    AddGuardians,
    BindClueGuardians,
    BindClueStudent,
  },
  data() {
    return {
      // 当前选中的tab
      currentTab: "clueInfo",
      currentClueId: "",
      studentList: [],
      guardianList: [],
      enquiryType: "",
      clueData: {},
      dynamicInfos: [],
      showChangeSchool: false,
      showGuardians: false,
      showchangeStatus: false,
      showAddLog: false,
      showAddAssigned: false,
      showEditClue: false,
      //线索关联的学生
      studentList: [],
      //线索关联的家长
      guardianList: [],
      currentFollow: "all",
      enterStudentList: [],
      destroyDrag: null,
    };
  },

  created() {
    this.enquiryType = this.$route.query.type;
    this.currentClueId = this.$route.query.clueId;
    this.initPageData();
  },
  mounted() {
    const el = this.$refs.detailRight;
    if (el) {
      // 调用拖拽
      this.destroyDrag = useDragResize(el, {
        minWidth: 300,
        maxWidth: 800,
        throttleDelay: 10,
      });
    }
  },
  beforeDestroy() {
    // 页面销毁时清除事件（防止内存泄漏）
    if (this.destroyDrag) {
      this.destroyDrag();
    }
  },
  activated() {
    this.initPageData();
  },
  computed: {
    ...mapGetters([
      "dictionary",
      "userList",
      "permissions",
      "i18nlocel",
      "pooldictionary",
      "pooldictpermissions",
    ]),
  },
  watch: {
    i18nlocel() {},
  },
  methods: {
    // 切换tab
    changeTab(tab) {
      this.currentTab = tab;
    },
    initData() {
      this.initPageData();
      this.changeModal(false);
    },
    // 初始化数据
    initPageData() {
      getClueDetail(this.currentClueId).then((res) => {
        if (res.data.success) {
          this.$nextTick(async () => {
            let {
              clueInfo,
              parentInfo,
              studentInfo,
              records,
              followers,
              dynamicInfos,
              schools,
            } = res.data.data;
            this.clueData = {
              ...clueInfo,
              schools: schools || [],
            };
            this.studentList = studentInfo || [];
            this.guardianList = parentInfo || [];
            this.dynamicInfos = dynamicInfos || [];
            this.$nextTick(async () => {
              // 线索信息
              this.$refs["DETAIL-ENQUIRY"].initData(res);
              // 学生信息
              this.$refs["DETAIL-STUDENT"].initData(studentInfo);
              // 家长信息
              this.$refs["DETAIL-PARENT"].initData(parentInfo);
              this.$refs["LOG-LIST"].filterLog["outerId"] = clueInfo.id;
              this.$refs["LOG-LIST"].setLogList(records);
            });
          });
        }
      });
    },
    // 修改归属校区
    changeSchool() {
      this.showChangeSchool = true;
      this.$nextTick(() => {
        this.$refs["changeSchool"].ruleForm["schools"] =
          this.clueData["schools"];
        this.$refs["changeSchool"].setSchoolList(this.clueData["schools"]);
      });
    },
    // 添加跟进人
    editAssigneds() {
      this.showAddAssigned = true;
      this.$nextTick(() => {
        this.$refs["addAssigned"].ruleForm.userIds = this.followersIds;
      });
    },
    // 编辑咨询
    editCLue() {
      this.showEditClue = true;
      this.$nextTick(() => {
        this.$refs["editCLue"].init(this.clueData, this.dynamicInfos || []);
      });
    },

    // 新增跟进记录
    addLogList() {
      this.showAddLog = true;
      this.$nextTick(() => {
        if (this.studentList.length > 0) {
          let studentList = this.studentList.map((item) => {
            return {
              id: item.id,
              showName: item["baseInfo"]["showName"],
            };
          });
          this.$refs["addLog"].studentList = studentList;
        }
        if (this.guardianList.length > 0) {
          let guardianList = this.guardianList.map((item) => {
            return {
              id: item.id,
              showName: item["guardianInfo"]["showName"],
            };
          });
          this.$refs["addLog"].guardianList = guardianList;
        }
      });
    },
    // 弹窗
    changeModal(type) {
      this.showGuardians = type;
      this.showchangeStatus = type;
      this.showEditClue = type;
      this.showAddLog = type;
      this.showAddAssigned = type;
      this.showChangeSchool = type;
    },
    canShowChangeStatus(type) {
      let isShow = false;
      if (this.studentList.length == 0) return isShow;
      this.studentList.map((item) => {
        if (!isShow) {
          switch (type) {
            case "apply":
              if (item["baseInfo"]["status"] == "0") {
                isShow = true;
              }
              break;
            case "enter":
              if (item["baseInfo"]["status"] == "1") {
                isShow = true;
              }
              break;
            case "leaving":
              if (item["baseInfo"]["status"] == "2") {
                isShow = true;
              }
              break;
          }
        }
      });

      return isShow;
    },
    changeClueStatus(type) {
      this.enterStudentList = [];
      switch (type) {
        case "enter":
          this.studentList.map((item) => {
            if (
              item["baseInfo"]["status"] == 1 ||
              item["baseInfo"]["status"] == 3
            ) {
              this.enterStudentList.push({
                ...item["baseInfo"],
              });
            }
          });
          if (this.enterStudentList.length == 0) {
            this.$message.warning("该线索无可入学学生");
          } else {
            this.currentClueType = type;
            this.showchangeStatus = true;
          }
          break;
        case "apply":
          this.studentList.map((item) => {
            if (item["baseInfo"]["status"] == 0) {
              this.enterStudentList.push({
                ...item["baseInfo"],
              });
            }
          });
          if (this.enterStudentList.length == 0) {
            this.$message.warning("该线索无可申请学生");
          } else {
            this.currentClueType = type;
            this.showchangeStatus = true;
          }
          break;
        case "leaving":
          this.studentList.map((item) => {
            if (item["baseInfo"]["status"] == 2) {
              this.enterStudentList.push({
                ...item["baseInfo"],
              });
            }
          });
          if (this.enterStudentList.length == 0) {
            this.$message.warning("该线索无可离校学生");
          } else {
            this.currentClueType = type;
            this.showchangeStatus = true;
          }
          break;
        case "graduation":
          this.studentList.map((item) => {
            if (item["baseInfo"]["status"] == 2) {
              this.enterStudentList.push({
                ...item["baseInfo"],
              });
            }
          });
          if (this.enterStudentList.length == 0) {
            this.$message.warning("该线索无可毕业学生");
          } else {
            this.currentClueType = type;
            this.showchangeStatus = true;
          }
          break;

        default:
          this.currentClueType = type;
          this.showchangeStatus = true;
          break;
      }
    },
    // 切换跟进方式
    changeFollowType(e) {
      this.$refs["LOG-LIST"].changeFollowType({ value: e.name });
    },
    // 新增学生绑定线索
    addStudentBindClue() {
      this.$refs["AddStudent"].addStudentBindClue(this.currentClueId);
    },
    // 编辑学生绑定线索
    editStudentBindClue() {
      let currentStudentId = this.$refs["DETAIL-STUDENT"].currentStudentId;
      this.$refs["AddStudent"].getStudentDetail(currentStudentId);
    },
    // 绑定学生
    setStudentClue() {
      this.$refs["BindClueStudent"].getStudentClue(this.currentClueId);
    },
    // 新增家长绑定线索
    addGuardianBindClue() {
      this.$refs["AddGuardians"].addGuardianBindClue(this.currentClueId);
    },
    // 编辑家长
    editGuardianBindClue() {
      let currentGuardianId = this.$refs["DETAIL-PARENT"].currentGuardianId;
      this.$refs["AddGuardians"].getGuardianDetail(currentGuardianId);
    },
    // 绑定家长
    setGuardianClue() {
      this.$refs["BindClueGuardians"].setGuardianClueList(
        this.guardianList,
        this.currentClueId
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
