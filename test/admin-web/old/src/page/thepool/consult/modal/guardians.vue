<template>
  <div class="thepool_page">
    <el-dialog
      :title="$t('consult.家长信息')"
      :visible.sync="showGuardians"
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
            <el-form-item :label="$t('consult.姓')" prop="lastName" style="width: 50%">
              <el-input
                v-model="ruleForm.lastName"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('consult.名')" prop="firstName" style="width: 50%">
              <el-input
                v-model="ruleForm.firstName"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
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
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
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
                  :disabled="!item.status"
                >
                </el-option>
              </el-select>
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
              <el-input
                v-model="ruleForm.nationality"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('consult.语言')" prop="language" style="width: 50%">
              <el-input
                v-model="ruleForm.language"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('consult.电话')" prop="phone" style="width: 50%">
              <el-input
                v-model="ruleForm.phone"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
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
import { addGuardian, editGuardian } from "@/api/consult/index.js";
export default {
  name: "guardians",
  props: {
    showGuardians: Boolean,
    studentId: String,
    guardiansType: String,
  },
  data() {
    let that = this;
    return {
      sexList: consult["sexList"],
      ruleForm: {
        firstName: "",
        lastName: "",
        sex: "",
        relationType: "",
        nationality: "",
        language: "",
        phone: "",
        email: "",
        schoolTour: "",
      },
      rules: {
        firstName: [
          { required: true, message: that.$t("consult.请输入"), trigger: "blur" },
        ],
        lastName: [
          { required: true, message: that.$t("consult.请输入"), trigger: "blur" },
        ],
        sex: [{ required: false, message: that.$t("consult.请选择"), trigger: "blur" }],
        relationType: [
          { required: true, message: that.$t("consult.请选择"), trigger: "blur" },
        ],
        nationality: [
          { required: false, message: that.$t("consult.请输入"), trigger: "blur" },
        ],
        language: [
          { required: false, message: that.$t("consult.请输入"), trigger: "blur" },
        ],
        phone: [{ required: false, message: that.$t("consult.请输入"), trigger: "blur" }],
      },
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "dictionary", "i18nlocel"]),
  },
  methods: {
    addGuardian(data) {
      addGuardian(data, this.studentId).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
        }
      });
    },
    editGuardian(data) {
      editGuardian(data, this.studentId).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          delete this.ruleForm["sexlabel"];
          delete this.ruleForm["relationTypelabel"];
          if (this.guardiansType == "add") {
            this.addGuardian(this.ruleForm);
          } else {
            this.editGuardian(this.ruleForm);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    closeModal() {
      this.ruleForm = {
        firstName: "",
        lastName: "",
        sex: "",
        relationType: "",
        nationality: "",
        language: "",
        phone: "",
        email: "",
        schoolTour: "",
      };
      this.$emit("changeModal", false);
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
