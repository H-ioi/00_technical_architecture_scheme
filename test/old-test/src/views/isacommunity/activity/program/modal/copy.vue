<template>
  <div class="community_page">
    <el-dialog
      :title="$t('isagroup.复制')"
      :visible.sync="showModal"
      width="500px"
      :before-close="closeModal"
      :close-on-click-modal="false"
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
              prop="namePrefix"
              style="width: 100%"
              :label="$t('isagroup.项目名称前缀')"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm['namePrefix']"
                :placeholder="$t('common.请输入')"
                maxlength="100"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.活动')"
              prop="targetActivityId"
              style="width: 100%"
            >
              <el-select
                filterable
                style="width: 100%"
                v-model="ruleForm['targetActivityId']"
                :placeholder="$t('common.请选择')"
              >
                <el-option
                  v-for="(i, k) in activityList"
                  :label="i18nlocel == 'en' ? i.activityEnName : i.activityCnName"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button
              type="primary"
              size="medium"
              @click="submitForm('ruleForm')"
              :disabled="isSubmitting"
              :loading="isSubmitting"
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
import { copyActivityProgram } from "@/api/isacommunity/activityprogram.js";
import { getActivityList } from "@/api/isacommunity/activity.js";
export default {
  name: "operation",
  components: {},
  props: {},
  data() {
    let that = this;
    return {
      showModal: false,
      ruleForm: {},
      rules: {
        namePrefix: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        targetActivityId: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
      },
      selectionId: [],
      activityList: [],
      isSubmitting: false, // 添加防重提交状态
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "dictionary", "i18nlocel"]),
  },
  methods: {
    // 打开
    async show(selectionId) {
      this.selectionId = selectionId;
      this.showModal = true;
      this.activityList = await getActivityList();
    },
    batchCopy(data) {
      copyActivityProgram(data)
        .then((res) => {
          if (res.data.success) {
            this.$message.success(this.$t("isagroup.成功"));
            this.$emit("getList");
            this.closeModal();
          }
        })
        .catch(() => {
          // 异常处理
        })
        .finally(() => {
          // 无论成功失败，都重置提交状态
          this.isSubmitting = false;
        });
    },
    // 提交表单
    submitForm(formName) {
      // 如果正在提交，直接返回
      if (this.isSubmitting) return;

      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            sourceProgramIds: this.selectionId,
            namePrefix: this.ruleForm.namePrefix,
            targetActivityId: this.ruleForm.targetActivityId,
          };
          // 设置为提交中状态
          this.isSubmitting = true;
          this.batchCopy(data);
        }
      });
    },
    // 关闭
    closeModal() {
      this.selectionId = [];
      this.activityList = [];
      this.showModal = false;
      this.$refs.ruleForm.resetFields();
      // 关闭时重置提交状态
      this.isSubmitting = false;
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
