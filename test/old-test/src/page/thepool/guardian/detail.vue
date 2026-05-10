<template>
  <div class="thepool_page">
    <el-scrollbar style="height: 100%">
      <div class="orderDetail">
        <div class="orderDetail_content">
          <div class="orderDetail_item">
            <div class="orderDetail_item_title df_sb">
              <div>{{ $t("consult.家长信息") }}</div>
              <div>
                <el-button
                  v-if="
                    guardianType == '2' &&
                    permissions['enquiry_guardian_school_edit']
                  "
                  type="primary"
                  size="small"
                  round
                  @click="changeSchool"
                  >{{ $t("consult.修改申请校区") }}</el-button
                >
                <el-button
                  v-if="
                    guardianType == '1'
                      ? permissions['thepool_user_guardian_mine_edit']
                      : permissions['thepool_user_guardian_edit']
                  "
                  type="primary"
                  size="small"
                  round
                  @click="editGuardian"
                  >{{ $t("consult.编辑") }}</el-button
                >
              </div>
            </div>
            <div class="orderDetail_baseinfo">
              <div class="orderDetail_baseinfo_item">
                <span>{{ $t("consult.归属校区") }}</span>
                <span :title="$checkNull(guardianData['schoolsLabel'])">{{
                  $checkNull(guardianData["schoolsLabel"])
                }}</span>
              </div>
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
          <div class="orderDetail_item">
            <div class="orderDetail_item_title df_sb">
              <div>{{ $t("consult.学生信息") }}</div>
              <div class="orderDetail_item_tabs">
                <div class="orderDetail_item_tablist">
                  <div
                    @click="changeStudent(item)"
                    :class="[
                      'orderDetail_item_tablist_item',
                      {
                        tablist_item_active: currentStudentId == item.id,
                      },
                    ]"
                    v-for="(item, index) in studentList"
                    :key="item.id"
                  >
                    {{ item["showName"] }}
                  </div>
                </div>
              </div>
            </div>
            <div v-if="studentList.length > 0">
              <div class="orderDetail_baseinfo">
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
                <div
                  style="width: 100% !important"
                  class="orderDetail_baseinfo_item"
                >
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
            </div>
            <el-empty v-else description="No Data~"></el-empty>
          </div>

          <div class="orderDetail_item">
            <div class="orderDetail_item_title df_sb">
              <div>{{ $t("consult.跟进记录") }}</div>
            </div>
            <LogList ref="LogList" :isClue="false" />
          </div>
        </div>
        <!-- 编辑家长 -->
        <AddGuardians ref="AddGuardians" @initData="getGuardianDetail" />
        <!-- 修改归属校区 -->
        <changeSchool
          ref="changeSchool"
          :id="$route.query.id"
          :type="'guardian'"
          @initData="getGuardianDetail"
        />
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getGuardianDetail,
  getStudentGuardian,
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
import LogList from "@/page/thepool/consult/modal/loglist.vue";
import changeSchool from "@/page/thepool/modal/changeschool.vue";
import FromItemDetail from "@/components/thepoolcommon/dynamicform/fromitemdetail.vue";
export default {
  name: "PCOrderDetail",
  components: {
    Table,
    ShowText,
    AddGuardians,
    LogList,
    changeSchool,
    FromItemDetail,
  },
  data() {
    return {
      consult: consult,
      enrolledStatus: consult["enrolledStatus"],
      guardianData: {},
      parentInfo: consult["guardiansTableTitle"],
      studentData: {},
      studentList: [],
      currentStudentId: "",
      studentInfo: consult["studentTitle"],
      sexList: consult["sexList"],
      guardianType: "",
      studentTemplateList: [],
      guardianTemplateList: [],
      studentExtendInfo: consult["studentExtendTitle"],
      studentExtendData: {},
    };
  },

  created() {
    this.guardianType = this.$route.query.type;
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
      this.getGuardianDetail();
      this.getStudentGuardian();
    },
    getGuardianDetail() {
      getGuardianDetail(this.$route.query.id).then(async (res) => {
        if (res.data.success) {
          let { guardianInfo, dynamicInfos, records, schools, photos } =
            res.data.data;
          let data = guardianInfo;
          this.guardianData = {
            ...data,
            schools: schools || [],
            sexlabel: this.getDataLabel(data.sex, this.sexList),
          };
          if (this.guardianData["schools"].length > 0) {
            let arr = [];
            this.guardianData["schools"].map((item) => {
              arr.push(this.getDataLabel(item, this.pooldictionary));
            });
            this.guardianData["schoolsLabel"] = String(arr);
          }
          console.log("guardianData", this.guardianData);
          this.$nextTick(async () => {
            this.$refs["LogList"].setLogList(records);
            this.initDynamicform(dynamicInfos);
            if (photos && photos.length > 0) {
              photos.forEach(async (photos) => {
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
        }
      });
    },
    async initDynamicform(dynamicInfos = []) {
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
            ][0].getTemplateDetail(item, dynamicInfoItem);
          });
        });
      }
    },
    getStudentGuardian() {
      getStudentGuardian({ guardianId: this.$route.query.id }).then((res) => {
        if (res.data.success) {
          this.studentData = {};
          this.studentList = [];
          let data = res.data.data;
          if (data && data.length > 0) {
            this.studentList = data.map((item) => {
              return {
                schools: item.schools,
                ...item.baseInfo,
                dynamicInfos: item.dynamicInfos || [],
                extendInfo: item.extendInfo || {},
                photos: item.photos || [],
              };
            });
            this.studentList.map((item) => {
              item["showName"] =
                item["lastName"] && item["firstName"]
                  ? item["lastName"] + item["firstName"]
                  : !item["lastName"] && !item["firstName"]
                  ? "----"
                  : item["lastName"] || item["firstName"];
            });
            this.changeStudent(this.studentList[0]);
          }
        }
      });
    },
    changeStudent(item) {
      this.currentStudentId = item.id;
      this.setCurrentStudent(item);
      this.$nextTick(async () => {
        if (item["applySchool"]) {
          this.getStudentDynamic(item.dynamicInfos, item["applySchool"]);
        } else {
          this.studentTemplateList = [];
        }
      });
    },
    async setCurrentStudent(item) {
      console.log("setCurrentStudent", item);
      this.studentExtendData = item["extendInfo"] || {};
      this.studentTemplateList = [];
      this.studentData = {
        ...item,
        enrollYear: item["enrollYear"]
          ? `${item["enrollYear"]}-${item["enrollYear"] + 1}`
          : "--",
        isDropoutLabel: this.$getListLabel(consult["yesOrno"], item.isDropout),
        sexlabel: this.$getListLabel(this.sexList, item.sex),
        statusLabel: this.$getListLabel(this.enrolledStatus, item.status),
        applySchoolLabel: this.$getListLabel(
          this.pooldictionary,
          item.applySchool
        ),
        enrollLevelLabel: item.applySchool
          ? this.getDictLabel(
              item.applySchool,
              "enquiry_enroll_level",
              item.enrollLevel
            )
          : this.$getListLabel(
              this.dictionary["enquiry_enroll_level"],
              item.enrollLevel
            ),
        enrollmentGradeLabel: item.applySchool
          ? this.getDictLabel(
              item.applySchool,
              "enquiry_enroll_level",
              item.enrollmentGrade
            )
          : this.$getListLabel(
              this.dictionary["enquiry_enroll_level"],
              item.enrollmentGrade
            ),
        directionLabel: item.applySchool
          ? this.getDictLabel(
              item.applySchool,
              "enquiry_direction",
              item.direction
            )
          : this.$getListLabel(
              this.dictionary["enquiry_direction"],
              item.direction
            ),
        enrollLevelInLabel: item.applySchool
          ? this.getDictLabel(
              item.applySchool,
              "enquiry_enroll_level",
              item.enrollLevelIn
            )
          : this.$getListLabel(
              this.dictionary["enquiry_enroll_level"],
              item.enrollLevelIn
            ),
        paySubjectLabel: item.applySchool
          ? this.getDictLabel(
              item.applySchool,
              "enquiry_pay_subject",
              item.paySubject
            )
          : this.$getListLabel(
              this.dictionary["enquiry_pay_subject"],
              item.paySubject
            ),
      };
      console.log('item["photos"]', item);
      this.$nextTick(async () => {
        if (item["photos"] && item["photos"].length > 0) {
          item["photos"].forEach(async (photos) => {
            if (String(photos.type) == "0") {
              const file = await getOuterFile(photos.photoId);
              let photoUrl = window.URL.createObjectURL(file);
              console.log("photoUrl", photoUrl);
              this.studentData = {
                ...this.studentData,
                photoUrl,
              };
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
    // 编辑家长信息
    editGuardian() {
      this.$refs["AddGuardians"].getGuardianDetail(this.$route.query.id);
    },
    changeSchool() {
      this.$refs["changeSchool"].setSchoolList(this.guardianData["schools"]);
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
    getDataLabel(id, data) {
      let str = "";
      data.map((item) => {
        if (item.value == id) {
          str = this.i18nlocel == "en" ? item.enLabel : item.label;
        }
      });
      return str;
    },
    getDataId(id, data) {
      console.log("getDataLabel", id, data);
      let str = "";
      data.map((item) => {
        if (item.value == id) {
          str = item.id;
        }
      });
      return str;
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
