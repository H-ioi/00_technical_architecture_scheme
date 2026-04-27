<template>
  <div class="thepool_page">
    <el-dialog
      :title="$t('consult.保存筛选信息')"
      :visible="showModal"
      width="1000px"
      :before-close="closeModal"
      :close-on-click-modal="false"
      custom-class="pooldialog"
    >
      <div class="moadlFromBox">
        <el-form
          v-if="showModal"
          :label-position="'top'"
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <div class="df_center_wrap">
            <el-form-item
              :label="$t('consult.查询条件名称')"
              prop="description"
              style="width: 100%"
            >
              <el-input
                v-model="ruleForm.description"
                :placeholder="$t('consult.请输入')"
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
export default {
  name: "guardians",
  components: {},
  props: {},
  data() {
    let that = this;
    return {
      type: "add",
      showModal: false,
      ruleForm: {},
      rules: {
        description: [
          { required: true, message: that.$t("consult.请输入"), trigger: "blur" },
        ],
      },
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters([
      "pooldictpermissions",
      "permissions",
      "dictionary",
      "i18nlocel",
      "userList",
    ]),
  },
  methods: {
    show() {
      this.showModal = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("saveRequestParam", this.ruleForm.description);
          this.closeModal();
        } else {
          return false;
        }
      });
    },
    closeModal() {
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
