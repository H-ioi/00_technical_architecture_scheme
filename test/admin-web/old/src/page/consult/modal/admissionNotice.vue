<template>
  <div>
    <el-dialog
      :title="$t('consult.入学通知')"
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
              :label="$t('consult.模板')"
              prop="templateId"
              style="width: 100%"
            >
              <el-select
                style="width: 100%"
                clearable
                v-model="ruleForm.templateId"
                :placeholder="$t('consult.请选择')"
              >
                <el-option
                  v-for="item in templates"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
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
import { getAdmissionNotice } from "@/api/consult/index.js";
import { download, downloadFile } from "@/util/download.js";
export default {
  name: "addStudent",
  props: {
    show: Boolean,
    clueIds: Array
  },
  data() {
    return {
      ruleForm: {
        templateId: ""
      },
      rules: {
        templateId: [{ required: true, message: "请选择", trigger: "blur" }]
      },
      templates: [
        {
          label: "Offer of Admission with Slip",
          value: 1
        },
        {
          label: "offer of Admission with Reply slip",
          value: 2
        }
      ]
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "dictionary", "dictpermissions"])
  },
  methods: {
    getAdmissionNotice(url) {
      getAdmissionNotice(url).then(res => {
        this.$message.success(this.$t("consult.成功"));
        // this.$emit("initData");
        download(res.data, res.headers["content-disposition"]);
        this.closeModal();
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let url = `${this.ruleForm.templateId}`;
          this.clueIds.map((item, index) => {
            if (index == 0) {
              url = url + `?clueIds=${item}`;
            } else {
              url = url + `&clueIds=${item}`;
            }
          });

          this.getAdmissionNotice(url);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    closeModal() {
      this.ruleForm = {
        templateId: ""
      };
      this.$emit("changeModal", false);
    },
    changeForm(e) {
      this.$refs["ruleForm"].validateField("templateId");
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
