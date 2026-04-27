<template>
  <div>
    <el-dialog
      :title="$t('consult.新增学生')"
      :visible.sync="showAdd"
      width="800px"
      :before-close="closeModal"
      :close-on-click-modal="false"
    >
      <div class="moadlFromBox">
        <el-form
          :label-position="'top'"
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <div class="df_center_wrap">
            <el-form-item
              :label="$t('consult.学生姓名')"
              prop="studentName"
              style="width: 50%"
            >
              <el-input
                v-model.trim="ruleForm.studentName"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>

            <el-form-item
              :label="$t('consult.校区')"
              prop="applySchool"
              style="width: 50%"
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
              style="width: 50%"
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
              v-if="directionsList.length > 0"
              :label="$t('consult.方向')"
              prop="direction"
              style="width: 50%"
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
              v-if="channelList.length > 0"
              :label="$t('consult.渠道')"
              prop="channel"
              style="width: 50%"
            >
              <SelectChannle
                ref="SelectChannle"
                :options="channelList"
                @setChannel="setChannel"
              />
            </el-form-item>
            <el-form-item
              :label="$t('consult.在读学校')"
              prop="atSchool"
              style="width: 50%"
            >
              <el-input
                v-model.trim="ruleForm.atSchool"
                :placeholder="$t('consult.请输入')"
                maxlength="100"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.家长称谓')"
              prop="guardianTitle"
              style="width: 50%"
            >
              <el-input
                v-model.trim="ruleForm.guardianTitle"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.来源')"
              prop="origin"
              style="width: 50%"
            >
              <el-input
                v-model.trim="ruleForm.origin"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.联系方式')"
              prop="contactMethod"
              style="width: 50%"
            >
              <el-input
                v-model.trim="ruleForm.contactMethod"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.奖学金')"
              prop="awardScholarship"
              style="width: 50%"
            >
              <el-input
                v-model.trim="ruleForm.awardScholarship"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.微信号')"
              prop="wechat"
              style="width: 50%"
            >
              <el-input
                v-model.trim="ruleForm.wechat"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
          </div>
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
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { addStudentClue, addHybridClue } from "@/api/consult/index.js";
import { getDictTypeRequired } from "@/api/publik";
import SelectChannle from "@/components/common/pooldictselect/selectchannle.vue";
export default {
  name: "addStudent",
  components: {
    SelectChannle
  },
  props: {
    showAdd: Boolean,
    isMine: Boolean
  },
  data() {
    return {
      ruleForm: {
        studentName: "",
        enrollLevel: "",
        guardianTitle: "",
        contactMethod: "",
        origin: "",
        applySchool: "",
        awardScholarship: "",
        channel: "",
        channelChildOne: "",
        direction: "",
        wechat: ""
      },
      rules: {
        studentName: [{ required: true, message: "请输入", trigger: "blur" }],
        student_name_en: [
          { required: true, message: "请输入", trigger: "blur" }
        ],
        enrollLevel: [{ required: false, message: "请选择", trigger: "blur" }],
        channel: [{ required: false, message: "请选择", trigger: "blur" }],
        direction: [{ required: false, message: "请选择", trigger: "blur" }],
        atSchool: [{ required: false, message: "请输入", trigger: "blur" }],
        guardianTitle: [{ required: true, message: "请输入", trigger: "blur" }],
        contactMethod: [{ required: true, message: "请输入", trigger: "blur" }],
        applySchool: [{ required: true, message: "请选择", trigger: "blur" }],
        awardScholarship: [
          { required: false, message: "请选择", trigger: "blur" }
        ]
      },
      enrollLevelList: [],
      directionsList: [],
      channelList: [],
      dictRequireObj: {
        channel: false,
        direction: false,
        enrollLevel: false,
        followTags: false
      }
    };
  },
  created() {
    this.$nextTick(() => {
      if (this.pooldictpermissions.length == 1) {
        this.ruleForm["applySchool"] = this.pooldictpermissions[0].value;
        this.changeSchool(this.pooldictpermissions[0].value);
      }
    });
  },
  mounted() {},
  computed: {
    ...mapGetters([
      "permissions",
      "dictionary",
      "dictpermissions",
      "i18nlocel",
      "pooldictionary",
      "pooldictpermissions"
    ])
  },
  methods: {
    addHybridClue(data) {
      addHybridClue(data).then(res => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
        }
      });
    },
    addStudentClue(data) {
      addStudentClue(data).then(res => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = {
            ...this.ruleForm
            // isMine: this.isMine
          };
          // this.addHybridClue(data);
          this.addStudentClue(data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    closeModal() {
      this.ruleForm = {
        studentName: "",
        enrollLevel: "",
        guardianTitle: "",
        contactMethod: "",
        applySchool: "",
        awardScholarship: "",
        channel: "",
        direction: "",
        wechat: "",
        atSchool: ""
      };
      this.$emit("changeModal", false);
    },
    changeEnrollLevel(e) {
      this.$refs["ruleForm"].validateField("enrollLevel");
    },
    changeDirection(e) {
      this.$refs["ruleForm"].validateField("direction");
    },
    changeSchool(e) {
      console.log("changeSchool", e);

      this.pooldictpermissions.map(item => {
        if (item.value == e) {
          // if(item["child"])
          this.enrollLevelList = item["child"]["enquiry_enroll_level"]
            ? item["child"]["enquiry_enroll_level"]
            : [];
          this.directionsList = item["child"]["enquiry_direction"]
            ? item["child"]["enquiry_direction"]
            : [];
          this.channelList = item["child"]["enquiry_channel"]
            ? item["child"]["enquiry_channel"]
            : [];
          this.$nextTick(() => {
            this.setRequireType(item.id);
            if (this.channelList.length > 0) {
              this.$refs["SelectChannle"].cascaderValue = [];
            }
          });
        }
      });
    },

    async setRequireType(id) {
      let Obj = await getDictTypeRequired(id);
      console.log("getDictTypeRequired", Obj);
      this.dictRequireObj = Obj;
      console.log(" this.dictRequireObj", this.dictRequireObj);
      Object.keys(this.rules).forEach(res => {
        if (Obj[res]) {
          this.ruleForm = {
            ...this.ruleForm,
            enrollLevel: "",
            channel: "",
            channelChildOne: "",
            direction: ""
          };
          this.$set(this.rules[res], 0, {
            ...this.rules[res][0],
            required: Obj[res] == "true"
          });
          console.log("this.rules", this.rules);
        }
      });
    },
    clearSchool() {
      this.enrollLevelList = [];
      this.directionsList = [];
      this.channelList = [];
      this.ruleForm = {
        ...this.ruleForm,
        enrollLevel: "",
        channel: "",
        channelChildOne: "",
        direction: ""
      };
    },
    setChannel(data) {
      this.$refs["ruleForm"].validateField("channel");
      switch (data.length) {
        case 0:
          this.ruleForm["channel"] = "";
          this.ruleForm["channelChildOne"] = "";
          break;
        case 1:
          this.ruleForm["channel"] = data[0];
          this.ruleForm["channelChildOne"] = "";
          break;
        case 2:
          this.ruleForm["channel"] = data[0];
          this.ruleForm["channelChildOne"] = data[1];
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
