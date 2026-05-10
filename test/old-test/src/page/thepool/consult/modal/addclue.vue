<template>
  <div class="thepool_page">
    <el-dialog
      :title="$t('consult.新增线索')"
      :visible.sync="showAdd"
      width="800px"
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
          <div class="df_center_wrap">
            <el-form-item
              :label="$t('consult.家长称谓')"
              prop="guardianTitle"
              style="width: 50%"
            >
              <el-input
                v-model.trim="ruleForm.guardianTitle"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.学生姓名')"
              prop="studentName"
              style="width: 50%"
            >
              <el-input
                v-model.trim="ruleForm.studentName"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
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
                maxlength="50"
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
              :label="$t('consult.首次探校时间')"
              prop="schoolTour"
              style="width: 50%"
            >
              <el-date-picker
                style="width: 100%"
                v-model="ruleForm.schoolTour"
                type="date"
                placeholder="选择时间"
                :value-format="'yyyy-MM-dd'"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              :label="$t('consult.期望入读日期')"
              prop="expectReadDate"
              style="width: 50%"
            >
              <el-date-picker
                style="width: 100%"
                v-model="ruleForm.expectReadDate"
                type="date"
                placeholder="选择时间"
                :value-format="'yyyy-MM-dd'"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              :label="$t('consult.来源')"
              prop="origin"
              style="width: 50%"
            >
              <el-input
                v-model.trim="ruleForm.origin"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.备注')"
              prop="remark"
              style="width: 100%"
            >
              <el-input
                style="width: 100%"
                v-model.trim="ruleForm.remark"
                :placeholder="$t('consult.请输入')"
                maxlength="200"
                type="textarea"
              ></el-input>
            </el-form-item>
            <!-- 线索动态表单 -->
            <el-form-item style="width: 100%">
              <FromItem ref="FromItemClue" v-if="showTemplate" type="add" />
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
import { addStudentClue } from "@/api/consult/index.js";
import { getDictTypeRequired } from "@/api/publik";
import { getTemplateInfoByType } from "@/api/consult/template.js";
import SelectChannle from "@/components/common/pooldictselect/selectchannle.vue";
import FromItem from "@/components/thepoolcommon/dynamicform/fromitem.vue";
export default {
  name: "addStudent",
  components: {
    SelectChannle,
    FromItem,
  },
  props: {
    showAdd: Boolean,
    isMine: Boolean,
  },
  data() {
    let that = this;
    return {
      ruleForm: {
        applySchool: "",
        channel: null,
        channelChildOne: null,
        guardianTitle: "",
        studentName: "",
        contactMethod: "",
        origin: "",
        schoolTour: "",
        expectReadDate: "",
        remark: "",
        // enrollLevel: "",
        // direction: "",
      },
      rules: {
        applySchool: [
          {
            required: true,
            message: that.$t("consult.请选择"),
            trigger: "blur",
          },
        ],
        channel: [
          {
            required: false,
            message: that.$t("consult.请选择"),
            trigger: "blur",
          },
        ],
        contactMethod: [
          {
            required: true,
            message: that.$t("consult.请输入"),
            trigger: "blur",
          },
        ],
        // direction: [{ required: false, message: that.$t("consult.请输入"), trigger: "blur" }],
      },
      enrollLevelList: [],
      directionsList: [],
      channelList: [],
      dictRequireObj: {
        channel: false,
        direction: false,
        enrollLevel: false,
      },
      templateData: {
        outerId: "",
        scene: "enquiry_clue_school",
      },
      showTemplate: false,
      templateList: [],
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
      "pooldictpermissions",
    ]),
  },
  methods: {
    async initDynamicform() {
      let templateForm = await getTemplateInfoByType({ templateType: 3 });
      if (templateForm.length > 0) {
        this.templateList = [];
        templateForm.map((dynamicItem) => {
          if (dynamicItem.schoolId == this.ruleForm.applySchool) {
            this.templateList = dynamicItem.templates || [];
          }
        });
        if (this.templateList.length > 0) {
          this.showTemplate = true;
          this.$nextTick(() => {
            this.templateList.map((item) => {
              this.$refs[`FromItemClue`].getTemplateDetail(item);
            });
          });
        } else {
          this.showTemplate = false;
        }
      }
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
              `FromItemClue`
            ].saveFormArrValue();
            return submitDataObj;
          })
        ).then((submitData) => {
          resolve(submitData);
        });
      });
    },
    addStudentClue(data) {
      addStudentClue(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
        }
      });
    },
    async submitForm(formName) {
      let checkForm = true;
      let checkTemplate = true;
      this.$refs[formName].validate((valid) => {
        checkForm = valid;
      });
      if (this.showTemplate) {
        this.$refs["FromItemClue"].$refs["form"].validate((valid) => {
          checkTemplate = valid;
        });
      }

      if (checkForm && checkTemplate) {
        let clueInfo = {
          ...this.ruleForm,
        };
        if (clueInfo["channel"]) {
          clueInfo["channel"] = {
            channelId: clueInfo["channel"],
            channelName: this.getDataLabel(
              clueInfo.applySchool,
              "enquiry_channel",
              clueInfo.channel
            ),
          };
        } else {
          clueInfo["channel"] = {};
        }
        if (clueInfo["channelChildOne"]) {
          clueInfo["channelChildOne"] = {
            channelId: clueInfo["channelChildOne"],
            channelName: this.getDataLabel(
              clueInfo.applySchool,
              "enquiry_channel_child_one",
              clueInfo.channelChildOne
            ),
          };
        } else {
          clueInfo["channelChildOne"] = {};
        }
        let data = {
          clueInfo: clueInfo,
          dynamicInfos: [],
        };
        if (this.showTemplate) {
          data["dynamicInfos"] = await this.setDynamicFormData();
        }
        this.addStudentClue(data);
      }
    },

    closeModal() {
      this.ruleForm = {
        applySchool: "",
        channel: null,
        channelChildOne: null,
        guardianTitle: "",
        studentName: "",
        contactMethod: "",
        origin: "",
        schoolTour: "",
        expectReadDate: "",
        remark: "",
        // enrollLevel: "",
        // direction: "",
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
      this.pooldictpermissions.map((item) => {
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
          this.$nextTick(() => {
            this.setRequireType(item.id);
            if (this.channelList.length > 0) {
              this.$refs["SelectChannle"].cascaderValue = [];
            }
          });
        }
      });
      this.$nextTick(() => {
        this.initDynamicform();
      });
    },

    async setRequireType(id) {
      let Obj = await getDictTypeRequired(id);
      this.dictRequireObj = Obj;
      Object.keys(this.rules).forEach((res) => {
        if (Obj[res]) {
          this.ruleForm = {
            ...this.ruleForm,
            channel: "",
            channelChildOne: "",
          };
          this.$set(this.rules[res], 0, {
            ...this.rules[res][0],
            required: Obj[res] == "true",
          });
        }
      });
    },
    clearSchool() {
      this.enrollLevelList = [];
      this.directionsList = [];
      this.channelList = [];
      this.ruleForm = {
        ...this.ruleForm,
        channel: "",
        channelChildOne: "",
      };
    },
    setChannel(data) {
      switch (data.length) {
        case 0:
          this.ruleForm["channel"] = null;
          this.ruleForm["channelChildOne"] = null;
          break;
        case 1:
          this.ruleForm["channel"] = data[0];
          this.ruleForm["channelChildOne"] = null;
          break;
        case 2:
          this.ruleForm["channel"] = data[0];
          this.ruleForm["channelChildOne"] = data[1];
          break;
      }
      this.$refs["ruleForm"].validateField("channel");
    },
    getDataLabel(pid, type, cid) {
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
