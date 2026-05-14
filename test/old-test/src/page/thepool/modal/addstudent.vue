<template>
  <div class="thepool_page">
    <el-dialog
      :title="
        (type == 'add' ? $t('consult.新增') : $t('consult.编辑')) +
        $t('consult.学生信息')
      "
      :visible.sync="showModal"
      width="1000px"
      :before-close="closeModal"
      :close-on-click-modal="false"
      custom-class="pooldialog"
    >
      <div class="moadlFromBox">
        <el-form
          :label-position="'top'"
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <div
            class="df_center_wrap"
            style="max-height: 600px; overflow-y: auto"
          >
            <el-form-item
              :label="$t('consult.姓')"
              prop="lastName"
              style="width: 25%"
            >
              <el-input
                v-model.trim="ruleForm.lastName"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.名')"
              prop="firstName"
              style="width: 25%"
            >
              <el-input
                v-model.trim="ruleForm.firstName"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.英文名')"
              prop="studentNameEn"
              style="width: 25%"
            >
              <el-input
                v-model.trim="ruleForm.studentNameEn"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.偏好称呼的名字')"
              prop="preferredName"
              style="width: 25%"
            >
              <el-input
                v-model.trim="ruleForm.preferredName"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.其他名字')"
              prop="otherName"
              style="width: 25%"
            >
              <el-input
                v-model.trim="ruleForm.otherName"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.学号')"
              prop="studentNumber"
              style="width: 25%"
            >
              <el-input
                v-model.trim="ruleForm.studentNumber"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.身份证/护照号')"
              prop="identityCard"
              style="width: 25%"
            >
              <el-input
                v-model.trim="ruleForm.identityCard"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.邮箱')"
              prop="email"
              style="width: 25%"
            >
              <el-input
                v-model.trim="ruleForm.email"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.班级')"
              prop="studentClass"
              style="width: 25%"
            >
              <el-input
                v-model.trim="ruleForm.studentClass"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.在读学校')"
              prop="atSchool"
              style="width: 25%"
            >
              <el-input
                v-model.trim="ruleForm.atSchool"
                :placeholder="$t('consult.请输入')"
                maxlength="100"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.性别')"
              prop="sex"
              style="width: 25%"
            >
              <el-select
                v-model="ruleForm.sex"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
              >
                <el-option
                  v-for="item in sexList"
                  :key="item.value"
                  :label="item.label"
                  :value="String(item.value)"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('consult.出生日期')"
              prop="birthday"
              style="width: 25%"
            >
              <el-date-picker
                style="width: 100%"
                v-model="ruleForm.birthday"
                type="date"
                :placeholder="$t('consult.请选择')"
                :value-format="'yyyy-MM-dd'"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              :label="$t('consult.国籍')"
              prop="nationality"
              style="width: 25%"
            >
              <!-- <el-input
                v-model.trim="ruleForm.nationality"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input> -->
              <el-select
                style="width: 100%"
                filterable
                clearable
                v-model="ruleForm.nationality"
                :placeholder="$t('consult.请选择')"
              >
                <el-option
                  v-for="item in countryList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('consult.语言')"
              prop="language"
              style="width: 25%"
            >
              <el-input
                v-model.trim="ruleForm.language"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.第二语言')"
              prop="secondLanguage"
              style="width: 25%"
            >
              <el-input
                v-model.trim="ruleForm.secondLanguage"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.第三语言')"
              prop="thirdLanguage"
              style="width: 25%"
            >
              <el-input
                v-model.trim="ruleForm.thirdLanguage"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.校区')"
              prop="applySchool"
              style="width: 25%"
            >
              <el-select
                style="width: 100%"
                clearable
                v-model="ruleForm.applySchool"
                :placeholder="$t('consult.请选择')"
                @change="changeSchool"
                @clear="clearSchool"
              >
                <el-option
                  v-for="item in pooldictpermissions"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                  :disabled="!item.status"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="enrollLevelList.length > 0"
              :label="$t('consult.申请年级')"
              prop="enrollLevel"
              style="width: 25%"
            >
              <el-select
                v-model="ruleForm.enrollLevel"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
                @change="changeEnrollLevel"
              >
                <el-option
                  v-for="item in enrollLevelList"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                  :disabled="!item.status"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="enrollLevelList.length > 0"
              :label="$t('consult.入学年级')"
              prop="enrollmentGrade"
              style="width: 25%"
            >
              <el-select
                v-model="ruleForm.enrollmentGrade"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
              >
                <el-option
                  v-for="item in enrollLevelList"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                  :disabled="!item.status"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="enrollLevelList.length > 0"
              :label="$t('consult.在读年级')"
              prop="enrollLevelIn"
              style="width: 25%"
            >
              <el-select
                v-model="ruleForm.enrollLevelIn"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
              >
                <el-option
                  v-for="item in enrollLevelList"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                  :disabled="!item.status"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="directionsList.length > 0"
              :label="$t('consult.方向')"
              prop="direction"
              style="width: 25%"
            >
              <el-select
                v-model="ruleForm.direction"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
                @change="changeDirection"
              >
                <el-option
                  v-for="item in directionsList"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                  :disabled="!item.status"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              :label="$t('consult.入学年份')"
              prop="enrollYear"
              style="width: 25%"
            >
              <el-date-picker
                style="width: 100%"
                v-model="ruleForm.enrollYear"
                type="year"
                :placeholder="$t('consult.请选择')"
                :value-format="'yyyy'"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              :label="$t('consult.奖学金')"
              prop="awardScholarship"
              style="width: 25%"
            >
              <el-input
                v-model.trim="ruleForm.awardScholarship"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.奖学金返点')"
              prop="scholarshipRemission"
              style="width: 25%"
            >
              <el-input
                v-model.trim="ruleForm.scholarshipRemission"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.是否休学')"
              prop="isDropout"
              style="width: 25%"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm.isDropout"
                :placeholder="$t('consult.请选择')"
              >
                <el-option
                  v-for="item in consult['yesOrno']"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="paySubjectList.length > 0"
              :label="$t('consult.缴费主体')"
              prop="paySubject"
              style="width: 25%"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm.paySubject"
                :placeholder="$t('consult.请选择')"
              >
                <el-option
                  v-for="item in paySubjectList"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                  :disabled="!item.status"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('consult.住宿情况')"
              prop="boarding"
              style="width: 50%"
            >
              <el-select
                v-model="ruleForm.boarding"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
              >
                <el-option
                  v-for="item in dictionary['enquiry_boarding']"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('consult.头像')"
              prop="photos"
              style="width: 80%"
            >
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
              >
                <img
                  v-if="studentPhotos.photoUrl"
                  :src="studentPhotos.photoUrl"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item
              :label="$t('consult.家庭住址')"
              prop="homeAddress"
              style="width: 80%"
            >
              <el-input
                v-model="ruleForm.homeAddress"
                :placeholder="$t('consult.请输入')"
                type="textarea"
                :rows="5"
                :maxlength="100"
                show-word-limit
              ></el-input>
            </el-form-item>
            <!-- 学生扩展信息 -->
            <el-form-item v-if="showModal" style="width: 100%">
              <ExtendStudent ref="extendStudent" />
            </el-form-item>
            <!-- 学生动态表单 -->
            <el-form-item
              style="width: 100%"
              v-for="(item, index) in templateList"
              :key="index"
            >
              <FromItem
                :ref="`FromItemStudent${item.templateId}`"
                v-if="showModal"
                type="add"
              />
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button
              type="primary"
              size="medium"
              round
              @click="submitForm('ruleForm')"
              >{{ $t("consult.保存") }}</el-button
            >
            <el-button type="default" size="medium" round @click="closeModal">{{
              $t("consult.取消")
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { consult } from "@/const/consult/index.js";
import {
  addStudent,
  editStudent,
  getStudentDetail,
} from "@/api/consult/student.js";
import { getDictTypeRequired } from "@/api/publik";
import { getTemplateInfoByType } from "@/api/consult/template.js";
import SelectChannle from "@/components/common/pooldictselect/selectchannle.vue";
import FromItem from "@/components/thepoolcommon/dynamicform/fromitem.vue";
import ExtendStudent from "./extendstudent.vue";
import countryList from "country-list";
import { getOuterFile, uploadOuterFile } from "@/api/upload/index.js";

export default {
  name: "addStudent",
  components: {
    ExtendStudent,
    SelectChannle,
    FromItem,
  },
  props: {},
  data() {
    let that = this;
    return {
      type: "add",
      showModal: false,
      sexList: consult["sexList"],
      consult: consult,
      ruleForm: {
        lastName: "", //姓
        firstName: "", //名
        studentNameEn: "", //英文名
        studentNumber: "", //学号
        identityCard: "", //身份证/护照号
        email: "", //邮箱
        studentClass: "", //班级
        birthday: "", //出生日期
        nationality: "", //国籍
        language: "", //语言
        sex: "", //性别
        applySchool: "", //申请校区
        enrollLevel: "", //申请年级
        enrollLevelIn: "", //在读年级
        enrollmentGrade: "", //入学年级
        direction: "", //方向
        atSchool: "", //在读学校
        enrollYear: "", //入学年份
        awardScholarship: "", //awardScholarship
        scholarshipRemission: "", //scholarshipRemission
        homeAddress: "", //家庭住址
        paySubject: "", //缴费主体
        isDropout: "", //是否休学
        preferredName: "", //偏好称呼的名字
        otherName: "", //其他名字
        secondLanguage: "", //第二语言
        thirdLanguage: "", //第三语言
        boarding: "", //住宿情况
      },
      rules: {
        lastName: [
          {
            required: true,
            message: that.$t("consult.请输入"),
            trigger: "blur",
          },
        ],
        firstName: [
          {
            required: true,
            message: that.$t("consult.请输入"),
            trigger: "blur",
          },
        ],
        studentNameEn: [
          {
            required: true,
            message: that.$t("consult.请输入"),
            trigger: "blur",
          },
        ],
        applySchool: [
          {
            required: true,
            message: that.$t("consult.请选择"),
            trigger: "blur",
          },
        ],
        enrollLevel: [
          {
            required: false,
            message: that.$t("consult.请选择"),
            trigger: "blur",
          },
        ],
        direction: [
          {
            required: false,
            message: that.$t("consult.请选择"),
            trigger: "blur",
          },
        ],
        enrollLevelIn: [
          {
            required: false,
            message: that.$t("consult.请选择"),
            trigger: "blur",
          },
        ],
        enrollmentGrade: [
          {
            required: false,
            message: that.$t("consult.请选择"),
            trigger: "blur",
          },
        ],
        paySubject: [
          {
            required: false,
            message: that.$t("consult.请选择"),
            trigger: "blur",
          },
        ],
      },
      enrollLevelList: [],
      directionsList: [],
      paySubjectList: [],
      dictRequireObj: {
        direction: false,
        enrollLevel: false,
        paySubject: false,
      },
      templateData: {
        outerId: "",
        scene: "enquiry_student_school",
      },
      showTemplate: false,
      templateList: [],
      templateValue: {},
      countryList: [],
      studentPhotos: {
        photoId: "",
        type: "0",
        photoUrl: "",
      },
    };
  },
  created() {
    this.countryList = countryList.getData();
    const china = this.countryList.find((item) => item.code === "CN");
    if (china) {
      // 做个判断，避免数据异常
      this.countryList = [
        china,
        ...this.countryList.filter((item) => item.code !== "CN"),
      ];
    }
  },
  mounted() {},
  computed: {
    ...mapGetters([
      "permissions",
      "dictionary",
      "dictpermissions",
      "i18nlocel",
      "pooldictionary",
      "pooldictpermissions",
    ]),
  },
  methods: {
    initeForm() {
      this.showModal = true;
      this.$nextTick(() => {
        if (this.pooldictpermissions.length == 1) {
          this.ruleForm["applySchool"] = this.pooldictpermissions[0].value;
          this.changeSchool(this.pooldictpermissions[0].value);
        }
      });
    },
    async initDynamicform(dynamicInfos = []) {
      let templateForm = await getTemplateInfoByType({ templateType: 1 });
      console.log("templateForm", templateForm);
      if (templateForm.length > 0) {
        this.templateList = [];
        templateForm.map((dynamicItem) => {
          if (dynamicItem.schoolId == this.ruleForm.applySchool) {
            this.templateList = dynamicItem.templates || [];
          }
        });
        console.log(" this.templateList ", this.templateList);
        if (this.templateList.length > 0) {
          this.$nextTick(() => {
            this.templateList.map((item) => {
              let dynamicInfoItem = dynamicInfos.find(
                (dynamicItem) => dynamicItem.templateId == item.templateId
              );
              this.$refs[
                `FromItemStudent${item.templateId}`
              ][0].getTemplateDetail(item, dynamicInfoItem || {});
            });
          });
        }
      }
    },
    addStudent(data) {
      addStudent(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.closeModal();
          this.$emit("initData");
        }
      });
    },
    editStudent(data) {
      editStudent(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.closeModal();
          this.$emit("initData");
        }
      });
    },
    addStudentBindClue(id) {
      this.ruleForm["clueId"] = id;
      this.initeForm();
    },
    getStudentDetail(id) {
      this.type = "edit";
      getStudentDetail(id).then(async (res) => {
        if (res.data.success) {
          this.showModal = true;
          let { baseInfo, dynamicInfos, extendInfo, photos } = res.data.data;
          let data = baseInfo;
          this.ruleForm["id"] = data["id"];
          await this.changeSchool(data["applySchool"], dynamicInfos);
          this.$nextTick(async () => {
            if (photos && photos.length > 0) {
              photos.forEach(async (item) => {
                if (String(item.type) == "0") {
                  const file = await getOuterFile(item.photoId);
                  this.studentPhotos = {
                    ...item,
                    photoUrl: window.URL.createObjectURL(file),
                  };
                }
              });
            }
            this.$refs.extendStudent.setFormData(extendInfo);
            Object.keys(data).forEach((item) => {
              if (this.ruleForm.hasOwnProperty(item)) {
                this.ruleForm[item] =
                  data[item] == null || data[item] == undefined
                    ? ""
                    : String(data[item]);
              }
            });
          });
        }
      });
    },
    setDynamicFormData() {
      return new Promise((resolve) => {
        Promise.all(
          this.templateList.map(async (item) => {
            let submitDataObj = {
              templateId: item.templateId,
              fieldData: [],
            };
            submitDataObj["fieldData"] = await this.$refs[
              `FromItemStudent${item.templateId}`
            ][0].saveFormArrValue();
            console.log("submitDataObj", submitDataObj);

            return submitDataObj;
          })
        ).then((submitData) => {
          // 所有数据获取完成后再发起请求
          console.log("submitData", submitData);

          resolve(submitData);
        });
      });
    },
    async submitForm(formName) {
      let checkForm = true;
      let checkTemplate = true;
      let checkExtend = true;
      this.$refs[formName].validate((valid) => {
        checkForm = valid;
      });
      let extendForm = await this.$refs.extendStudent.submitForm();
      checkExtend = extendForm.isPass;
      if (this.templateList.length > 0) {
        this.templateList.map((item) => {
          this.$refs[`FromItemStudent${item.templateId}`][0].$refs[
            "form"
          ].validate((valid) => {
            if (!valid) {
              checkTemplate = false;
            }
          });
        });
      }
      if (checkForm && checkTemplate && checkExtend) {
        let data = {
          id: this.ruleForm.id || null,
          clueId: this.ruleForm["clueId"] || null, //线索id
          baseInfo: this.ruleForm,
          dynamicInfos: [],
          extendInfo: {
            ...extendForm.data,
          },
          photos: this.studentPhotos.photoId ? [this.studentPhotos] : [],
        };
        if (this.ruleForm.id) {
          data["extendInfo"] = {
            ...data["extendInfo"],
            studentId: this.ruleForm.id || null,
          };
        }
        if (this.templateList.length > 0) {
          data["dynamicInfos"] = await this.setDynamicFormData();
        }
        if (this.type == "add") {
          this.addStudent(data);
        } else {
          this.editStudent(data);
        }
      }
    },
    async changeSchool(e, dynamicInfos = [], type = true) {
      if (type) {
        this.ruleForm = {
          ...this.ruleForm,
          enrollLevel: "",
          direction: "",
          enrollLevelIn: "",
          enrollmentGrade: "",
          paySubject: "",
        };
      }
      this.pooldictpermissions.map(async (item) => {
        if (item.value == e) {
          this.templateData["outerId"] = item.id;
          this.enrollLevelList = item["child"]["enquiry_enroll_level"]
            ? item["child"]["enquiry_enroll_level"]
            : [];
          this.directionsList = item["child"]["enquiry_direction"]
            ? item["child"]["enquiry_direction"]
            : [];
          this.paySubjectList = item["child"]["enquiry_pay_subject"]
            ? item["child"]["enquiry_pay_subject"]
            : [];
          this.$nextTick(() => {
            this.initDynamicform(dynamicInfos);
          });
        }
      });
    },
    async setRequireType(id, type) {
      let Obj = await getDictTypeRequired(id);
      this.dictRequireObj = Obj;
      Object.keys(this.rules).forEach((res) => {
        if (Obj[res]) {
          this.$set(this.rules[res], 0, {
            ...this.rules[res][0],
            required: Obj[res] == "true",
          });
        }
      });
    },
    async getTemplateStudent() {
      this.templateList = [];
      this.templateList = await getTemplateOuterForm(this.templateData);
      if (this.templateList.length > 0) {
        this.showTemplate = true;
        this.$nextTick(() => {
          this.templateList.map((item) => {
            this.$refs[`FromItemStudent${item}`][0].getTemplateDetail(item);
          });
        });
      } else {
        this.showTemplate = false;
      }
    },

    closeModal() {
      this.showModal = false;
      this.showTemplate = false;
      this.type = "add";
      this.ruleForm = {
        lastName: "", //姓
        firstName: "", //名
        studentNameEn: "", //英文名
        studentNumber: "", //学号
        identityCard: "", //身份证/护照号
        email: "", //邮箱
        studentClass: "", //班级
        birthday: "", //出生日期
        nationality: "", //国籍
        language: "", //语言
        sex: "", //性别
        applySchool: "", //申请校区
        enrollLevel: "", //申请年级
        enrollLevelIn: "", //在读年级
        enrollmentGrade: "", //入学年级
        direction: "", //方向
        atSchool: "", //在读学校
        enrollYear: "", //入学年份
        awardScholarship: "",
        scholarshipRemission: "", //awardScholarship
        homeAddress: "", //家庭住址
        paySubject: "", //缴费主体
        isDropout: "", //是否休学
        preferredName: "", //偏好称呼的名字
        otherName: "", //其他名字
        secondLanguage: "", //第二语言
        thirdLanguage: "", //第三语言
        boarding: "", //住宿情况
      };
      this.studentPhotos = {
        photoId: "",
        type: "0",
        photoUrl: "",
      };
      this.$emit("closeModal", false);
    },
    clearSchool() {
      this.enrollLevelList = [];
      this.directionsList = [];
      this.paySubjectList = [];
      this.ruleForm = {
        ...this.ruleForm,
        enrollLevel: "",
        direction: "",
        paySubject: "",
      };
    },
    changeEnrollLevel(e) {
      this.$refs["ruleForm"].validateField("enrollLevel");
    },
    changeDirection(e) {
      this.$refs["ruleForm"].validateField("direction");
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt20M = file.size / 1024 / 1024 < 20;
      let isTrue = true;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 或 PNG 格式!");
        isTrue = false;
        return;
      }
      if (!isLt20M) {
        this.$message.error("上传头像图片大小不能超过 20MB!");
        isTrue = false;
        return;
      }
      if (isTrue) {
        let data = new FormData();
        data.append("file", file);
        data.append("tenantId", "2");
        uploadOuterFile(data).then((res) => {
          if (res.data.success) {
            console.log("uploadFile", res);
            const url = window.URL.createObjectURL(file);
            this.studentPhotos = {
              ...this.studentPhotos,
              photoId: res.data.data,
              type: "0",
              photoUrl: url,
            };
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item--small.el-form-item {
  margin-right: 0px;
  padding-right: 20px;
  box-sizing: border-box;
}
</style>
