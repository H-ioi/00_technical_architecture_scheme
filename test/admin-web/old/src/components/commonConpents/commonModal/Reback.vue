<template>
  <el-dialog title="退回" :before-close="closeModal" :visible.sync="showreback">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      label-position="top"
    >
      <el-form-item label="退回原因" prop="reason">
        <el-input
          type="textarea"
          rows="3"
          placeholder="请输入退回原因"
          v-model="ruleForm.reason"
          maxlength="120"
          show-word-limit
          style="width: 60%"
        ></el-input>
      </el-form-item>
      <el-form-item class="fromBtn">
        <el-button>取消</el-button>
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
    showreback: Boolean,
    ruleForm: Object,
  },
  data() {
    return {
      rules: {},
    };
  },
  created() {},
  mounted() {},

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm);
          this.reback(this.ruleForm);
        } else {
          return false;
        }
      });
    },
    reback(data) {
      this.$emit("reback", data);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>