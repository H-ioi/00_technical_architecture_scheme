<template>
  <div>
    <el-dialog
      :title="$t('consult.批量编辑')"
      :visible.sync="show"
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
              :label="$t('consult.校区')"
              prop="applySchool"
              style="width: 50%"
            >
              <el-select
                v-model="ruleForm.applySchool"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
                @change="changeSchool"
                @clear="clearSchool"
              >
                <el-option
                  v-for="item in pooldictpermissions"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="enrollLevelList.length > 0"
              :label="$t('consult.申请年级')"
              prop="enrollLevelClue"
              style="width: 50%"
            >
              <el-select
                v-model="ruleForm.enrollLevelClue"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
                @change="changeEnrollLevelClue"
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
              v-if="directionList.length > 0"
              :label="$t('consult.方向')"
              prop="direction"
              style="width: 50%"
            >
              <el-select
                v-model="ruleForm.direction"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
              >
                <el-option
                  v-for="item in directionList"
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
              <!-- <el-select
                v-model="ruleForm.channel"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
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
              :label="$t('consult.入学年份')"
              prop="enrollYear"
              style="width: 50%"
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
              v-if="enrollLevelList.length > 0"
              :label="$t('consult.入学年级')"
              prop="enrollLevelStudent"
              style="width: 50%"
            >
              <el-select
                v-model="ruleForm.enrollLevelStudent"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
                @change="changeEnrollLevelStudent"
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
              :label="$t('consult.国籍')"
              prop="nationality"
              style="width: 50%"
            >
              <el-input
                v-model.trim="ruleForm.nationality"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.语言')"
              prop="language"
              style="width: 50%"
            >
              <el-input
                v-model.trim="ruleForm.language"
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
import { batchEditClue, getClueDetail } from "@/api/consult/index.js";
import { getDictTypeRequired } from "@/api/publik";
import SelectChannle from "@/components/common/pooldictselect/selectchannle.vue";
export default {
  name: "addStudent",
  props: {
    show: Boolean,
    clueIds: Array
  },
  components: {
    SelectChannle
  },
  data() {
    return {
      ruleForm: {
        applySchool: "",
        enrollLevelClue: "",
        enrollLevelStudent: "",
        enrollYear: "",
        language: "",
        nationality: "",
        origin: "",
        channel: "",
        channelChildOne: "",
        direction: ""
      },
      rules: {
        applySchool: [{ required: true, message: "请选择", trigger: "blur" }],
        enrollLevelClue: [
          { required: true, message: "请选择", trigger: "blur" }
        ],
        enrollLevelStudent: [
          { required: true, message: "请选择", trigger: "blur" }
        ],
        enrollYear: [{ required: true, message: "请选择", trigger: "blur" }],
        channel: [{ required: true, message: "请选择", trigger: "blur" }],
        direction: [{ required: true, message: "请选择", trigger: "blur" }],
        language: [{ required: false, message: "请输入", trigger: "blur" }],
        nationality: [{ required: false, message: "请输入", trigger: "blur" }],
        origin: [{ required: false, message: "请输入", trigger: "blur" }]
      },
      enrollLevelList: [],
      directionList: [],
      channelList: [],
      isClearEnrollLevelClue: true
    };
  },
  created() {},
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
    editSingleStudent(clueId, type) {
      getClueDetail(clueId).then(res => {
        if (res.data.success) {
          let { clue, student } = res.data.data;
          this.isClearEnrollLevelClue = type;
          this.getTypeList(student.applySchool, false);
          this.ruleForm = {
            ...this.ruleForm,
            applySchool: student.applySchool,
            enrollLevelClue: clue.enrollLevel,
            enrollLevelStudent: student.enrollLevel,
            origin: clue.origin,
            enrollYear:
              student.enrollYear == null
                ? student.enrollYear
                : String(student.enrollYear),
            language: student.language,
            nationality: student.nationality,
            channel: clue.channel,
            channelChildOne: clue.channelChildOne,
            direction: student.direction
          };
          this.$nextTick(() => {
            let channelList = [];
            if (clue.channel) {
              channelList.push(clue.channel);
              if (clue.channelChildOne) {
                channelList.push(clue.channelChildOne);
              }
            }
            console.log("channelList", channelList);
            if (this.channelList.length > 0) {
              this.$refs["SelectChannle"].cascaderValue = channelList;
            }
          });
        }
      });
    },
    batchEditClue(url) {
      batchEditClue(url).then(res => {
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
            ...this.ruleForm,
            clueIds: this.clueIds
          };
          console.log("batchEditClue", data);
          // return;
          this.batchEditClue(data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    closeModal() {
      this.ruleForm = {
        applySchool: "",
        enrollLevelClue: "",
        enrollLevelStudent: "",
        enrollYear: "",
        language: "",
        nationality: "",
        origin: "",
        channel: "",
        channelChildOne: "",
        direction: ""
      };
      this.$emit("changeModal", false);
    },
    changeEnrollLevelClue(e) {
      this.$refs["ruleForm"].validateField("enrollLevelClue");
    },
    changeEnrollLevelStudent(e) {
      this.$refs["ruleForm"].validateField("enrollLevelStudent");
    },
    changeSchool(e) {
      this.getTypeList(e, true);
    },
    getTypeList(e, isClear) {
      this.pooldictpermissions.map(item => {
        if (item.value == e) {
          this.enrollLevelList = item["child"]["enquiry_enroll_level"]
            ? item["child"]["enquiry_enroll_level"]
            : [];
          this.directionList = item["child"]["enquiry_direction"]
            ? item["child"]["enquiry_direction"]
            : [];
          this.channelList = item["child"]["enquiry_channel"]
            ? item["child"]["enquiry_channel"]
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
      if (Obj["enrollLevel"]) {
        this.$set(this.rules["enrollLevelClue"], 0, {
          ...this.rules["enrollLevelClue"][0],
          required: Obj["enrollLevel"] == "true"
        });
      }
      if (Obj["channel"]) {
        this.$set(this.rules["channel"], 0, {
          ...this.rules["channel"][0],
          required: Obj["channel"] == "true"
        });
      }
      if (Obj["direction"]) {
        this.$set(this.rules["direction"], 0, {
          ...this.rules["direction"][0],
          required: Obj["direction"] == "true"
        });
      }

      console.log("this.rules", this.rules);
      if (isClear) {
        this.ruleForm["enrollLevelClue"] = "";
        this.ruleForm["channel"] = "";
        this.ruleForm["direction"] = "";
      }
    },
    clearSchool() {
      this.enrollLevelList = [];
      this.ruleForm = {
        ...this.ruleForm,
        enrollLevelClue: "",
        enrollLevelStudent: "",
        channel: "",
        channelChildOne: "",
        direction: ""
      };
    },
    setChannel(data) {
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
