<template>
  <div class="thepool_page">
    <el-dialog
      :title="$t('consult.归属校区')"
      :visible.sync="showChangeSchool"
      width="500px"
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
              :label="$t('consult.归属校区')"
              prop="schools"
              style="width: 100%"
            >
              <el-select
                style="width: 100%"
                clearable
                multiple
                v-model="ruleForm.schools"
                :placeholder="$t('consult.请选择')"
              >
                <el-option
                  v-for="item in schoolList"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
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
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { changeStudentShcool, changeGuardianShcool } from "@/api/consult/student.js";
export default {
  name: "addStudent",
  props: {
    type: String,
    id: String,
  },
  data() {
    let that = this;
    return {
      showChangeSchool: false,
      schoolList: [],
      ruleForm: {
        schools: [],
      },
      rules: {
        schools: [
          { required: true, message: that.$t("consult.请选择"), trigger: "blur" },
        ],
      },
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters([
      "permissions",
      "pooldictionary",
      "pooldictpermissions",
      "userInfo",
      "i18nlocel",
      "dictpermissions",
    ]),
  },
  methods: {
    changeSchool() {
      let formData = {};
      switch (this.type) {
        case "student":
          formData = {
            studentId: this.id,
            schools: this.ruleForm["schools"],
          };
          changeStudentShcool(formData).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t("consult.成功"));
              this.$emit("initData");
              this.closeModal();
            }
          });
          break;
        case "guardian":
          formData = {
            id: this.id,
            schools: this.ruleForm["schools"],
          };
          changeGuardianShcool(formData).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t("consult.成功"));
              this.$emit("initData");
              this.closeModal();
            }
          });
          break;
      }
    },
    setSchoolList(schools) {
      this.ruleForm["schools"] = schools;
      this.schoolList = [];
      let dataDictValues = this.userInfo["dataDictValues"];
      let schoolPermiss = [];
      if (dataDictValues["order_school"]) {
        schoolPermiss = dataDictValues["order_school"];
      }
      schools.map((item) => {
        if (!schoolPermiss.includes(item)) {
          schoolPermiss.push(item);
        }
      });
      this.pooldictionary.map((item) => {
        if (schoolPermiss.includes(item.value)) {
          this.schoolList.push(item);
        }
      });
      this.showChangeSchool = true;
      console.log(" this.schoolList", this.schoolList);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.changeSchool();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    closeModal() {
      this.showChangeSchool = false;
      this.ruleForm = {
        schools: [],
      };
    },
    changeForm(e) {
      this.$refs["ruleForm"].validateField("schools");
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
