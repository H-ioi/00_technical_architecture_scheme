<template>
  <div>
    <el-dialog
      :title="$t('consult.编辑')"
      :visible.sync="showEditStudent"
      width="1100px"
      :before-close="closeModal"
      :close-on-click-modal="false"
    >
      <div class="moadlFromBox">
        <el-form
          :label-position="'top'"
          :inline="true"
          :model="clueForm"
          :rules="rules"
          ref="clueForm"
        >
          <el-form-item style="width: 100%">
            <div>{{ $t("consult.线索信息") }}</div>
          </el-form-item>
          <div class="df_center_wrap">
            <el-form-item
              :label="$t('consult.学生姓名')"
              prop="studentName"
              style="width: 25%"
            >
              <el-input
                v-model="clueForm.studentName"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="enrollLevelList.length > 0"
              :label="$t('consult.申请年级')"
              prop="enrollLevel"
              style="width: 25%"
            >
              <el-select
                v-model="clueForm.enrollLevel"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
                @change="changeForm"
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
              v-if="channelList.length > 0"
              :label="$t('consult.渠道')"
              prop="channel"
              style="width: 25%"
              ref="clueFormchannel"
            >
              <SelectChannle
                ref="SelectChannle"
                :options="channelList"
                @setChannel="setChannel"
              />
              <!-- <el-select
                v-model="clueForm.channel"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
                @change="changeForm"
              >
                <el-option
                  v-for="item in channelList"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item
              :label="$t('consult.家长称谓')"
              prop="guardianTitle"
              style="width: 25%"
            >
              <el-input
                v-model="clueForm.guardianTitle"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.来源')"
              prop="origin"
              style="width: 25%"
            >
              <el-input
                v-model.trim="clueForm.origin"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.联系方式')"
              prop="contactMethod"
              style="width: 25%"
            >
              <el-input
                v-model="clueForm.contactMethod"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.奖学金')"
              prop="awardScholarship"
              style="width: 25%"
            >
              <el-input
                v-model.trim="clueForm.awardScholarship"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="followTagsList.length > 0"
              :label="$t('consult.跟进标签')"
              prop="followTags"
              style="width: 25%"
            >
              <el-select
                v-model="clueForm.followTags"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
                @change="changeForm"
              >
                <el-option
                  v-for="item in followTagsList"
                  :key="item.value"
                  :disabled="!item.status"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="moadlFromBox">
        <el-form
          :label-position="'top'"
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <el-form-item style="width: 100%">
            <div>{{ $t("consult.学生信息") }}</div>
          </el-form-item>
          <div class="df_center_wrap">
            <el-form-item
              :label="$t('consult.姓')"
              prop="lastName"
              style="width: 25%"
            >
              <el-input
                v-model="ruleForm.lastName"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.名')"
              prop="firstName"
              style="width: 25%"
            >
              <el-input
                v-model="ruleForm.firstName"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
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
                maxlength="30"
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
                @change="changeForm"
              >
                <el-option
                  v-for="item in sexList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
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
              v-if="enrollLevelList.length > 0"
              :label="$t('consult.在读年级')"
              prop="enrollLevelIn"
              style="width: 25%"
              ref="enrollLevelIn"
            >
              <el-select
                v-model="ruleForm.enrollLevelIn"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
                @change="changeForm"
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
              :label="$t('consult.校区')"
              prop="applySchool"
              style="width: 25%"
            >
              <el-select
                v-model="ruleForm.applySchool"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
                @change="changeSchool"
              >
                <el-option
                  v-for="item in pooldictpermissions"
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
              prop="enrollLevel"
              style="width: 25%"
              ref="enrollLevel"
            >
              <el-select
                v-model="ruleForm.enrollLevel"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
                @change="changeForm"
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
              v-if="directionsList.length > 0"
              :label="$t('consult.方向')"
              prop="direction"
              style="width: 25%"
              ref="ruleFormdirection"
            >
              <el-select
                v-model="ruleForm.direction"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
                @change="changeForm"
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
              :label="$t('consult.国籍')"
              prop="nationality"
              style="width: 25%"
            >
              <el-input
                v-model="ruleForm.nationality"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.语言')"
              prop="language"
              style="width: 25%"
            >
              <el-input
                v-model="ruleForm.language"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
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
                maxlength="20"
              ></el-input>
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
          </div>
        </el-form>
      </div>
      <div class="moadlFromBox">
        <el-form
          :label-position="'top'"
          :inline="true"
          :model="firstGuardians"
          :rules="rules"
          ref="firstGuardians"
        >
          <el-form-item style="width: 100%">
            <div>{{ $t("consult.家长信息") }}</div>
          </el-form-item>
          <div class="df_center_wrap">
            <el-form-item
              :label="$t('consult.姓')"
              prop="lastName"
              style="width: 25%"
            >
              <el-input
                v-model="firstGuardians.lastName"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.名')"
              prop="firstName"
              style="width: 25%"
            >
              <el-input
                v-model="firstGuardians.firstName"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.性别')"
              prop="sex"
              style="width: 25%"
            >
              <el-select
                v-model="firstGuardians.sex"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
                @change="changeForm"
              >
                <el-option
                  v-for="item in sexList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('consult.和申请人的关系')"
              prop="relationType"
              style="width: 25%"
            >
              <el-select
                v-model="firstGuardians.relationType"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
                @change="changeForm"
              >
                <el-option
                  v-for="item in dictionary['enquiry_relation_type']"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                  :disabled="!item.status"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('consult.邮箱')"
              prop="email"
              style="width: 25%"
            >
              <el-input
                v-model="firstGuardians.email"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.国籍')"
              prop="nationality"
              style="width: 25%"
            >
              <el-input
                v-model="firstGuardians.nationality"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.语言')"
              prop="language"
              style="width: 25%"
            >
              <el-input
                v-model="firstGuardians.language"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.电话')"
              prop="phone"
              style="width: 25%"
            >
              <el-input
                v-model="firstGuardians.phone"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.微信号')"
              prop="wechat"
              style="width: 25%"
            >
              <el-input
                v-model="firstGuardians.wechat"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('consult.首次探校时间')" prop="schoolTour">
              <el-date-picker
                style="width: 100%"
                v-model="firstGuardians.schoolTour"
                type="date"
                placeholder="选择时间"
                :value-format="'yyyy-MM-dd'"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item class="modalFromBtn">
              <el-button
                type="primary"
                size="medium"
                @click="submitForm('ruleForm')"
                >{{ $t("consult.保存") }}</el-button
              >
              <el-button type="default" size="medium" @click="closeModal">{{
                $t("consult.取消")
              }}</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { editStudent } from "@/api/consult/index.js";
import { consult } from "@/const/consult/index.js";
import { getDictTypeRequired } from "@/api/publik";
import SelectChannle from "@/components/common/pooldictselect/selectchannle.vue";
export default {
  name: "editstudent",
  props: {
    showEditStudent: Boolean,
    clueData: Object,
    studentData: Object,
    guardians: Array
  },
  components: {
    SelectChannle
  },
  data() {
    return {
      sexList: consult["sexList"],
      clueForm: {
        studentName: "",
        contactMethod: "",
        guardianTitle: "",
        enrollLevel: "",
        awardScholarship: "",
        channel: "",
        channelChildOne: "",

        followTags: ""
      },
      firstGuardians: {
        firstName: "",
        lastName: "",
        sex: "",
        relationType: "",
        nationality: "",
        language: "",
        phone: "",
        email: "",
        wechat: "",
        schoolTour: ""
      },
      ruleForm: {
        firstName: "",
        lastName: "",
        sex: "",
        birthday: "",
        enrollYear: "",
        enrollLevel: "",
        nationality: "",
        language: "",
        homeAddress: "",
        studentNameEn: "",
        scholarshipRemission: 0,
        applySchool: "",
        direction: "",
        enrollLevelIn: "",
        atSchool: ""
      },
      rules: {
        firstName: [{ required: true, message: "请输入", trigger: "blur" }],
        lastName: [{ required: true, message: "请输入", trigger: "blur" }],
        sex: [{ required: true, message: "请选择", trigger: "blur" }],
        enrollYear: [{ required: true, message: "请选择", trigger: "blur" }],
        birthday: [{ required: false, message: "请输入", trigger: "blur" }],
        nationality: [{ required: false, message: "请输入", trigger: "blur" }],
        language: [{ required: false, message: "请输入", trigger: "blur" }],
        homeAddress: [{ required: false, message: "请输入", trigger: "blur" }],
        studentName: [{ required: true, message: "请输入", trigger: "blur" }],
        relationType: [{ required: true, message: "请选择", trigger: "blur" }],
        contactMethod: [{ required: true, message: "请输入", trigger: "blur" }],
        guardianTitle: [{ required: true, message: "请输入", trigger: "blur" }],
        enrollLevel: [{ required: false, message: "请选择", trigger: "blur" }],
        channel: [{ required: false, message: "请选择", trigger: "blur" }],
        followTags: [{ required: false, message: "请选择", trigger: "blur" }],
        direction: [{ required: false, message: "请选择", trigger: "blur" }],
        applySchool: [{ required: true, message: "请选择", trigger: "blur" }],
        enrollLevelIn: [{ required: false, message: "请选择", trigger: "blur" }]
      },
      enrollLevelList: [],
      directionsList: [],
      channelList: [],
      followTagsList: []
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters([
      "permissions",
      "dictionary",
      "userList",
      "i18nlocel",
      "pooldictionary",
      "pooldictpermissions",
      "dictpermissions"
    ])
  },
  methods: {
    init(clueData, studentData, firstGuardians) {
      this.clueForm = {
        ...this.clueForm,
        ...clueData
      };
      console.log("this.clueForm", this.clueForm);
      this.ruleForm = {
        ...this.ruleForm,
        ...studentData
      };
      this.firstGuardians = {
        ...this.firstGuardians,
        ...firstGuardians
      };
      this.getTypeList(studentData.applySchool, false);
      this.$nextTick(() => {
        let channelList = [];
        if (clueData.channel) {
          channelList.push(clueData.channel);
          if (clueData.channelChildOne) {
            channelList.push(clueData.channelChildOne);
          }
        }
        console.log("channelList", channelList);
        this.$refs["SelectChannle"].cascaderValue = channelList;
      });
    },
    setSelectList(e) {
      console.log("changeSchool", e);
      this.getTypeList(e, true);
    },
    getTypeList(e, isClear) {
      this.pooldictpermissions.map(item => {
        if (item.value == e) {
          this.enrollLevelList = item["child"]["enquiry_enroll_level"]
            ? item["child"]["enquiry_enroll_level"]
            : [];
          this.directionsList = item["child"]["enquiry_direction"]
            ? item["child"]["enquiry_direction"]
            : [];
          this.channelList = item["child"]["enquiry_channel"]
            ? item["child"]["enquiry_channel"]
            : [];
          this.followTagsList = item["child"]["enquiry_follow_tags"]
            ? item["child"]["enquiry_follow_tags"]
            : [];
          this.$nextTick(() => {
            this.setRequireType(item.id, isClear);
          });
        }
      });
    },
    async setRequireType(id, isClear) {
      let Obj = await getDictTypeRequired(id);
      console.log("getDictTypeRequired", Obj);
      Object.keys(this.rules).forEach(res => {
        if (Obj[res]) {
          this.$set(this.rules[res], 0, {
            ...this.rules[res][0],
            required: Obj[res] == "true"
          });
          console.log("this.rules", this.rules);
          if (isClear) {
            this.ruleForm["enrollLevel"] = "";
            this.ruleForm["enrollLevelIn"] = "";
            this.ruleForm["direction"] = "";
            this.clueForm["channel"] = "";
            this.clueForm["channelChildOne"] = "";
            this.clueForm["enrollLevel"] = "";
            this.clueForm["followTags"] = "";
            if (this.channelList.length > 0) {
              this.$refs["SelectChannle"].cascaderValue = [];
            }
          }
        }
      });
      this.changeForm(1);
    },
    editStudent(data) {
      editStudent(data).then(res => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
        }
      });
    },
    async submitForm() {
      let checkruleForm = await this.validateForm("ruleForm");
      let checkclueForm = await this.validateForm("clueForm");
      let checkfirstGuardians = await this.validateForm("firstGuardians");
      if (checkruleForm && checkclueForm && checkfirstGuardians) {
        let data = {
          clue: this.clueForm,
          student: this.ruleForm,
          parent: this.firstGuardians
        };
        this.editStudent(data);
      }
    },
    validateForm(form) {
      let _this = this;
      return new Promise(function(resolve, reject) {
        _this.$refs[form].validate(valid => {
          if (valid) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    },

    closeModal() {
      this.clueForm = {
        studentName: "",
        contactMethod: "",
        guardianTitle: "",
        enrollLevel: "",
        awardScholarship: "",
        channel: "",
        channelChildOne: "",
        followTags: ""
      };
      this.firstGuardians = {
        firstName: "",
        lastName: "",
        sex: "",
        relationType: "",
        nationality: "",
        language: "",
        phone: "",
        email: "",
        wechat: "",
        schoolTour: ""
      };
      this.ruleForm = {
        firstName: "",
        lastName: "",
        sex: "",
        birthday: "",
        enrollYear: "",
        enrollLevel: "",
        nationality: "",
        language: "",
        homeAddress: "",
        studentNameEn: "",
        scholarshipRemission: 0,
        enrollLevelIn: "",
        atSchool: ""
      };
      this.$emit("changeModal", false);
    },
    changeForm(e) {
      this.$refs["clueForm"].clearValidate("enrollLevel");
      this.$refs["clueForm"].clearValidate("channel");
      this.$refs["ruleForm"].clearValidate("sex");
      this.$refs["ruleForm"].clearValidate("enrollLevel");
      this.$refs["ruleForm"].clearValidate("direction");
      this.$refs["ruleForm"].clearValidate("enrollLevelIn");
      this.$refs["firstGuardians"].clearValidate("sex");
      this.$refs["firstGuardians"].clearValidate("relationType");
    },
    changeSchool(e) {
      this.getTypeList(e, true);
    },
    setChannel(data) {
      switch (data.length) {
        case 0:
          this.clueForm["channel"] = "";
          this.clueForm["channelChildOne"] = "";
          break;
        case 1:
          this.clueForm["channel"] = data[0];
          this.clueForm["channelChildOne"] = "";
          break;
        case 2:
          this.clueForm["channel"] = data[0];
          this.clueForm["channelChildOne"] = data[1];
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form-item--small.el-form-item {
  margin-right: 0px;
  padding-right: 20px;
  box-sizing: border-box;
}
</style>
