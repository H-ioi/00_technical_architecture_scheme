<template>
  <div>
    <el-dialog
      :title="$t('consult.归属校区')"
      :visible.sync="showChangeSchool"
      width="500px"
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
                  :disabled="item.disable"
                ></el-option>
              </el-select>
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
import { editSchools } from "@/api/consult/index.js";
export default {
  name: "addStudent",
  props: {
    showChangeSchool: Boolean,
    clueId: String
  },
  data() {
    return {
      schoolList: [],
      ruleForm: {
        schools: []
      },
      rules: {
        schools: [{ required: true, message: "请选择", trigger: "blur" }]
      }
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
      "dictpermissions"
    ])
  },
  methods: {
    editSchools(data) {
      editSchools(data).then(res => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
        }
      });
    },
    setSchoolList(schools) {
      this.schoolList = [];
      let dataDictValues = this.userInfo["dataDictValues"];
      let schoolPermiss = [];
      if (dataDictValues["order_school"]) {
        schoolPermiss = dataDictValues["order_school"];
      }
      console.log("schoolPermiss", schoolPermiss);
      this.pooldictionary.map(item => {
        if (
          schools.includes(item.value) &&
          !schoolPermiss.includes(item.value)
        ) {
          let obj = {
            ...item,
            disable: true
          };
          this.schoolList.push(obj);
        }
      });
      this.schoolList = [...this.schoolList, ...this.pooldictpermissions];
      console.log(
        " this.schoolList",
        this.pooldictpermissions,
        this.schoolList
      );
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = new FormData();
          data.append("clueId", this.clueId);
          data.append("schools", this.ruleForm["schools"]);
          this.editSchools(data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    closeModal() {
      this.ruleForm = {
        schools: []
      };
      this.$emit("changeModal", false);
    },
    changeForm(e) {
      this.$refs["ruleForm"].validateField("schools");
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
