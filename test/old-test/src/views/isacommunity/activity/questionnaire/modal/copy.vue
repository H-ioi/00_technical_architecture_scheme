<template>
  <div class="community_page">
    <el-dialog
      :title="$t('isagroup.复制问卷')"
      :visible.sync="showModal"
      width="1000px"
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
          <div class="df_center_wrap">
            <el-form-item
              :label="$t('isagroup.问卷名称')"
              prop="newName"
              style="width: 50%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.newName"
                :placeholder="$t('consult.请输入')"
                maxlength="100"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.活动')"
              prop="newActivityId"
              style="width: 50%"
            >
              <el-select
                clearable
                style="width: 100%"
                v-model="ruleForm['newActivityId']"
                :placeholder="$t('isagroup.请选择')"
              >
                <el-option
                  v-for="(i, k) in activityList"
                  :key="k"
                  :label="i18nlocel == 'en' ? i.activityEnName : i.activityCnName"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button type="primary" size="medium" @click="submitForm('ruleForm')">{{
              $t("isagroup.确认")
            }}</el-button>
            <el-button type="default" size="medium" @click="closeModal">{{
              $t("isagroup.取消")
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { copyQuestionnaire } from "@/api/isacommunity/questionnaire.js";
import { getActivityList } from "@/api/isacommunity/activity.js";
import consts from "@/const/isacommunity/consts.js";
export default {
  name: "operation",
  components: {},
  props: {},
  data() {
    let that = this;
    return {
      consts: consts,
      showModal: false,
      ruleForm: {},
      rules: {
        newName: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        newActivityId: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
      },
      activityList: [],
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "dictionary", "i18nlocel"]),
  },
  methods: {
    async initData(id) {
      this.ruleForm["id"] = id;
      this.activityList = await getActivityList();
      this.showModal = true;
    },
    copyQuestionnaire(data) {
      //   let formatData = new FormData();
      //   for (let key in data) {
      //     formatData.append(key, data[key]);
      //   }
      copyQuestionnaire(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    submitForm() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.copyQuestionnaire(this.ruleForm);
        }
      });
    },
    // 关闭
    closeModal() {
      this.ruleForm = {};
      this.$refs.ruleForm.resetFields();
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
