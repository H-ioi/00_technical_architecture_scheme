<template>
  <div>
    <div v-if="studentList.length > 0">
      <el-scrollbar v-if="studentList.length > 1">
        <div class="studentList">
          <div
            @click="selectCurrent(item)"
            :class="[
              'studentList-item',
              {
                is_active: currentStudentId == item['id'],
              },
            ]"
            v-for="item in studentList"
            :key="item.id"
          >
            <el-avatar :size="60" :src="studentPhotoUrl[item.id]"> </el-avatar>
            <div class="info">
              <div class="name">{{ item["baseInfo"]["showName"] }}</div>
              <div class="value">
                {{ item["baseInfo"]["birthday"] || "--" }}
              </div>
              <div class="value">
                {{ item["baseInfo"]["statusLabel"] || "--" }}
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <div v-else class="student-baseinfo">
        <el-avatar
          :size="100"
          shape="square"
          :src="studentPhotoUrl[studentData['id']]"
        >
        </el-avatar>
        <div class="info" style="margin-left: 20px">
          <div class="orderDetail">
            <div class="orderDetail_content">
              <div class="orderDetail_item">
                <div class="orderDetail_baseinfo">
                  <div
                    style="width: 25% !important"
                    class="orderDetail_baseinfo_item"
                    v-for="(item, index) in studentBaseInfo"
                    :key="index"
                  >
                    <span>{{ $t("consult")[item.label] }}</span>
                    <span :title="$checkNull(studentData[item.prop])">{{
                      $checkNull(studentData[item.prop])
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pool-tabs">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="$t('consult.基础信息')" name="baseInfo">
            <div class="orderDetail">
              <div class="orderDetail_content">
                <div class="orderDetail_item">
                  <div
                    class="orderDetail_baseinfo"
                    v-if="studentList.length > 1"
                  >
                    <div class="orderDetail_baseinfo_item">
                      <span>{{ $t("consult.状态") }}</span>
                      <span :title="$checkNull(studentData['statusLabel'])">{{
                        $checkNull(studentData["statusLabel"])
                      }}</span>
                    </div>
                    <div
                      class="orderDetail_baseinfo_item"
                      v-if="studentData['schools'].length > 0"
                    >
                      <span>{{ $t("consult.归属校区") }}</span>
                      <span :title="$checkNull(studentData['schoolsLabel'])">{{
                        $checkNull(studentData["schoolsLabel"])
                      }}</span>
                    </div>
                    <div
                      v-show="
                        isHiddenIetm(
                          item.value,
                          $checkNull(studentData[item.prop])
                        )
                      "
                      class="orderDetail_baseinfo_item"
                      v-for="(item, index) in studentInfo"
                      :key="index"
                    >
                      <span>{{ $t("consult")[item.label] }}</span>
                      <span :title="$checkNull(studentData[item.prop])">{{
                        $checkNull(studentData[item.prop])
                      }}</span>
                    </div>
                  </div>
                  <div class="orderDetail_baseinfo" v-else>
                    <div class="orderDetail_baseinfo_item">
                      <span>{{ $t("consult.状态") }}</span>
                      <span :title="$checkNull(studentData['statusLabel'])">{{
                        $checkNull(studentData["statusLabel"])
                      }}</span>
                    </div>
                    <div
                      class="orderDetail_baseinfo_item"
                      v-if="studentData['schools'].length > 0"
                    >
                      <span>{{ $t("consult.归属校区") }}</span>
                      <span :title="$checkNull(studentData['schoolsLabel'])">{{
                        $checkNull(studentData["schoolsLabel"])
                      }}</span>
                    </div>
                    <div
                      v-show="
                        isHiddenIetm(
                          item.value,
                          $checkNull(studentData[item.prop])
                        )
                      "
                      class="orderDetail_baseinfo_item"
                      v-for="(item, index) in studentOtherBaseInfo"
                      :key="index"
                    >
                      <span>{{ $t("consult")[item.label] }}</span>
                      <span :title="$checkNull(studentData[item.prop])">{{
                        $checkNull(studentData[item.prop])
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('consult.拓展信息')" name="extendInfo">
            <div class="orderDetail">
              <div class="orderDetail_content">
                <div class="orderDetail_item">
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
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane
            v-for="(item, index) in studentTemplateList"
            :label="item.templateName + item.templateId"
            :name="i18nlocel == 'en' ? item.templateNameEn : item.templateName"
          >
            <FromItemDetail :ref="`FromItemDetailStudent${item.templateId}`" />
          </el-tab-pane>
          <el-tab-pane
            v-for="(item, index) in fillDynamicList"
            :key="index"
            :label="item.templateName"
            :name="i18nlocel == 'en' ? item.templateNameEn : item.templateName"
          >
            <FromItemDetail :ref="`FromItemFillStudent${item.templateId}`" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <el-empty v-else description="No Data~"></el-empty>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getTemplateInfoByType } from "@/api/consult/template.js";
import { getOuterFile, uploadOuterFile } from "@/api/upload/index.js";
import {
  getPoolStudentTemplate,
  getStudentfillInfo,
} from "@/api/consult/collection.js";

import { consult } from "@/const/consult/index.js";
import FromItemDetail from "@/components/thepoolcommon/dynamicform/fromitemdetail.vue";
export default {
  components: {
    FromItemDetail,
  },
  data() {
    return {
      activeName: "baseInfo",
      consult: consult,
      currentStudentId: "",
      studentData: {},
      studentList: [],
      enterStudentList: [],
      studentInfo: consult["studentTitle"],
      // 学生拓展信息
      studentExtendInfo: consult["studentExtendTitle"],
      studentExtendData: {},
      // 学生关联动态表单模板
      studentTemplateList: [],
      fillDynamicList: [],
      // 学生头像
      studentPhotoUrl: {},
      studentBaseInfo: [
        {
          label: "姓",
          prop: "lastName",
          width: "200px",
          show: true,
        },
        {
          label: "名",
          prop: "firstName",
          width: "200px",
          show: true,
        },
        {
          label: "英文名",
          prop: "studentNameEn",
          width: "200px",
          show: true,
        },
        {
          label: "性别",
          prop: "sexlabel",
          width: "200px",
          show: true,
        },
        {
          label: "出生日期",
          prop: "birthday",
          width: "200px",
          show: true,
        },
        {
          label: "身份证/护照号",
          prop: "identityCard",
          width: "200px",
          show: true,
        },
        {
          label: "国籍",
          prop: "nationality",
          width: "200px",
          show: true,
        },
        {
          label: "语言",
          prop: "language",
          width: "200px",
          show: true,
        },
      ],
      studentOtherBaseInfo: [
        {
          label: "校区",
          prop: "applySchoolLabel",
          width: "200px",
          fixed: true,
          show: true,
        },

        {
          label: "偏好称呼的名字",
          prop: "preferredName",
          width: "200px",
          show: false,
        },
        {
          label: "其他名字",
          prop: "otherName",
          width: "200px",
          show: false,
        },

        {
          label: "邮箱",
          prop: "email",
          width: "200px",
          show: true,
        },
        {
          label: "班级",
          prop: "studentClass",
          width: "200px",
          show: true,
        },
        {
          label: "学号",
          prop: "studentNumber",
          width: "200px",
          show: true,
        },
        {
          label: "在读学校",
          prop: "atSchool",
          width: "200px",
          show: true,
        },
        {
          label: "在读年级",
          prop: "enrollLevelInLabel",
          width: "200px",
          show: true,
        },
        {
          label: "申请年级",
          prop: "enrollLevelLabel",
          width: "200px",
          show: true,
        },
        {
          label: "入学年级",
          prop: "enrollmentGradeLabel",
          width: "200px",
          show: true,
        },
        {
          label: "方向",
          prop: "directionLabel",
          width: "200px",
          show: true,
        },
        {
          label: "第二语言",
          prop: "secondLanguage",
          width: "200px",
          show: false,
        },
        {
          label: "第三语言",
          prop: "thirdLanguage",
          width: "200px",
          show: false,
        },
        {
          label: "入学年份",
          prop: "enrollYear",
          width: "200px",
          show: true,
        },
        {
          label: "奖学金",
          prop: "awardScholarship",
          width: "200px",
          show: true,
        },
        {
          label: "奖学金返点",
          prop: "scholarshipRemission",
          width: "200px",
          show: true,
        },
        {
          label: "缴费主体",
          prop: "paySubjectLabel",
          width: "200px",
          show: true,
        },
        {
          label: "家庭住址",
          prop: "homeAddress",
          width: "200px",
          show: true,
        },
        {
          label: "是否休学",
          prop: "isDropoutLabel",
          width: "200px",
          show: true,
        },
        {
          label: "新增时间",
          prop: "createTime",
          width: "200px",
          show: true,
        },
      ],
    };
  },
  created() {},
  mounted() {},
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
    // 切换标签页
    handleClick(e) {
      console.log("handleClick", e);
    },
    // 选择学生
    selectCurrent(item) {
      if (item["id"] == this.currentStudentId) return;
      this.currentStudentId = item["id"];
      this.changeStudent(item);
    },
    // 获取线索关联的学生
    initData(list) {
      this.studentList = list || [];
      if (this.studentList.length > 0) {
        this.studentList.map((item) => {
          item["baseInfo"] = {
            ...item["baseInfo"],
            showName: this.getShowName(item["baseInfo"]),
            statusLabel: this.$getListLabel(
              consult["enrolledStatus"],
              item["baseInfo"].status
            ),
            schools: item["schools"] || [],
          };
          this.$set(this.studentPhotoUrl, item.id, "");
          this.getPhotoUrl(item);
        });
        if (this.currentStudentId != "") {
          let isHas = false;
          this.studentList.map((item, index) => {
            if (item.id == this.currentStudentId) {
              isHas = true;
              this.changeStudent(item);
            }
          });
          if (!isHas) {
            this.changeStudent(this.studentList[0]);
          }
        } else {
          this.changeStudent(this.studentList[0]);
        }
      }
    },
    // 切换学生
    changeStudent(item) {
      console.log("changeStudent", item);
      this.studentTemplateList = [];
      this.currentStudentId = item["id"];
      this.studentExtendData = item["extendInfo"] || {};
      this.studentData = {
        ...item["baseInfo"],
        enrollYear: item["baseInfo"].enrollYear
          ? `${item["baseInfo"].enrollYear}-${item["baseInfo"].enrollYear + 1}`
          : "--",
        isDropoutLabel: this.$getListLabel(
          consult["yesOrno"],
          item["baseInfo"].isDropout
        ),
        statusLabel: this.$getListLabel(
          consult["enrolledStatus"],
          item["baseInfo"].status
        ),
        sexlabel: this.$getListLabel(consult["sexList"], item["baseInfo"].sex),
        applySchoolLabel: this.$getListLabel(
          this.pooldictionary,
          item["baseInfo"].applySchool
        ),
        enrollLevelLabel: item["baseInfo"].applySchool
          ? this.getDictLabel(
              item["baseInfo"].applySchool,
              "enquiry_enroll_level",
              item["baseInfo"].enrollLevel
            )
          : this.$getListLabel(
              this.dictionary["enquiry_enroll_level"],
              item["baseInfo"].enrollLevel
            ),
        enrollmentGradeLabel: item["baseInfo"].applySchool
          ? this.getDictLabel(
              item["baseInfo"].applySchool,
              "enquiry_enroll_level",
              item["baseInfo"].enrollmentGrade
            )
          : this.$getListLabel(
              this.dictionary["enquiry_enroll_level"],
              item["baseInfo"].enrollmentGrade
            ),
        directionLabel: item["baseInfo"].applySchool
          ? this.getDictLabel(
              item["baseInfo"].applySchool,
              "enquiry_direction",
              item["baseInfo"].direction
            )
          : this.$getListLabel(
              this.dictionary["enquiry_direction"],
              item["baseInfo"].direction
            ),
        enrollLevelInLabel: item["baseInfo"].applySchool
          ? this.getDictLabel(
              item["baseInfo"].applySchool,
              "enquiry_enroll_level",
              item["baseInfo"].enrollLevelIn
            )
          : this.$getListLabel(
              this.dictionary["enquiry_enroll_level"],
              item["baseInfo"].enrollLevelIn
            ),
        paySubjectLabel: item["baseInfo"].applySchool
          ? this.getDictLabel(
              item["baseInfo"].applySchool,
              "enquiry_pay_subject",
              item["baseInfo"].paySubject
            )
          : this.$getListLabel(
              this.dictionary["enquiry_pay_subject"],
              item["baseInfo"].paySubject
            ),
      };
      if (this.studentData["schools"].length > 0) {
        let arr = [];
        this.studentData["schools"].map((school) => {
          arr.push(this.$getListLabel(this.pooldictionary, school));
        });
        this.studentData["schoolsLabel"] = String(arr);
      }
      this.$nextTick(async () => {
        if (item["baseInfo"].applySchool) {
          let schoolId = this.$getListLabel(
            this.pooldictionary,
            item["baseInfo"].applySchool,
            "id",
            "value"
          );
          this.getTemplateDynamic(
            1,
            item["baseInfo"].applySchool,
            item["dynamicInfos"] || []
          );
          if (item["baseInfo"]["applySchool"] == 5) {
            this.getFillDynamic(
              item["baseInfo"]["applySchool"],
              item["baseInfo"].direction
            );
          } else {
            this.fillDynamicList = [];
          }
        } else {
          this.studentTemplateList = [];
        }
      });
    },
    async getTemplateDynamic(type, schoolId, dynamicInfos = []) {
      let templateForm = await getTemplateInfoByType({ templateType: type });
      if (templateForm.length > 0) {
        let templateList = templateForm.find(
          (dynamicItem) => dynamicItem.schoolId == schoolId
        ).templates;

        templateList.map((item) => {
          let dynamicInfoItem = dynamicInfos.find(
            (dynamicItem) => dynamicItem.templateId == item.templateId
          );
          switch (type) {
            case 1:
              this.studentTemplateList = templateList;
              this.$nextTick(() => {
                this.$refs[
                  `FromItemDetailStudent${item.templateId}`
                ][0].getTemplateDetail(item, dynamicInfoItem);
              });
              break;
          }
        });
      }
    },
    async getFillDynamic(applySchool, direction) {
      let templateList = await getPoolStudentTemplate({
        applySchool: applySchool,
      });
      let studentFillList = await getStudentfillInfo({
        studentId: this.currentStudentId,
      });
      this.fillDynamicList = templateList || [];
      this.fillDynamicList = this.fillDynamicList.filter((item) => {
        let templateDirection = item.direction || "";
        let list = templateDirection.split(",");
        return list.includes(direction);
      });
      let dynamicInfos = studentFillList["dynamicInfos"] || [];
      if (this.fillDynamicList && this.fillDynamicList.length > 0) {
        this.$nextTick(() => {
          this.fillDynamicList.map((item) => {
            let dynamicInfoItem = dynamicInfos.find(
              (dynamicItem) => dynamicItem.templateId == item.templateId
            );
            this.$refs[
              `FromItemFillStudent${item.templateId}`
            ][0].getTemplateDetail(item, dynamicInfoItem);
          });
        });
      }
    },

    getShowName(item) {
      return item["lastName"] && item["firstName"]
        ? item["lastName"] + item["firstName"]
        : !item["lastName"] && !item["firstName"]
        ? "----"
        : item["lastName"] || item["firstName"];
    },
    getDictLabel(pid, type, cid) {
      let str = "";
      if (cid) {
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
      }

      return str;
    },
    isHiddenIetm(type, data) {
      let isShow = false;
      let list = ["enrollLevelLabel", "channellLabel", "directionLabel"];
      isShow = data == "--" && list.includes(type);
      return !isShow;
    },
    // 获取学生照片0 为头像，1 证件照白底，2 为其他照片，优先顺0，1，2 顺序
    getPhotoUrl(data) {
      let photos = data["photos"] || [];
      if (photos.length > 0) {
        let hasAvatar = false;
        photos.forEach(async (item) => {
          let type = String(item.type);
          if (hasAvatar) return;
          switch (type) {
            case "0":
              hasAvatar = true;
              this.getOuterFile(item, data);
              break;
            case "1":
              hasAvatar = true;
              this.getOuterFile(item, data);
              break;
            case "2":
              hasAvatar = true;
              this.getOuterFile(item, data);
              break;
          }
        });
      }
    },
    async getOuterFile(item, data) {
      const file = await getOuterFile(item.photoId);
      let photoUrl = window.URL.createObjectURL(file);

      this.$nextTick(() => {
        this.$set(this.studentPhotoUrl, data.id, photoUrl);
        console.log("getStudentPhotoUrl", data, this.studentPhotoUrl);
        this.studentPhotoUrl = JSON.parse(JSON.stringify(this.studentPhotoUrl));
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.studentList {
  width: 100%;
  overflow-x: auto;
  display: flex;
  align-items: center;
  .studentList-item {
    flex-shrink: 0 !important;
    flex-grow: 0 !important;
    flex-basis: 240px !important;
    min-width: 240px !important;
    max-width: 240px !important;
    width: 240px;
    height: 96px;
    background: #ffffff;
    box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.09);
    border-radius: 20px;
    padding: 15px 15px;
    box-sizing: border-box;
    // border: 1px solid #999999;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin: 2px 20px 2px 2px;
    cursor: pointer;
    .info {
      width: 140px;
    }
    .name {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 16px;
      color: #000000;
      line-height: 20px;
      margin-bottom: 5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .value {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 14px;
      color: #666666;
      line-height: 20px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .is_active {
    border: 1px solid #d4ab85;
  }
}
::v-deep .el-avatar {
  img {
    width: 100%;
  }
}
.student-baseinfo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  .info {
    flex: 1;
  }
}
</style>
