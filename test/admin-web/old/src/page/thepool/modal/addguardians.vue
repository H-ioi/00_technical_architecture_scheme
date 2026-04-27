<template>
  <div class="thepool_page">
    <el-dialog
      :title="
        (type == 'add' ? $t('consult.新增') : $t('consult.编辑')) + $t('consult.家长信息')
      "
      :visible.sync="showModal"
      width="800px"
      :before-close="closeModal"
      :close-on-click-modal="false"
      custom-class="pooldialog"
    >
      <div class="moadlFromBox" v-if="showModal">
        <el-form
          :label-position="'top'"
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <div class="df_center_wrap" style="max-height: 600px; overflow-y: auto">
            <el-form-item :label="$t('consult.姓')" prop="lastName" style="width: 50%">
              <el-input
                v-model="ruleForm.lastName"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('consult.名')" prop="firstName" style="width: 50%">
              <el-input
                v-model="ruleForm.firstName"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('consult.性别')" prop="sex" style="width: 50%">
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
            <el-form-item :label="$t('consult.电话')" prop="phone" style="width: 50%">
              <el-input
                v-model="ruleForm.phone"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('consult.微信号')" prop="wechat" style="width: 50%">
              <el-input
                v-model="ruleForm.wechat"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.邮箱')"
              prop="contactMethod"
              style="width: 50%"
            >
              <el-input
                v-model="ruleForm.email"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.国籍')"
              prop="nationality"
              style="width: 50%"
            >
              <!-- <el-input
                v-model="ruleForm.nationality"
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
            <el-form-item :label="$t('consult.语言')" prop="language" style="width: 50%">
              <el-input
                v-model="ruleForm.language"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
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
              v-if="showRelationType"
              :label="$t('consult.和申请人的关系')"
              prop="relationType"
              style="width: 50%"
            >
              <el-select
                v-model="ruleForm.relationType"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
              >
                <el-option
                  v-for="item in dictionary['enquiry_relation_type']"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <!-- 家长动态表单 -->
            <el-form-item
              style="width: 100%"
              v-for="(item, index) in templateList"
              :key="index"
            >
              <FromItem :ref="`FromItemGuardian${item.templateId}`" type="add" />
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
import { addGuardian, editGuardian, getGuardianDetail } from "@/api/consult/student.js";
import { getTemplateInfoByType } from "@/api/consult/template.js";
import countryList from "country-list";
import FromItem from "@/components/thepoolcommon/dynamicform/fromitem.vue";
export default {
  name: "guardians",
  components: {
    FromItem,
  },
  props: {},
  data() {
    let that = this;
    return {
      type: "add",
      showRelationType: false,
      showModal: false,
      sexList: consult["sexList"],
      ruleForm: {
        firstName: "",
        lastName: "",
        // applySchool: "",
        sex: "",
        // relationType: "",
        nationality: "",
        language: "",
        phone: "",
        email: "",
        schoolTour: "",
        wechat: "",
      },
      rules: {
        firstName: [
          { required: true, message: that.$t("consult.请输入"), trigger: "blur" },
        ],
        lastName: [
          { required: true, message: that.$t("consult.请输入"), trigger: "blur" },
        ],
        sex: [{ required: false, message: that.$t("consult.请选择"), trigger: "blur" }],
        nationality: [
          { required: false, message: that.$t("consult.请输入"), trigger: "blur" },
        ],
        language: [
          { required: false, message: that.$t("consult.请输入"), trigger: "blur" },
        ],
        phone: [{ required: true, message: that.$t("consult.请输入"), trigger: "blur" }],
        relationType: [
          { required: true, message: that.$t("consult.请选择"), trigger: "blur" },
        ],
      },
      templateData: {
        outerId: "0",
        scene: "enquiry_guardian",
      },
      templateList: [],
      templateValue: {},
      guardianId: null,
      countryList: [],
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
    ...mapGetters(["pooldictpermissions", "permissions", "dictionary", "i18nlocel"]),
  },
  methods: {
    initGuardian() {
      this.showModal = true;
      this.initDynamicform();
    },
    async initDynamicform(dynamicInfos = []) {
      let templateForm = await getTemplateInfoByType({ templateType: 2 });
      console.log("templateForm", templateForm);
      if (templateForm.length > 0) {
        this.templateList = templateForm[0].templates || [];
        if (this.templateList.length > 0) {
          this.$nextTick(() => {
            this.templateList.map((item) => {
              let dynamicInfoItem = dynamicInfos.find(
                (dynamicItem) => dynamicItem.templateId == item.templateId
              );
              this.$refs[`FromItemGuardian${item.templateId}`][0].getTemplateDetail(
                item,
                dynamicInfoItem || {}
              );
            });
          });
        }
      }
    },
    addGuardian(data) {
      addGuardian(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
          this.closeModal();
        }
      });
    },
    editGuardian(data) {
      editGuardian(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
          this.closeModal();
        }
      });
    },
    addGuardianBindSt(id) {
      this.showRelationType = true;
      this.ruleForm["studentId"] = id;
      this.showModal = true;
      this.initGuardian();
    },
    addGuardianBindClue(id) {
      this.ruleForm["clueId"] = id;
      this.showModal = true;
      this.initGuardian();
    },
    setDynamicFormData() {
      return new Promise((resolve) => {
        Promise.all(
          this.templateList.map(async (item) => {
            let submitDataObj = {
              templateId: item.templateId, //模板id
              // type: 2, //类型  1-学生 2-家长 3-线索 4-信息收集表
              // typeId: this.guardianId, //类型id, 如学生id，
              fieldData: [],
            };
            submitDataObj["fieldData"] = await this.$refs[
              `FromItemGuardian${item.templateId}`
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
    getGuardianDetail(id) {
      getGuardianDetail(id).then(async (res) => {
        if (res.data.success) {
          this.guardianId = id;
          let { guardianInfo, dynamicInfos } = res.data.data;
          let data = guardianInfo;
          this.type = "edit";
          this.showModal = true;
          console.log("data", data);
          Object.keys(data).forEach((item) => {
            if (this.ruleForm.hasOwnProperty(item)) {
              this.ruleForm[item] =
                data[item] == null || data[item] == undefined ? "" : String(data[item]);
            }
          });
          this.ruleForm["id"] = data["id"];
          this.ruleForm["sex"] = String(data["sex"]);
          this.initDynamicform(dynamicInfos || []);
        }
      });
    },
    async submitForm(formName) {
      let checkForm = true;
      let checkTemplate = true;
      this.$refs[formName].validate((valid) => {
        checkForm = valid;
      });
      if (this.templateList.length > 0) {
        this.templateList.map((item) => {
          this.$refs[`FromItemGuardian${item.templateId}`][0].$refs["form"].validate(
            (valid) => {
              if (!valid) {
                checkTemplate = false;
              }
            }
          );
        });
      }
      if (checkForm && checkTemplate) {
        let data = {
          clueId: this.ruleForm["clueId"] || null, //线索id
          studentId: this.ruleForm["studentId"] || null, //学生id
          relationType: this.ruleForm["relationType"] || null, //和学生关系
          guardianInfo: this.ruleForm,
          dynamicInfos: [],
        };
        if (this.templateList.length > 0) {
          data["dynamicInfos"] = await this.setDynamicFormData();
        }
        console.log("data", data);

        if (this.type == "add") {
          this.addGuardian(data);
        } else {
          data["id"] = this.guardianId;
          this.editGuardian(data);
        }
      }
    },

    closeModal() {
      this.type = "add";
      this.ruleForm = {
        firstName: "",
        lastName: "",
        sex: "",
        nationality: "",
        language: "",
        phone: "",
        email: "",
        schoolTour: "",
        wechat: "",
      };
      this.showModal = false;
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
