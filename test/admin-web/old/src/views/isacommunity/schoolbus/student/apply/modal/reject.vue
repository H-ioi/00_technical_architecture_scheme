<template>
  <div class="community_page">
    <el-dialog
      :title="$t('isagroup.批量拒绝')"
      :visible.sync="showModal"
      width="800px"
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
              :label="$t('isagroup.拒绝原因')"
              prop="denyReason"
              style="width: 100%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.denyReason"
                :placeholder="$t('consult.请输入')"
                type="textarea"
                rows="6"
              ></el-input>
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
import { batchDeny } from "@/api/isacommunity/busorder.js";
export default {
  name: "operation",
  components: {},
  props: {},
  data() {
    let that = this;
    return {
      typeObj: { add: "新增", edit: "编辑", look: "查看" },
      showModal: false,
      ruleForm: {},
      rules: {
        denyReason: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
      },
      selectionId: [],
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "dictionary", "i18nlocel"]),
  },
  methods: {
    // 打开
    showForm(ids) {
      this.selectionId = ids;
      this.showModal = true;
    },

    // 编辑
    batchDeny(data) {
      batchDeny(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            denyReason: this.ruleForm.denyReason,
            ids: this.selectionId,
          };
          this.batchDeny(data);
        }
      });
    },
    // 关闭
    closeModal() {
      this.showModal = false;
      this.$refs.ruleForm.resetFields();
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
