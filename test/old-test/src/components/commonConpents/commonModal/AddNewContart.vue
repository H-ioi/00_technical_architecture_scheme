<template>
  <el-dialog
    title="联系人"
    :before-close="cancel"
    :visible.sync="showAddNewContart"
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
        :InputData="ContacterFormData"
        :inputwidth="inputwidth"
        :ruleForm="ruleForm"
        :isedit="true"
      />
      <el-form-item class="fromBtn">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { ContacterFormData, rulesAll } from "@/const/fromdata/index.js";
import AnyInput from "@/components/commonConpents/commonFrom/AnyInput";
export default {
  name: "UniUiAddnewcontart",
  props: {
    showAddNewContart: Boolean,
    ruleForm: Object,
  },
  data() {
    return {
      rules: {},
      inputwidth: "50%",
      ContacterFormData: ContacterFormData,
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
          this.changeshowAddNewContart(this.ruleForm);
        } else {
          return false;
        }
      });
    },
    changeshowAddNewContart(data) {
      this.$emit("changeshowAddNewContart", data);
    },
    cancel() {
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