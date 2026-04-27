<template>
  <div class="thepool_page">
    <el-dialog
      :title="$t('consult.完成任务')"
      :visible.sync="showModal"
      width="600px"
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
            <el-form-item
              :label="$t('consult.提醒方式')"
              prop="reminderType"
              style="width: 100%"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm.reminderType"
                :placeholder="$t('consult.请选择')"
              >
                <el-option
                  v-for="item in consult['expirationReminder']"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('consult.评论')" prop="comment" style="width: 100%">
              <el-input
                v-model="ruleForm.comment"
                :placeholder="$t('consult.请输入')"
                maxlength="800"
                type="textarea"
                rows="8"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('consult.备注')" prop="remark" style="width: 100%">
              <el-input
                v-model="ruleForm.remark"
                :placeholder="$t('consult.请输入')"
                maxlength="800"
                type="textarea"
                rows="8"
              ></el-input>
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
import { addComplete } from "@/api/consult/task.js";
import { consult } from "@/const/consult/index.js";
export default {
  name: "guardians",
  components: {},
  props: {
    taskId: {
      type: String,
      required: true,
    },
  },
  data() {
    let that = this;
    return {
      consult: consult,
      type: "add",
      showModal: false,
      ruleForm: {},
      rules: {
        comment: [
          { required: true, message: that.$t("consult.请输入"), trigger: "blur" },
        ],
        reminderType: [
          { required: true, message: that.$t("consult.请选择"), trigger: "blur" },
        ],
        remark: [
          { required: false, message: that.$t("consult.请输入"), trigger: "blur" },
        ],
      },
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "i18nlocel"]),
  },
  methods: {
    async initModal() {
      this.type = "add";
      this.showModal = true;
    },

    addComplete() {
      let data = {
        taskId: this.taskId,
        ...this.ruleForm,
      };
      addComplete(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.closeModal();
          this.$emit("initData");
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addComplete();
        }
      });
    },
    closeModal() {
      this.type = "add";
      this.ruleForm = {};
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
