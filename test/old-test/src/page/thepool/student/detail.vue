<template>
  <div class="thepool_page">
    <el-scrollbar style="height: 100%">
      <div class="thepool-detail">
        <div class="thepool-detail_left">
          <div class="thepool-detail_top">
            <div class="thepool-tabs">
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
            <div class="thepool-btns" v-if="currentTab === 'studentInfo'">
              <el-button
                v-if="
                  studentType == '2' &&
                  permissions['enquiry_student_school_edit']
                "
                type="primary"
                size="small"
                round
                @click="changeSchool"
                >{{ $t("consult.修改申请校区") }}</el-button
              >
              <el-button
                v-if="
                  studentType == '1'
                    ? permissions['thepool_user_student_mine_edit']
                    : permissions['thepool_user_student_edit']
                "
                type="primary"
                size="small"
                round
                @click="editStudent"
                >{{ $t("consult.编辑") }}</el-button
              >
              <el-button
                v-if="
                  (studentData['status'] == '1' ||
                    studentData['status'] == '3') &&
                  (studentType == '1'
                    ? permissions['thepool_user_student_mine_enter']
                    : permissions['thepool_user_student_enter'])
                "
                type="primary"
                size="small"
                round
                @click="handleBtns('batchEnrollment')"
                >{{
                  studentData["status"] == "3"
                    ? $t("consult.重新入学")
                    : $t("consult.入学")
                }}</el-button
              >
              <el-button
                v-if="
                  studentData['status'] == '2' &&
                  (studentType == '1'
                    ? permissions['thepool_user_student_mine_leaving']
                    : permissions['thepool_user_student_leaving'])
                "
                type="primary"
                size="small"
                round
                @click="handleBtns('batchLeaving')"
                >{{ $t("consult.离校") }}</el-button
              >
              <el-button
                v-if="
                  studentData['status'] == '2' &&
                  (studentType == '1'
                    ? permissions['thepool_user_student_mine_graduated']
                    : permissions['thepool_user_student_graduated'])
                "
                type="primary"
                size="small"
                round
                @click="handleBtns('batchGraduation')"
                >{{ $t("consult.毕业") }}</el-button
              >
              <el-button
                v-if="
                  studentData['status'] == '0' &&
                  (studentType == '1'
                    ? permissions['thepool_user_student_mine_apply']
                    : permissions['thepool_user_student_apply'])
                "
                type="primary"
                size="small"
                round
                @click="handleBtns('batchApply')"
                >{{ $t("consult.申请") }}</el-button
              >
              <el-button
                v-if="
                  studentType == '1'
                    ? permissions['thepool_user_student_mine_print']
                    : permissions['thepool_user_student_print']
                "
                @click="printPdf"
                type="primary"
                size="small"
                round
                >{{ $t("consult.打印") }}</el-button
              >
            </div>
            <div class="thepool-btns" v-if="currentTab === 'guardianInfo'">
              <el-button
                v-if="
                  studentType == '1'
                    ? permissions['thepool_user_guardian_mine_add']
                    : permissions['thepool_user_guardian_add']
                "
                type="primary"
                size="small"
                round
                @click="addGuardians"
                >{{ $t("consult.新增") }}</el-button
              >
              <el-button
                v-if="
                  studentType == '1'
                    ? permissions['thepool_user_student_mine_bind']
                    : permissions['thepool_user_student_bind']
                "
                type="primary"
                size="small"
                round
                @click="bindGuardians"
                >{{ $t("consult.绑定") }}</el-button
              >
            </div>
          </div>
          <div class="thepool-detail_content">
            <el-scrollbar class="detail-content">
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
            <div class="thepool-btns"></div>
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
            <LOG-LIST ref="LOG-LIST" />
          </el-scrollbar>
        </div>
      </div>
      <!-- 编辑学生 -->
      <ADD-STUDENT ref="AddStudent" @initData="getStudentDetail" />
      <!-- 新增家长 -->
      <ADD-GUARDIANS ref="ADD-GUARDIANS" @initData="getGuardianStudent" />
      <!-- 绑定家长 -->
      <BIND-GUARDIANS ref="BIND-GUARDIANS" @initData="getGuardianStudent" />
      <!-- 修改归属校区 -->
      <CHANGE-SCHOOL
        ref="CHANGE-SCHOOL"
        :id="currentStudentId"
        :type="'student'"
        @initData="getStudentDetail"
      />
      <!-- 改变状态 -->
      <CHANGE-STATUS
        ref="changeStatus"
        v-if="showchangeStatus"
        :showchangeStatus="showchangeStatus"
        :studentIds="[currentStudentId]"
        :isMultiple="true"
        :currentClueType="studentStatus"
        @changeModal="closeModal"
        @initData="getStudentDetail"
      />
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getStudentDetail, getGuardianStudent } from "@/api/consult/student.js";
import DETAILSTUDENT from "@/page/thepool/detailinfo/student.vue";
import DETAILPARENT from "@/page/thepool/detailinfo/parent.vue";
import LOGLIST from "@/page/thepool/consult/modal/loglist.vue";
import ADDGUARDIANS from "@/page/thepool/modal/addguardians.vue";
import BINDGUARDIANS from "@/page/thepool/modal/bindguardians.vue";
import CHANGESCHOOL from "@/page/thepool/modal/changeschool.vue";
import ADDSTUDENT from "@/page/thepool/modal/addstudent.vue";
import BINDSTUDENT from "@/page/thepool/modal/bindguardians.vue";
import CHANGESTATUS from "@/page/thepool/consult/modal/changestatus.vue";
import { useDragResize } from "@/util/dragresize";
export default {
  name: "PCOrderDetail",
  components: {
    DETAILSTUDENT,
    DETAILPARENT,
    LOGLIST,
    ADDGUARDIANS,
    BINDGUARDIANS,
    CHANGESCHOOL,
    ADDSTUDENT,
    BINDSTUDENT,
    CHANGESTATUS,
  },
  data() {
    return {
      // 当前选中的tab
      currentTab: "studentInfo",
      currentFollow: "all",
      studentType: "",
      currentStudentId: "",
      studentStatus: "",
      showchangeStatus: false,
      studentData: {},
      schools: [],
    };
  },

  created() {
    this.studentType = this.$route.query.type;
    this.currentStudentId = this.$route.query.id;
    this.initData();
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
  activated() {},
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
      this.getStudentDetail();
      this.getGuardianStudent();
    },
    getStudentDetail() {
      getStudentDetail(this.currentStudentId).then((res) => {
        if (res.data.success) {
          let { baseInfo, dynamicInfos, extendInfo, records, schools, photos } =
            res.data.data;
          this.studentData = {
            ...baseInfo,
          };
          this.schools = schools || [];
          let studentInfo = {
            baseInfo,
            dynamicInfos,
            extendInfo,
            schools,
            photos,
            id: this.currentStudentId,
          };
          this.$nextTick(async () => {
            // 学生信息
            this.$refs["DETAIL-STUDENT"].initData([studentInfo]);
            this.$refs["LOG-LIST"].setLogList(records);
          });
        }
      });
    },
    getGuardianStudent() {
      getGuardianStudent({ studentId: this.currentStudentId }).then((res) => {
        if (res.data.success) {
          let data = res.data.data || [];
          this.$nextTick(async () => {
            // 家长信息
            this.$refs["DETAIL-PARENT"].initData(data);
          });
        }
      });
    },
    // 编辑学生信息
    editStudent() {
      this.$refs["AddStudent"].getStudentDetail(this.currentStudentId);
    },
    handleBtns(type) {
      switch (type) {
        case "batchEnrollment":
          this.studentStatus = "enter";
          this.showchangeStatus = true;
          this.$nextTick(() => {
            this.$refs["changeStatus"].setStudentDetail([this.studentData]);
          });
          break;
        case "batchLeaving":
          this.studentStatus = "leaving";
          this.showchangeStatus = true;
          break;
        case "batchApply":
          this.studentStatus = "apply";
          this.showchangeStatus = true;
          this.$nextTick(() => {
            this.$refs["changeStatus"].setStudentDetail([this.studentData]);
          });
          break;
        case "batchGraduation":
          this.studentStatus = "graduation";
          this.showchangeStatus = true;
          break;
      }
    },
    // 新增家长
    addGuardians() {
      this.$refs["ADD-GUARDIANS"].addGuardianBindSt(this.currentStudentId);
    },
    // 绑定家长
    bindGuardians() {
      this.$refs["BIND-GUARDIANS"].getGuardianStudent(this.currentStudentId);
    },
    changeSchool() {
      this.$refs["CHANGE-SCHOOL"].setSchoolList(this.schools);
    },
    // 切换跟进方式
    changeFollowType(e) {
      this.$refs["LOG-LIST"].changeFollowType({ value: e.name });
    },
    closeModal(type) {
      this.showchangeStatus = type;
    },
    printPdf() {
      this.$router.push({
        path: "/thepool/student/studentpdf",
        query: {
          id: this.$route.query.id,
          schoolId: this.studentData.applySchool,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
