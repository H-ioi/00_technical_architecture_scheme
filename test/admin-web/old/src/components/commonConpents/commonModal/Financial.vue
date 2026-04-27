<template>
  <el-dialog
    title="财务信息"
    :before-close="closeModal"
    :visible.sync="showFinancial"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      label-position="top"
    >
      <AnyInput
        :InputData="FinancialForm"
        :inputwidth="inputwidth"
        :ruleForm="ruleForm"
        :isedit="true"
      />
      <el-form-item class="fromBtn">
        <el-button @click="closeModal">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { FinancialForm, rulesAll } from "@/const/fromdata/index.js";
import AnyInput from "@/components/commonConpents/commonFrom/AnyInput";
export default {
  name: "UniUiAddnewcontart",
  props: {
    showFinancial: Boolean,
    ruleForm: Object,
  },
  data() {
    return {
      rules: {},
      inputwidth: "50%",
      FinancialForm: FinancialForm,
    };
  },
  created() {
    this.rules = rulesAll();
  },
  mounted() {},

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm);
          this.changeFinancial(this.ruleForm);
        } else {
          return false;
        }
      });
    },
    changeFinancial(data) {
      this.$emit("changeFinancial", data);
    },
    closeModal() {
      this.$emit("closeModal", false);
    },
  },
  components: {
    AnyInput,
  },
};
</script>

<style lang="scss" scoped>
</style>