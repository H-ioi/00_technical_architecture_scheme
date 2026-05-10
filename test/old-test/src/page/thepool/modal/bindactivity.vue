<template>
  <div class="thepool_page">
    <el-dialog
      :title="$t('consult.关联活动')"
      :visible="showModal"
      width="400px"
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
              :label="$t('consult.关联活动')"
              prop="activityIds"
              style="width: 100%"
            >
              <el-select
                v-model="ruleForm.activityIds"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
              >
                <el-option
                  v-for="item in activityList"
                  :key="item.id"
                  :label="item.activityName"
                  :value="String(item.id)"
                >
                </el-option>
              </el-select>
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
import { getActivityOpt } from "@/api/consult/activity.js";
import { relatedActivity } from "@/api/consult/collection.js";
export default {
  name: "guardians",
  components: {},
  props: {},
  data() {
    let that = this;
    return {
      showModal: false,
      activityList: [],
      ruleForm: {
        activityIds: "",
      },
      rules: {
        activityIds: [
          { required: true, message: that.$t("consult.请选择"), trigger: "change" },
        ],
      },
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["pooldictpermissions", "permissions", "dictionary", "i18nlocel"]),
  },
  methods: {
    show(data) {
      this.showModal = true;
      this.getActivityOpt();
      this.$nextTick(() => {
        this.ruleForm = {
          ...data,
        };
        console.log("this.ruleForm", this.ruleForm);
      });
    },
    getActivityOpt() {
      let school = this.pooldictpermissions.map((item) => {
        return item.value;
      });
      getActivityOpt({ school }).then((res) => {
        if (res.data.success) {
          this.activityList = res.data.data;
        }
      });
    },
    relatedActivity(data) {
      relatedActivity(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("updateData");
          this.closeModal();
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.relatedActivity({
            ...this.ruleForm,
            activityIds: this.ruleForm["activityIds"]
              ? [this.ruleForm["activityIds"]]
              : [],
          });
        } else {
          return false;
        }
      });
    },
    closeModal() {
      this.ruleForm = {
        activityIds: "",
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
