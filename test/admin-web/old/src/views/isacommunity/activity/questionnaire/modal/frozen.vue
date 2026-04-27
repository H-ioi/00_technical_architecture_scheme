<template>
  <div class="community_page">
    <el-dialog
      :title="$t('isagroup.更改冻结状态')"
      :visible.sync="showModal"
      width="300px"
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
              :label="$t('isagroup.是否冻结')"
              prop="frozen"
              style="width: 100%"
            >
              <el-select
                clearable
                style="width: 100%"
                v-model="ruleForm['frozen']"
                :placeholder="$t('isagroup.请选择')"
              >
                <el-option :label="$t('isagroup.是')" :value="1"> </el-option>
                <el-option :label="$t('isagroup.否')" :value="0"> </el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn" style="margin-top: 40px">
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
import { editFrozen } from "@/api/isacommunity/questionnaire.js";
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
        frozen: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
      },
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "dictionary", "i18nlocel"]),
  },
  methods: {
    async initData(ids) {
      this.ruleForm["ids"] = ids;
      this.showModal = true;
    },
    editFrozen() {
      let formData = new FormData();
      formData.append("ids", this.ruleForm["ids"]);
      formData.append("frozen", this.ruleForm["frozen"]);
      editFrozen(formData).then((res) => {
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
          this.editFrozen();
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
