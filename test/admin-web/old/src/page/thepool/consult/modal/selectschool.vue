<template>
  <div class="thepool_page">
    <el-dialog
      :title="$t('consult.校区')"
      :visible.sync="innerVisible"
      width="650px"
      :before-close="closeModal"
      :close-on-click-modal="false"
      custom-class="pooldialog"
    >
      <el-form
        ref="from"
        class="df_align_center"
        :label-position="'top'"
        :inline="true"
        :model="from"
        :rules="rules"
      >
        <div>
          <el-form-item
            :label="$t('consult.校区')"
            prop="applySchool"
            style="width: 100%"
          >
            <el-select
              style="width: 100%"
              clearable
              v-model="from.applySchool"
              :placeholder="$t('consult.请选择')"
            >
              <el-option
                v-for="item in pooldictpermissions"
                :key="item.value"
                :label="i18nlocel == 'en' ? item.enLabel : item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="modalFromBtn">
            <el-button type="primary" size="medium" round @click="submitForm('from')">{{
              $t("consult.保存")
            }}</el-button>
            <el-button type="default" size="medium" round @click="closeModal">{{
              $t("consult.取消")
            }}</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {},
  data() {
    let that = this;
    return {
      innerVisible: false,
      type: "",
      from: { applySchool: "" },
      rules: {
        applySchool: [
          { required: true, message: that.$t("consult.请选择"), trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapGetters([
      "dictionary",
      "i18nlocel",
      "permissions",
      "dictpermissions",
      "pooldictpermissions",
    ]),
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit(this.type, this.from.applySchool);
          this.closeModal();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    closeModal() {
      this.from = { applySchool: "" };
      this.innerVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.modalFromBtn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.batchupload_btn_box {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .batchupload_btn {
    margin-right: 30px;
  }
}
</style>
