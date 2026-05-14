<template>
  <div class="thepool_page">
    <el-scrollbar style="height: 100%">
      <div class="orderDetail">
        <div class="orderDetail_content">
          <div class="orderDetail_item">
            <div class="orderDetail_item_title df_sb">
              <div>{{ $t("consult.学生信息") }}</div>
              <div>
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
                <el-button @click="printPdf" type="primary" size="small" round
                  >打印</el-button
                >
              </div>
            </div>
            <div class="orderDetail_baseinfo">
              <div class="orderDetail_baseinfo_item">
                <span>{{ $t("consult.归属校区") }}</span>
                <span :title="$checkNull(studentData['schoolsLabel'])">{{
                  $checkNull(studentData["schoolsLabel"])
                }}</span>
              </div>
              <div class="orderDetail_baseinfo_item">
                <span>{{ $t("consult.状态") }}</span>
                <span :title="$checkNull(studentData['statusLabel'])">{{
                  $checkNull(studentData["statusLabel"])
                }}</span>
              </div>
              <div
                class="orderDetail_baseinfo_item"
                v-for="(item, index) in studentInfo"
                :key="index"
              >
                <span>{{ $t("consult")[item.label] }}</span>
                <span :title="$checkNull(studentData[item.prop])">{{
                  $checkNull(studentData[item.prop])
                }}</span>
              </div>
              <div class="orderDetail_baseinfo_item">
                <span>{{ $t("consult.住宿类型") }}</span>
                <span :title="$checkNull(studentData['boardingLabel'])">{{
                  $checkNull(studentData["boardingLabel"])
                }}</span>
              </div>
              <div style="width: 100%" class="orderDetail_baseinfo_item">
                <span>{{ $t("consult.头像") }}</span>
                <div v-if="studentData.photoUrl" style="margin-top: 10px">
                  <img
                    style="width: 100px; height: 100px"
                    :src="studentData.photoUrl"
                    alt=""
                  />
                </div>
                <span v-else>--</span>
              </div>
            </div>
            <div class="orderDetail_baseinfo">
              <div
                class="orderDetail_baseinfo_item"
                v-for="(item, index) in studentExtendInfo"
                :key="index"
              >
                <span>{{ $t("consult")[item.label] }}</span>
                <span :title="$checkNull(studentExtendData[item.prop])">{{
                  $checkNull(studentExtendData[item.prop])
                }}</span>
              </div>
            </div>
            <div v-for="(item, index) in studentTemplateList" :key="index">
              <!-- 学生动态表单 -->
              <FromItemDetail
                :ref="`FromItemDetailStudent${item.templateId}`"
              />
            </div>
            <div v-for="(item, index) in fillDynamicList" :key="index">
              <!-- 学生动态表单 -->
              <FromItemDetail :ref="`fillDynamic${item.templateId}`" />
            </div>
          </div>
          <div class="orderDetail_item">
            <div class="orderDetail_item_title df_sb">
              <div>{{ $t("consult.家长信息") }}</div>
              <div class="orderDetail_item_tabs" v-if="guardianList.length > 1">
                <div class="orderDetail_item_tablist">
                  <div
                    @click="changeGuardian(item)"
                    :class="[
                      'orderDetail_item_tablist_item',
                      {
                        tablist_item_active: currentGuardianId == item.id,
                      },
                    ]"
                    v-for="(item, index) in guardianList"
                    :key="item.id"
                  >
                    {{ item["showName"] }}
                  </div>
                </div>
              </div>
              <div class="df_sb">
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
            <div v-if="guardianList.length > 0">
              <div class="orderDetail_baseinfo">
                <div
                  class="orderDetail_baseinfo_item"
                  v-for="(item, index) in parentInfo"
                  :key="index"
                >
                  <span>{{ $t("consult")[item.label] }}</span>
                  <span :title="$checkNull(guardianData[item.prop])">{{
                    $checkNull(guardianData[item.prop])
                  }}</span>
                </div>
                <div
                  style="width: 100% !important"
                  class="orderDetail_baseinfo_item"
                >
                  <span>{{ $t("consult.头像") }}</span>
                  <div v-if="guardianData.photoUrl" style="margin-top: 10px">
                    <img
                      style="width: 100px; height: 100px"
                      :src="guardianData.photoUrl"
                      alt=""
                    />
                  </div>
                  <span v-else>--</span>
                </div>
              </div>
              <div v-for="(item, index) in guardianTemplateList" :key="index">
                <!-- 家长动态表单 -->
                <FromItemDetail :ref="`FromItemGuardian${item.templateId}`" />
              </div>
            </div>
            <el-empty v-else description="No Data~"></el-empty>
          </div>
          <div class="orderDetail_item">
            <div class="orderDetail_item_title df_sb">
              <div>{{ $t("consult.跟进记录") }}</div>
            </div>
            <LogList
              ref="LogList"
              :isClue="false"
              :studentList="studentList"
              :guardianList="guardianList"
            />
          </div>
        </div>

        <!-- 编辑学生 -->
        <AddStudent ref="AddStudent" @initData="getStudentDetail" />
        <!-- 绑定家长 -->
        <Bindguardians ref="Bindguardians" @initData="getGuardianStudent" />
        <!-- 新增家长 -->
        <AddGuardians ref="AddGuardians" @initData="getGuardianStudent" />
        <!-- 改变状态 -->
        <changeStatus
          ref="changeStatus"
          v-if="showchangeStatus"
          :showchangeStatus="showchangeStatus"
          :studentIds="[studentId]"
          :isMultiple="true"
          :currentClueType="studentStatus"
          @changeModal="closeModal"
          @initData="getStudentDetail"
        />
        <!-- 修改归属校区 -->
        <changeSchool
          ref="changeSchool"
          :id="studentId"
          :type="'student'"
          @initData="getStudentDetail"
        />
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getPoolStudentTemplate,
  getStudentfillInfo,
} from "@/api/consult/collection.js";
import {
  getStudentDetail,
  getGuardianStudent,
  getStudentClue,
} from "@/api/consult/student.js";
// 动态模板
import {
  getTemplateOuterForm,
  getTemplateOuterValue,
} from "@/api/space/templatedynamic.js";
import { getTemplateInfoByType } from "@/api/consult/template.js";
import { getOuterFile, uploadOuterFile } from "@/api/upload/index.js";
import { consult } from "@/const/consult/index.js";
import Table from "@/components/common/Table.vue";
import ShowText from "@/components/common/ShowText.vue";
import AddGuardians from "@/page/thepool/modal/addguardians.vue";
import AddStudent from "@/page/thepool/modal/addstudent.vue";
import Bindguardians from "@/page/thepool/modal/bindguardians.vue";
import changeStatus from "@/page/thepool/consult/modal/changestatus.vue";
import LogList from "@/page/thepool/consult/modal/loglist.vue";
import changeSchool from "@/page/thepool/modal/changeschool.vue";
import FromItemDetail from "@/components/thepoolcommon/dynamicform/fromitemdetail.vue";

export default {
  name: "PCOrderDetail",
  components: {
    Table,
    ShowText,
    AddStudent,
    AddGuardians,
    Bindguardians,
    changeStatus,
    LogList,
    changeSchool,
    FromItemDetail,
  },
  data() {
    return {
      showchangeStatus: false,
      enrolledStatus: consult["enrolledStatus"],
      guardianList: [],
      guardianData: {},
      currentGuardianId: "",
      parentInfo: consult["guardiansTitle"],
      studentData: {},
      studentInfo: consult["studentTitle"],
      studentExtendData: {},
      studentExtendInfo: consult["studentExtendTitle"],
      sexList: consult["sexList"],
      studentList: [],
      studentId: "",
      studentStatus: "",
      studentType: "",
      templateForm: {
        templateFormId: "",
        templateValueId: "",
        schoolId: "",
        studentId: "",
      },
      studentTemplateList: [],
      guardianTemplateList: [],
      fillDynamicList: [],
    };
  },

  created() {
    this.studentType = this.$route.query.type;
    this.studentId = this.$route.query.id;
    this.initData();
  },
  mounted() {},
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
    initData() {
      this.getStudentDetail();
      this.getGuardianStudent();
    },
    getStudentDetail() {
      getStudentDetail(this.studentId).then((res) => {
        if (res.data.success) {
          let { baseInfo, dynamicInfos, extendInfo, records, schools, photos } =
            res.data.data;
          let data = baseInfo;
          this.studentExtendData = extendInfo || {};
          this.studentData = {
            ...data,
            schools,
            enrollYear: data["enrollYear"]
              ? `${data["enrollYear"]}-${data["enrollYear"] + 1}`
              : "--",
            statusLabel: this.$getListLabel(this.enrolledStatus, data.status),
            isDropoutLabel: this.$getListLabel(
              consult["yesOrno"],
              data.isDropout
            ),
            sexlabel: this.$getListLabel(this.sexList, data.sex),
            applySchoolLabel: this.$getListLabel(
              this.pooldictionary,
              data.applySchool
            ),
            enrollLevelLabel: data.applySchool
              ? this.getDictLabel(
                  data.applySchool,
                  "enquiry_enroll_level",
                  data.enrollLevel
                )
              : this.$getListLabel(
                  this.dictionary["enquiry_enroll_level"],
                  data.enrollLevel
                ),
            enrollmentGradeLabel: data.applySchool
              ? this.getDictLabel(
                  data.applySchool,
                  "enquiry_enroll_level",
                  data.enrollmentGrade
                )
              : this.$getListLabel(
                  this.dictionary["enquiry_enroll_level"],
                  data.enrollmentGrade
                ),
            directionLabel: data.applySchool
              ? this.getDictLabel(
                  data.applySchool,
                  "enquiry_direction",
                  data.direction
                )
              : this.$getListLabel(
                  this.dictionary["enquiry_direction"],
                  data.direction
                ),
            enrollLevelInLabel: data.applySchool
              ? this.getDictLabel(
                  data.applySchool,
                  "enquiry_enroll_level",
                  data.enrollLevelIn
                )
              : this.$getListLabel(
                  this.dictionary["enquiry_enroll_level"],
                  data.enrollLevelIn
                ),
            paySubjectLabel: data.applySchool
              ? this.getDictLabel(
                  data.applySchool,
                  "enquiry_pay_subject",
                  data.paySubject
                )
              : this.$getListLabel(
                  this.dictionary["enquiry_pay_subject"],
                  data.paySubject
                ),
            boardingLabel: this.$getListLabel(
              this.dictionary["enquiry_boarding"],
              data.boarding
            ),
          };
          if (this.studentData["schools"].length > 0) {
            let arr = [];
            this.studentData["schools"].map((item) => {
              arr.push(this.$getListLabel(this.pooldictionary, item));
            });
            this.studentData["schoolsLabel"] = String(arr);
          }
          this.$nextTick(async () => {
            if (photos && photos.length > 0) {
              photos.forEach(async (item) => {
                if (String(item.type) == "0") {
                  const file = await getOuterFile(item.photoId);
                  let photoUrl = window.URL.createObjectURL(file);
                  console.log(photoUrl);
                  this.studentData.photoUrl = photoUrl;
                }
              });
            }
            this.$refs["LogList"].setLogList(records);
            this.templateForm["studentId"] = this.studentId;
            if (data["applySchool"]) {
              this.templateForm["schoolId"] = this.$getListLabel(
                this.pooldictionary,
                data["applySchool"],
                "id",
                "value"
              );

              this.$nextTick(async () => {
                this.getStudentDynamic(dynamicInfos, data["applySchool"]);
                if (data["applySchool"] == 5) {
                  this.getFillDynamic(data["applySchool"], this.studentId);
                } else {
                  this.fillDynamicList = [];
                }
              });
            } else {
              this.studentTemplateList = [];
            }
          });
        }
      });
    },
    async getStudentDynamic(dynamicInfos = [], schoolId) {
      let templateForm = await getTemplateInfoByType({ templateType: 1 });
      if (templateForm.length > 0) {
        this.studentTemplateList = templateForm.find(
          (dynamicItem) => dynamicItem.schoolId == schoolId
        ).templates;
        this.$nextTick(() => {
          this.studentTemplateList.map((item) => {
            let dynamicInfoItem = dynamicInfos.find(
              (dynamicItem) => dynamicItem.templateId == item.templateId
            );
            this.$refs[
              `FromItemDetailStudent${item.templateId}`
            ][0].getTemplateDetail(item, dynamicInfoItem);
          });
        });
      }
    },
    async getFillDynamic(applySchool) {
      let templateList = await getPoolStudentTemplate({
        applySchool: applySchool,
      });
      let studentFillList = await getStudentfillInfo({
        studentId: this.studentId,
      });
      this.fillDynamicList = templateList || [];
      let dynamicInfos = studentFillList["dynamicInfos"] || [];
      console.log("this.fillDynamicList ", this.fillDynamicList);
      console.log("dynamicInfos ", dynamicInfos);

      if (this.fillDynamicList && this.fillDynamicList.length > 0) {
        this.$nextTick(() => {
          this.fillDynamicList.map((item) => {
            let dynamicInfoItem = dynamicInfos.find(
              (dynamicItem) => dynamicItem.templateId == item.templateId
            );
            this.$refs[`fillDynamic${item.templateId}`][0].getTemplateDetail(
              item,
              dynamicInfoItem
            );
          });
        });
      }
    },
    getGuardianStudent() {
      getGuardianStudent({ studentId: this.studentId }).then((res) => {
        if (res.data.success) {
          this.guardianData = {};
          this.guardianList = [];
          let data = res.data.data;
          if (data && data.length > 0) {
            this.guardianList = data.map((item) => {
              return {
                schools: item.schools,
                ...item.guardianInfo,
                dynamicInfos: item.dynamicInfos || [],
                photos: item.photos || [],
              };
            });
            this.guardianList.map((item) => {
              item["showName"] =
                item["lastName"] && item["firstName"]
                  ? item["lastName"] + item["firstName"]
                  : !item["lastName"] && !item["firstName"]
                  ? "----"
                  : item["lastName"] || item["firstName"];
            });
            this.changeGuardian(this.guardianList[0]);
          }
        }
      });
    },
    changeGuardian(item) {
      this.currentGuardianId = item.id;
      this.setCurrentGuardian(item);
    },
    async setCurrentGuardian(item) {
      this.guardianTemplateList = [];
      this.guardianData = {
        ...item,
        sexlabel: this.$getListLabel(this.sexList, item.sex),
        relationTypeLabel: this.$getListLabel(
          this.dictionary["enquiry_relation_type"],
          item["relationType"]
        ),
      };

      console.log("this.guardianData", this.guardianData);
      this.$nextTick(async () => {
        this.getGuardianDynamic(item.dynamicInfos);
        if (item["photos"] && item["photos"].length > 0) {
          item["photos"].forEach(async (photos) => {
            if (String(photos.type) == "0") {
              const file = await getOuterFile(photos.photoId);
              let photoUrl = window.URL.createObjectURL(file);
              console.log("photoUrl", photoUrl);
              this.guardianData = {
                ...this.guardianData,
                photoUrl,
              };
            }
          });
        }
      });
    },
    async getGuardianDynamic(dynamicInfos = []) {
      let templateForm = await getTemplateInfoByType({ templateType: 2 });
      console.log("templateForm", templateForm);
      if (templateForm.length > 0) {
        this.guardianTemplateList = templateForm[0].templates;
        this.$nextTick(() => {
          this.guardianTemplateList.map((item) => {
            let dynamicInfoItem = dynamicInfos.find(
              (dynamicItem) => dynamicItem.templateId == item.templateId
            );
            this.$refs[
              `FromItemGuardian${item.templateId}`
            ][0].getTemplateDetail(item, dynamicInfoItem || {});
          });
        });
      }
    },
    // 编辑学生信息
    editStudent() {
      this.$refs["AddStudent"].getStudentDetail(this.$route.query.id);
    },
    // 绑定家长
    bindGuardians() {
      this.$refs["Bindguardians"].getGuardianStudent(this.$route.query.id);
    },
    addGuardians() {
      this.$refs["AddGuardians"].addGuardianBindSt(this.$route.query.id);
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
    changeSchool() {
      this.$refs["changeSchool"].setSchoolList(this.studentData["schools"]);
    },
    closeModal(type) {
      this.showchangeStatus = type;
    },
    getDictLabel(pid, type, cid) {
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
.orderDetail_item_tabs {
  flex: 1;
  height: 50px;
  position: relative;

  .orderDetail_item_tablist {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    // overflow-x: auto;
    .orderDetail_item_tablist_item {
      padding: 0 30px;
      cursor: pointer;
    }
    .tablist_item_active {
      color: #175e67;
      background: #eef5f6;
      position: relative;
      &::before {
        content: "";
        position: absolute;
        bottom: -1px;
        height: 2px;
        right: 0;
        left: 0;
        background: #175e67;
      }
    }
  }
}
</style>
