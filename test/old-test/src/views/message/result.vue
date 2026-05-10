<template>
  <el-dialog title="理由" :before-close="closeModal" :visible.sync="showresult">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      label-position="top"
    >
      <el-form-item label="原因" prop="result">
        <el-input
          type="textarea"
          rows="3"
          placeholder="请输入原因"
          v-model="ruleForm.result"
          maxlength="120"
          show-word-limit
          style="width: 60%"
        ></el-input>
      </el-form-item>
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
export default {
  name: "UniUiAddnewcontart",
  props: {
    showresult: Boolean,
  },
  data() {
    return {
      rules: {},
      ruleForm: {},
    };
  },
  created() {},
  mounted() {},

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm);
          this.$emit("changemessage", this.ruleForm);
        } else {
          return false;
        }
      });
    },
    closeModal() {
      this.$emit("closeModal", false);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>